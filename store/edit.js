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
    sendSong: function(sessionid, songid, title, text, notes, lang, otherlang, labels, comment, verseOrder) {
    	SongData.addSong(sessionid, songid, title, text, notes, lang, otherlang, labels, comment, verseOrder,
    		function(result) {
    			Materialize.toast(Config.newSongSuccessful, 5000);
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
		//verseOrder
		Edit.Verse.loadVerses();
		Edit.Verse.loadSortables();
		Edit.Verse.setOrder(song.verse_order);
    },
    oldBackground: null,
    toggleDelete: function(toggle) {
    	if(toggle) {

    		$(".js-edit-button").css("display","none");
    		$(".js-fab-verse-delete").css("display","block");
    		oldBackground = $(".js-edit-button").css("background-color");
    		//$(".js-edit-button").css("background-color","#C10000");
    	}
    	else {
    		$(".js-edit-button").css("display","block");
    		$(".js-fab-verse-delete").css("display","none");
    		//$(".js-edit-button").css("background-color",oldBackground);
    	}
    },
    Verse: {
    	inBin: function() {
    		$(".js-fab-verse-delete").html(""+
					"<i class=\"large material-icons fab-delete js-fab-delete\">delete</i>");
    	},
    	inBinEnd: function() {
    		/*$(".js-edit-button").html(""+
					"<i class=\"large mdi-editor-mode-edit js-fab-edit\"></i>"+
			"<i class=\"large material-icons fab-delete js-fab-delete\">delete</i>");*/
    	},
    	notInBin: function() {
    		/*$(".js-edit-button").html(""+
					"<i class=\"large mdi-editor-mode-edit js-fab-edit\"></i>"+
			"<i class=\"large material-icons fab-delete js-fab-delete\">delete</i>");*/
    	},
    	loadSortables: function() {
			jQuery('.collapsible').collapsible({
				accordion : false
			});
			var first = document.getElementsByClassName("verse-from")[0];
			var sortable_from = new Sortable(first,{
				group: {
					name: "verse",
					pull: "clone",
					put: false,
				},
				sort: false,
				onEnd: function(e) {
					jQuery('.collapsible').collapsible({
						accordion : false
					});
				},
				animation: 200
			});
			var second = document.getElementsByClassName("verse-to")[0];
			var sortable_to = new Sortable(second,{
				group: {
					name: "to",
					put: ["verse"],
					pull: true
				},
				pull: true,
				onStart: function(e) {
					//kuka
					Edit.toggleDelete(true);
				},
				onEnd: function(e) {
					Edit.toggleDelete(false);
				},
				animation: 200,
			});
			var bin = document.getElementsByClassName("js-fab-verse-delete")[0];
			var sortable_bin = new Sortable(bin,{
				group: {
					name: "bin",
					put: ["to"],
					pull: false
				},
				pull: false,
				put: ["bin"],
				onAdd: function(e) {
					console.log(e.item);
					e.item.remove();
				},
				onMove: function(e) {
				}
			});
		},
		getVerses: function() {
			var verses = $(".js-edit-text-textarea").val();
			var verseArray = [];
			verses.replace(/(\[[vbr]\])(.|\n)*?(\[\/[vbr]\])/g,function(s) {
				console.log(s);
				if(s.match(/(\[[v]\])/) != null) {
					var verse = s.substr(3,s.length-7);
					verseArray.push({
						type: "v",
						text: verse
					});
				}
				else if(s.match(/(\[[b]\])/) != null) {
					var verse = s.substr(3,s.length-7);
					verseArray.push({
						type: "b",
						text: verse
					});
				}
				else if(s.match(/(\[[r]\])/) != null) {
					var verse = s.substr(3,s.length-7);
					verseArray.push({
						type: "r",
						text: verse
					});
				}
				return s;
			});
			return verseArray;
		},
		loadVerses: function() {
			Edit.Verse.verseCount = 0;
			Edit.Verse.refrainCount = 0;
			Edit.Verse.bridgeCount = 0;
			var order = Edit.Verse.getOrder();
			$(".verse-from").html("");
			var verseArray = Edit.Verse.getVerses();
			for(var elem in verseArray) {
				$(".verse-from").html($(".verse-from").html()+
					Edit.Verse.arrayElemToHtml(verseArray[elem]));
			}
			Edit.Verse.setOrder([]);
			Edit.Verse.setOrder(order);
		},
		verseCount:0,
		refrainCount:0,
		bridgeCount:0,
		arrayElemToHtml: function(arrayElem) {
			var title = "";
			if(arrayElem.type == "v") {
				Edit.Verse.verseCount++;
				title = Edit.Verse.verseCount + ". " + Config.verse;
			}
			else if(arrayElem.type == "b") {
				Edit.Verse.bridgeCount++;
				title = Edit.Verse.bridgeCount + ". " + Config.bridge;
			}
			else if(arrayElem.type == "r") {
				Edit.Verse.refrainCount++;
				title = Edit.Verse.refrainCount + ". " + Config.refrain;
			}
			var count = Edit.Verse.verseCount+Edit.Verse.bridgeCount+Edit.Verse.refrainCount;
			return "<li class=\"js-verse-order\" id=\""+count+"\">"+
						"<div class=\"collapsible-header\">"+title+
						"</div>"+
						"<div class=\"collapsible-body\"><p>"+arrayElem.text+"</p></div>"+
					"</li>";
		},
		getOrder: function() {
			var children = $(".js-verse-to").children();
			//Versszakok indexxel
			var orderArray = [];
			$.each(children,function(i) {
				orderArray.push(parseInt(children[i].id));
			});
			return orderArray;
		},
		setOrder: function(array) {
			$(".js-verse-to").html("");
			for(var i in array) {
				$(".js-verse-to").html($(".js-verse-to").html() + $(".js-verse-from > .js-verse-order#"+array[i])[0].outerHTML);
			}
			Edit.Verse.loadSortables();
		}
		//["2", "1", "3", "6", "1"]
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
		Edit.Verse.loadVerses();
		Edit.Verse.loadSortables();
		return false;
	});
	$(".js-edit-text-chorus").mousedown(function() {
		Edit.addTagToSong("[r]","[/r]");
		Edit.Verse.loadVerses();
		Edit.Verse.loadSortables();
		return false;
	});
	$(".js-edit-text-bridge").mousedown(function() {
		Edit.addTagToSong("[b]","[/b]");
		Edit.Verse.loadVerses();
		Edit.Verse.loadSortables();
		return false;
	});
	$(".js-edit-button").click(function() {
		console.log(Login.getSessionId() + " " +  $(".js-edit-title").val() + " " + $(".js-edit-text-textarea").val() + " " + 
			$("textarea.editor").val() + " " + $(".js-choose-language").val() + " " + $(".js-edit-other-language").val() + " " + $(".js-edit-labels").val()
			+ " " + $(".js-edit-comment").val() + " " + Edit.Verse.getOrder());
		Edit.sendSong(Login.getSessionId(), Edit.getEditedSong(), $(".js-edit-title").val(), $(".js-edit-text-textarea").val(), $("textarea.editor").val(), $(".js-choose-language").val(),
			$(".js-edit-other-language").val(), $(".js-edit-labels").val(), $(".js-edit-comment").val(),Edit.Verse.getOrder());
	});
	$(".js-verse-to-delete").click(function() {
		$(this).parent().parent().remove();
	});
	$(".js-edit-text-textarea").change(function() {
		Edit.Verse.loadVerses();
		Edit.Verse.loadSortables();
	});
	$(".js-verse-clear-button").click(function() {
		Edit.Verse.setOrder([]);
	});
});
