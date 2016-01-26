$(function(){
	$(document).mousemove(function(e) {
		Song.mouseMoved();
	});
	$( window ).resize(function() {
		Song.onWindowResized();
	});
	$(".js-transpose-up").click(function() {
		Song.Action.transposeUp();
	});
	$(".js-transpose-down").click(function() {
		Song.Action.transposeDown();
	});
	$(".js-paragraph-next").click(function() {
		SongText.Paragraphing.moveOverLine();
		SongText.refresh();
	});
	$(".js-paragraph-back").click(function() {
		SongText.Paragraphing.putBackLine();
		SongText.refresh();
	});
	$(".js-verse-mode").click(function() {
		if(SongText.verse_mode) {
			SongText.VerseMode.exit();
		}
		else {
			SongText.VerseMode.startVerseMode();
		}
	});
	$(".js-comment").click(function() {
		Song.Comment.showComment();
	});
	$(".js-chord").click(function() {
		SongText.ChordOptions.toggleChords();
	})
	$(document).keydown(function(e) {
		//console.log(e.which);
	    switch(e.which) {
	        case 37: // left
	        	Song.showText();
	        break;

	        case 39: // right
	        	if(!Sheet.loading) {
	        		Song.showNotes();
	        	}
	        break;
	        case 40: //down
	        	if(SongText.verse_mode) {
	        		SongText.VerseMode.startNext();
	        	}
	        break;
	        case 38: //up
	        	if(SongText.verse_mode) {
	        		SongText.VerseMode.startPrevious();
	        	}
	        break;
	        case 27: //escape
	        	if(SongText.verse_mode) {
	        		SongText.VerseMode.exit();
	        	}
	        break;
	        default: return; // exit this handler for other keys
	    }
    	//e.preventDefault(); // prevent the default action (scroll / move caret)
	});
	$(document).keypress(function(e) {
	    if(e.which == 13) {
	    	if(Song.enabled) {
	    		Song.enterPressed();
	    	}
	    }
	});
	Song.onWindowResized();

	$(document).on('click','.js-invert-button',function() {
		Sheet.invert();
		SongText.invert();
	});
});

var Song = {
	song: {
		title:"",
		text:""
	},
	old_background:null,
	enabled:false,
	goneByPresentation:false,
	mouse_wait_till_gone:100 * 1000,
	gone:false,
	song_left:0,
	sheet_music_shown:false,
	exit: function() {
		Song.old_background = null;
		Song.enabled = false;
		Song.goneByPresentation = false;
		Song.gone = false;
		Song.song_left = 0;
		Song.sheet_music_shown = false;
	},
	enterPressed: function() {
		if(!Song.goneByPresentation) {
    		if(Song.sheet_music_shown) {
	    		Sheet.AutomaticMatching.startAutomaticMatching();
	    	}
	    	else {
	    		SongText.AutomaticMatching.startAutomaticMatching();
	    	}
    	}
    	else {
    		Song.mouseMovedAgain();
    	}
    	Song.goneByPresentation = !Song.goneByPresentation;
	},
	drawSong: function(songId) {
		Database.getById(parseInt(songId),function(result) {
			console.log(result);
			SongText.initialization();
			Song.song.title = result.title;
			Song.song.text = result.song;
			SongText.VerseMode.setVerses(result.verse_order);
			Song.Comment.setComment(result.comment);
			SongText.loadText(result.song);
			SongText.setAccessor(".js-song-text");
			SongText.setTitleAccessor(".js-song-title");
			Sheet.sheet = result.sheet_music;
			Index.clearPage();

			$(".js-song-page").html(Song.toHTML());
			$( "div.js-note-root" ).css("left", (window.innerWidth+20)+"px");
			Song.showOptions();
			Sheet.refresh();
			SongText.refresh();
		});
	},
	toHTML: function() {
		var html = 	"<div class=\"js-song-root song-root\">"+
						"<div class=\"song-title js-song-title\">" + Song.song.title + "</div>"+
						"<div class=\"song-text js-song-text\"></div>"+
					"</div>"+
					"<div class=\"note-root js-note-root\">"+
						Sheet.toHTML() +
					"</div>";
		return html;
	},
	showOptions: function() {
		Song.old_background = $("body.body-background").css("background-color");
		$("body.body-background").css("background-color","white");
		$(".js-song-title").css("font-size","35px");
		Fab.toggleVisibility(true);
		Searchbar.toggleSongbar(true);
		Song.enabled = true;
		Searchbar.backButtonClicked = function() {
			Fab.toggleVisibility(false);
			Searchbar.toggleSongbar(false);
			$("body.body-background").css("background-color",Song.old_background);
			Song.enabled = false;
			Index.clearPage();
			Song.exit();
			Sheet.exit();
			SongText.exit();
		};
	},
	mouseMoved: function() {
		if(Song.enabled && !Song.goneByPresentation) {
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
	mouseStopped: function(done) {
		if(Song.enabled) {
			Song.gone = true;
			Searchbar.toggleVisibility(false);
			Fab.toggleVisibility(false);
			$( ".js-song-title" ).animate({
					fontSize: "0px",
					marginBottom: "0px"
				}, 500, function() {
					$( ".js-song-title" ).css("display","none");
					done();
				}
			);
			$( ".js-song-root" ).animate({
					marginTop: "10px"
				}, 500, function() { }
			);
		}
	},
	mouseMovedAgain: function() {
		Song.gone = false;
		Searchbar.toggleVisibility(true);
		Fab.toggleVisibility(true);
		$( ".js-song-title" ).css("display","block");
		$( ".js-song-title" ).animate({
					fontSize: "35px",
					marginBottom: "10px"
				}, 500, function() { }
		);
		$( ".js-song-root" ).animate({
					marginTop: "30px"
				}, 500, function() { }
		);
	},
	onWindowResized: function() {
		if(Song.sheet_music_shown) {
			Song.toggleNotes(false,0);
		}
		$("div.js-note-root").css("left",(window.innerWidth+20)+"px");
	},
	toggleNotes: function(enabled,animationDuration) {
		if(enabled) {
			$("div.js-song-root").css("position","fixed");
			Song.song_left = $("div.js-song-root").position().left;
			$( "div.js-note-root" ).animate({
					left: Song.song_left+"px"
				}, animationDuration, function() {});
			$( "div.js-song-root" ).animate({
					left: ((-1)*(window.innerWidth+20))+"px"
				}, animationDuration, function() {
					$("div.js-note-root").css("position","absolute");
			});
			Song.sheet_music_shown = true;
		}
		else {
			$("div.js-note-root").css("position","fixed");
			$( "div.js-note-root" ).animate({
				left: (window.innerWidth+20)+"px"
			}, animationDuration, function() {});
			$( "div.js-song-root" ).animate({
				left: Song.song_left+"px"
			}, animationDuration, function() {
				$("div.js-song-root").css("position","absolute");
			});
			Song.sheet_music_shown = false;
		}
	},
	showText: function() {
		if(Song.sheet_music_shown) {
			Song.toggleNotes(false,500);
		}
	},
	showNotes: function() {
		if(!Song.sheet_music_shown) {
			Song.toggleNotes(true,500);
		}
	},
	Action: {
		transposeUp: function() {
			Sheet.transposeUp();
			SongText.transposeUp();
		},
		transposeDown: function() {
			Sheet.transposeDown();
			SongText.transposeDown();
		},
		darken: function() {
			Song.Darkening.toggleDarken();
		},
		verseMode: function() {
			if(SongText.verse_mode) {
				SongText.VerseMode.exit();
			}
			else {
				SongText.VerseMode.startVerseMode();
			}
		}
	},
	Darkening: {
		darkened:false,
		toggleDarken: function() {
			if(Song.Darkening.darkened) {
				$("body").css("display","block");
				$("html").css("background-color","white");
				$("html").css("cursor","auto");
			}
			else {
				$("body").css("display","none");
				$("html").css("background-color","black");
				$("html").css("cursor","none");
			}
			Song.Darkening.darkened = !Song.Darkening.darkened;
		}
	},
	Comment: {
		comment:"",
		setComment: function(comment) {
			Song.OptionButtons.toggleComment(comment != "");
			Song.Comment.comment = comment;
		},
		showComment: function() {
			if(Song.Comment.comment != "") {
				$('#js-registration-result').text(Song.Comment.comment);
		        Index.setIcon(2);
		        jQuery('#js-registration-result-modal').openModal();
			}
		}
	},
	OptionButtons: {
		toggleVerseMode: function(toggle) {
			if(toggle) {
				$(".js-verse-mode").parent().css("display","inline-block");
			}
			else {
				$(".js-verse-mode").parent().css("display","none");
			}
		},
		toggleComment: function(toggle) {
			if(toggle) {
				$(".js-comment").parent().css("display","inline-block");
			}
			else {
				$(".js-comment").parent().css("display","none");
			}
		}
	}
};