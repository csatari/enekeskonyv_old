$(function(){
	SideNav.refreshSongbooks();
	
	$(".js-create-songbook").click(function() {
		ModalTextbox.openTextbox(Config.giveTitle);
		ModalTextbox.modalDone = function(text) {
			UserData.addSongbook(Login.getSessionId(),text,
			function() {
				SideNav.refreshSongbooks();
			},
			function(error) {
				//console.log(error);
				$('#js-registration-result').text(error);
				$('#js-registration-result-modal-title').text(Config.unsuccesfulStep);
				Registration.setRegistrationResultIcon(false);
				$('#js-registration-result-modal').openModal();
			});
		};
	});
	$(".js-new-song").click(function() {
		SideNav.goToEdit();
	});
	$(".js-settings").click(function() {
		SideNav.goToThemes();
	});
	$(".js-all-songbook").click(function() {
		SideNav.goToSongbooks();
	});
});

var SideNav = {
	refreshSongbooks: function() {
		UserData.getSongbooks(Login.getSessionId(),
			function(songbooks) {
				SideNav.clearMySongbooks();
				songbooks.map(function(item) {
					//console.log(item);
					SideNav.addSongbookToMySongbooks(item["id"],item["title"]);
				});
			},
			function(error) {
				SideNav.clearMySongbooks();
		});
	},
	clearMySongbooks: function() {
		//js-my-songbooks-ul
		$(".js-my-songbooks-ul").html("");
	},
	addSongbookToMySongbooks: function(songbookId,songbookName) {
		var lastState = $(".js-my-songbooks-ul").html();
		lastState = lastState + "<li><a href=\"#!\" class=\"waves-effect waves-light-blue\" id=\"" + songbookId + "\">" + songbookName + "</a></li>";
		//<li><a href="#!" class="waves-effect waves-light-blue" id="songbookId">songbookName</a></li>
		//console.log(lastState);
		$(".js-my-songbooks-ul").html(lastState);
	},
	goToEdit: function(after) {
		$(".js-page").load("edit.html", function() {
			Config.runConfig();
			jQuery.getScript("vendors/VexTab/vextab-div.js").done(function() {
					jQuery.getScript("edit.js").done(function() {
						if(after != undefined) {
							after();
						}
					});
			});
			jQuery('.button-collapse').sideNav('hide');
		});
	},
	goToThemes: function() {
		$(".js-page").load("themes.html", function() {
			Config.runConfig();
			var mytheme = Themes.myChosenTheme;
			jQuery.getScript("themes.js").done(function() {
				Themes.myChosenTheme = mytheme;
			});
			jQuery('.button-collapse').sideNav('hide');
		});
	},
	goToSongbooks: function() {
		$(".js-page").load("songbooks.html", function() {
			Config.runConfig();
			jQuery('.button-collapse').sideNav('hide');
			/*jQuery.getScript("songbooks.js").done(function() {
				Songbooks.showAllVisibleSongbooks();
			});*/
			Songbooks.showAllVisibleSongbooks();
		});
	}
};