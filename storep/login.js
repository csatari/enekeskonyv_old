$(function(){
	var loggedin = Login.isLoggedIn();
 	if(loggedin) {
 		Login.isSessionIdStillGood(Login.getSessionId(),
 			function() {
 				Login.login();
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
  		$('#js-login-modal').openModal();
  		//sidenav eltüntetése
  		$('.button-collapse').sideNav('hide'); 
	});
	$(".js-login-model-send").click(function() {
		Login.sendLogin($("#login-username").val(),$("#login-password").val(),
			function(sessionid) {
				//siker
				$('#js-login-modal').closeModal();
				Login.setCookie("sessionid",sessionid,12);
				Login.login();
			},
			function(text) {
				//hiba
				$('#js-registration-result').text(text);
				$('#js-registration-result-modal-title').text(Config.loginTitle);
				Registration.setRegistrationResultIcon(false);
				$('#js-registration-result-modal').openModal();
			});
	});
});

var Login = {
	sendLogin: function(username,password,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.loginPage, 
				data: {"username": username, "password": password}
			})
		.done(function(result) {
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
			var res = JSON.parse(result);
			if(res) {
				afterGood();
			}
			else {
				afterBad();
			}
		});
	},
	login: function() {
		$('.js-not-logged-in').css({"display":"none"});
	},
	notLoggedIn: function() {
		$('.js-not-logged-in').css({"display":"block"});
 		Login.clearSessionIdFromCookie();
 		$('.js-user-details').text(Config.notLoggedIn);
	}
};