$(function(){
	$(document).mousemove(function(e) {
		Song.mouseMoved();
	});
	$( window ).resize(function() {
		Song.onWindowResized();
	});
	$(document).keydown(function(e) {
	    switch(e.which) {
	        case 37: // left
	        	Song.showText();
	        break;

	        case 39: // right
	        	Song.showNotes();
	        break;

	        default: return; // exit this handler for other keys
	    }
    	e.preventDefault(); // prevent the default action (scroll / move caret)
	});
	Song.onWindowResized();

	$(document).on('click','.js-invert-button',function() {
		Sheet.invert();
	});
});

var Song = {
	song: {
		title:"",
		text:""
	},
	old_background:null,
	enabled:false,
	mouse_wait_till_gone:10000,
	gone:false,
	song_left:0,
	sheet_music_shown:false,
	drawSong: function(songId) {
		Database.getById(parseInt(songId),function(result) {
			console.log(result);
			Song.song.title = result.title;
			Song.song.text = result.song;
			Sheet.sheet = result.sheet_music;
			Index.clearPage();

			$(".js-song-page").html(Song.toHTML());
			$( "div.note-root" ).css("left", (window.innerWidth+20)+"px");
			Song.showOptions();
			Sheet.refresh();
		});
	},
	toHTML: function() {
		var html = 	"<div class=\"js-song-root song-root\">"+
						"<div class=\"song-title\">" + Song.song.title + "</div>"+
						"<div class=\"song-text\">" + Song.song.text + "</div>"+
					"</div>"+
					"<div class=\"note-root\">"+
						Sheet.toHTML() +
					"</div>";
		return html;
	},
	showOptions: function() {
		Song.old_background = $("body.body-background").css("background-color");
		$("body.body-background").css("background-color","white");
		Fab.toggleVisibility(true);
		Searchbar.toggleSongbar(true);
		Song.enabled = true;
		Searchbar.backButtonClicked = function() {
			Fab.toggleVisibility(false);
			Searchbar.toggleSongbar(false);
			$("body.body-background").css("background-color",Song.old_background);
			Song.enabled = false;
			Index.clearPage();
		};
	},
	mouseMoved: function() {
		if(Song.enabled) {
			//console.log("igen");
			if(Song.gone) {
				Song.mouseMovedAgain();
			}
			lastTimeMouseMoved = new Date().getTime();
	    	var t=setTimeout(function() {
		        var currentTime = new Date().getTime();
		        if(currentTime - lastTimeMouseMoved > Song.mouse_wait_till_gone) {
		        	Song.mouseStopped();
					//console.log("eltűnik");
		        }
	       	},Song.mouse_wait_till_gone+1);
		}
	},
	mouseStopped: function() {
		if(Song.enabled) {
			Song.gone = true;
			Searchbar.toggleVisibility(false);
			Fab.toggleVisibility(false);
		}
	},
	mouseMovedAgain: function() {
		Song.gone = false;
		Searchbar.toggleVisibility(true);
		Fab.toggleVisibility(true);
	},
	onWindowResized: function() {
		$("div.note-root").css("left",(window.innerWidth+20)+"px");
	},
	toggleNotes: function(enabled) {
		if(enabled) {
			Song.song_left = $("div.song-root").position().left;
			$( "div.note-root" ).animate({
				left: Song.song_left+"px"
			}, 500, function() {});
			$( "div.song-root" ).animate({
				left: ((-1)*(window.innerWidth+20))+"px"
			}, 500, function() {
				
			});
			Song.sheet_music_shown = true;
		}
		else {
			$( "div.note-root" ).animate({
				left: (window.innerWidth+20)+"px"
			}, 500, function() {});
			$( "div.song-root" ).animate({
				left: Song.song_left+"px"
			}, 500, function() {

			});
			Song.sheet_music_shown = false;
		}
	},
	showText: function() {
		if(Song.sheet_music_shown) {
			Song.toggleNotes(false);
		}
	},
	showNotes: function() {
		if(!Song.sheet_music_shown) {
			Song.toggleNotes(true);
		}
	}
};

/*
$(document).ready(function(){
	resizeDiv();
});

window.onresize = function(event) {
	resizeDiv();
}

function resizeDiv() {
	vpw = $(window).width();
	vph = $(window).height();
	$("#somediv").css({"height": vph});
}*/