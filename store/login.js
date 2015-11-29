$(function(){
	var loggedin = Login.isLoggedIn();
 	if(loggedin) {
 		Login.isSessionIdStillGood(Login.getSessionId(),
 			function() {
 				Login.login(Login.getSessionId());
 			},
 			function() {
 				Login.notLoggedIn();
 			});
 	}
 	else {
 		Login.notLoggedIn();
 	}

	$( ".js-login" ).click(function() {
  		//login ablak megnyitása
  		jQuery('#js-login-modal').openModal();
  		//sidenav eltüntetése
  		jQuery('.button-collapse').sideNav('hide'); 
	});
	$(".js-login-model-send").click(function() {
		Login.sendLogin($("#login-username").val(),$("#login-password").val(),
			function(sessionid) {
				//siker
				jQuery('#js-login-modal').closeModal();
				Login.login(sessionid);
			},
			function(text) {
				//hiba
				$('#js-registration-result').text(text);
				$('#js-registration-result-modal-title').text(Config.loginTitle);
				Registration.setRegistrationResultIcon(false);
				jQuery('#js-registration-result-modal').openModal();
			});
	});
	$(".js-log-out").click(function() {
		Login.logout();
	});
});

var Login = {
	sendLogin: function(username,password,afterGood,afterBad) {
		console.log("Elküldöm + "+ Config.url+Config.loginPage)
		$.ajax({method: "POST", 
				url: Config.url+Config.loginPage, 
				data: {"username": username, "password": password}
			})
		.done(function(result) {
			console.log("result: "+result);
			var res = JSON.parse(result);
			console.log("session: "+result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res["sessionid"]);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
	sendLogout: function(sessionid) {
		$.ajax({method: "POST", 
				url: Config.url+Config.loginPage, 
				data: {"sessionid": sessionid, "logout": "true"}
			})
		.done(function(result) {
			console.log("befejezve: "+result);
			Login.notLoggedIn();
		});
	},
	setCookie: function(cname, cvalue, exhours) {
	    var d = new Date();
	    d.setTime(d.getTime() + (exhours*60*60*1000));
	    var expires = "expires="+d.toUTCString();
	    document.cookie = cname + "=" + cvalue + "; " + expires;
	},
	getCookie: function(cname) {
		var name = cname + "=";
	    var ca = document.cookie.split(';');
	    for(var i=0; i<ca.length; i++) {
	        var c = ca[i];
	        while (c.charAt(0)==' ') c = c.substring(1);
	        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	    }
	    return "";
	},
	clearSessionIdFromCookie: function() {
		Login.setCookie("sessionid","",0);
	},
	isLoggedIn: function() {
		var sessionid = Login.getCookie("sessionid");
		if(sessionid == undefined || sessionid == "") {
			return false;
		}
		else return true;
	},
	getSessionId: function() {
		return Login.getCookie("sessionid");
	},
	isSessionIdStillGood: function(sessionid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.loginPage, 
				data: {"sessionid": sessionid}
			})
		.done(function(result) {
			console.log(result)
			var res = JSON.parse(result);
			console.log(res)
			if(res) {
				afterGood();
			}
			else {
				afterBad();
			}
		});
	},
	login: function(sessionid) {
		Login.setCookie("sessionid",sessionid,12);
		Login.loggedIn();
	},
	logout: function() {
		Login.sendLogout(Login.getSessionId());
		$(".js-page").html("");
	},
	loggedIn: function() {
		console.log("loggedIn");
		$('.js-not-logged-in').css({"display":"none"});
		$('.js-logged-in').css({"display":"block"});
		Login.setNameInUserDetails();
		SideNav.refreshSongbooks();
		Themes.applyUserTheme();
	},
	notLoggedIn: function() {
		console.log("notLoggedIn");
		$('.js-not-logged-in').css({"display":"block"});
		$('.js-logged-in').css({"display":"none"});
 		Login.clearSessionIdFromCookie();
 		$('.js-user-details').text(Config.notLoggedIn);
	},
	setNameInUserDetails: function() {
		UserData.getName(Login.getSessionId(),
		function(name) {
			//siker
			$('.js-user-details').text(name);
		}, function () {
			//hiba
		});
	}
};