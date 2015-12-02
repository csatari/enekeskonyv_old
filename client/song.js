$(function(){
	$(document).mousemove(function(e) {
		Song.mouseMoved();
	});
});

var Song = {
	title:"Ének címe",
	old_background:null,
	enabled:false,
	mouse_wait_till_gone:5000,
	gone:false,
	drawSong: function() {
		Index.clearPage();
		$(".js-song-page").html(Song.toHTML());
		Song.showOptions();
	},
	toHTML: function() {
		var html = "<div class=\"js-song-root song-root\">" + 
						"<div class=\"card-panel\">"+
							"<div class=\"card-title conf-editor\">" + Song.title + "</div>"+
							"<div class=\"divider\"></div>"+
							"<div class=\"card-body\">"+
								"<div class=\"row\">"+
									"Ének szövege_"+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>";
		return html;
	},
	showOptions: function() {
		Song.old_background = $("body.body-background").css("background-color");
		$("body.body-background").css("background-color","white");
		Footer.toggleVisibility(true);
		Searchbar.toggleSongbar(true);
		Song.enabled = true;
		Searchbar.backButtonClicked = function() {
			Footer.toggleVisibility(false);
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
			Footer.toggleVisibility(false);
		}
	},
	mouseMovedAgain: function() {
		Song.gone = false;
		Searchbar.toggleVisibility(true);
		Footer.toggleVisibility(true);
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