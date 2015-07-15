var Edit = {
	loadLanguagesForSelector: function() {
		GetData.loadLanguages(Login.getSessionId(),
			function(result) {
				result.map(function(item) {
					$('.js-choose-language')
						.append($("<option></option>")
						.attr("value",item["id"])
						.text(item["name"])); 
				});
			},
			function(error) {
				console.log(error);
			});
	},
	addTagToSong: function(starttag,endtag) {
            var caretPosStart = $(".js-edit-text-textarea")[0].selectionStart;
            var caretPosEnd = $(".js-edit-text-textarea")[0].selectionEnd;
            var textAreaTxt = $(".js-edit-text-textarea").val();
            $(".js-edit-text-textarea").val(
                textAreaTxt.substring(0, caretPosStart) + starttag + textAreaTxt.substring(caretPosStart, caretPosEnd) +
                endtag + textAreaTxt.substring(caretPosEnd));
            $(".js-edit-text-textarea")[0].selectionStart = caretPosEnd+3;
            $(".js-edit-text-textarea")[0].selectionEnd = caretPosEnd+3;
    },
    sendSong: function(sessionid, songid, title, text, notes, lang, otherlang, labels, comment) {
    	SongData.addSong(sessionid, songid, title, text, notes, lang, otherlang, labels, comment,
    		function(result) {
    			Materialize.toast(Config.newSongSuccessful, 2000);
    			Edit.setEditedSong(result);
    		},
    		function(result) {
    			Materialize.toast(result, 5000);
    		});
    },
    /**
    ** mustReload - ha true, akkor a szerverről tölti be az adott id-jű éneket, egyébként nem
    **/
    setEditedSong: function(songId, mustReload) {
    	$(".js-edited-song").html(songId);
    	if(mustReload) {
    		//TODO letöltés
    		SongData.getSong(Login.getSessionId(),songId,
    			function(result) {
    				console.log(result);
    				Edit.loadSongObject(result);
    			}),
    			function(result) {
    				console.log(result);
    			}
    	}

    },
    getEditedSong: function() {
    	return $(".js-edited-song").html();
    },
    clearEditedSong: function() {
    	$(".js-edited-song").html("");
    	$(".js-edit-title").val("");
    	$(".js-edit-text-textarea").val("");
    	var notes_width = screen.width*0.7;
	 	$(".js-vextab-container").css("width",notes_width);
	 	var text = "options stave-distance=30 space=10 width=" + notes_width + "\ntabstave notation=true tablature=false key=C time=4/4";
	 	var tabdiv = new Vex.Flow.TabDiv("div.vex-tabdiv"); 
		tabdiv.code = text; 
		tabdiv.redraw(); 
		$(".editor").val(text);
		$(".editor").css("width",notes_width);
		$(".js-choose-language").val("");
		$(".js-edit-other-language").val("");
		$(".js-edit-labels").val("");
		$(".js-edit-comment").val("");
    },
    loadSongObject: function(song) {
    	//title
    	Common.setInputValue(".js-edit-title",song.title);
    	//song
    	Common.setInputValue(".js-edit-text-textarea",song.song);
    	//sheet
    	var tabdiv = new Vex.Flow.TabDiv("div.vex-tabdiv"); 
		tabdiv.code = song.sheet_music; 
		tabdiv.redraw(); 
		$(".editor").val(song.sheet_music);
		//language
		$(".js-choose-language").val(song.language);
		//other language
		Common.setInputValue(".js-edit-other-language",song.other_languages);
		//labels
		Common.setInputValue(".js-edit-labels",song.labels);
		//comments
		Common.setInputValue(".js-edit-comment",song.comment);
    }
};

$(function(){
 	//draw the notes depended on the screen size
 	var notes_width = screen.width*0.7;
 	$(".js-vextab-container").css("width",notes_width);
 	var text = "options stave-distance=30 space=10 width=" + notes_width + "\ntabstave notation=true tablature=false key=C time=4/4";
 	var tabdiv = new Vex.Flow.TabDiv("div.vex-tabdiv"); 
	tabdiv.code = text; 
	tabdiv.redraw(); 
	$(".editor").val(text);
	$(".editor").css("width",notes_width);
	Edit.loadLanguagesForSelector();

	$(".js-edit-text-chord").mousedown(function() {
		Edit.addTagToSong("[a]","[/a]");
		return false;
	});
	$(".js-edit-text-verse").mousedown(function() {
		Edit.addTagToSong("[v]","[/v]");
		return false;
	});
	$(".js-edit-text-chorus").mousedown(function() {
		Edit.addTagToSong("[r]","[/r]");
		return false;
	});
	$(".js-edit-text-bridge").mousedown(function() {
		Edit.addTagToSong("[b]","[/b]");
		return false;
	});
	$(".js-edit-button").click(function() {
		/*console.log(Login.getSessionId() + " " +  $(".js-edit-title").val() + " " + $(".js-edit-text-textarea").val() + " " + 
			$("textarea.editor").val() + " " + $(".js-choose-language").val() + " " + $(".js-edit-other-language").val() + " " + $(".js-edit-labels").val()
			+ " " + $(".js-edit-comment").val());*/
		Edit.sendSong(Login.getSessionId(), Edit.getEditedSong(), $(".js-edit-title").val(), $(".js-edit-text-textarea").val(), $("textarea.editor").val(), $(".js-choose-language").val(),
			$(".js-edit-other-language").val(), $(".js-edit-labels").val(), $(".js-edit-comment").val());
	});
});
