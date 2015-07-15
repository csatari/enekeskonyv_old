var UserData = {
	getName: function(sessionid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "name": ""}
			})
		.done(function(result) {
			var res = JSON.parse(result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res["lastname"]+" "+res["firstname"]);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
	addSongbook: function(sessionid,songbookName,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "add-songbook": songbookName}
			})
		.done(function(result) {
			var res = JSON.parse(result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood();
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
	getSongbooks: function(sessionid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "get-songbooks": ""}
			})
		.done(function(result) {
			var res = JSON.parse(result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
	getAllVisibleSongbooks: function(sessionid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "get-all-visible-songbooks": ""}
			})
		.done(function(result) {
			var res = JSON.parse(result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
	getThemes: function(sessionid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "get-themes": ""}
			})
		.done(function(result) {
			var res = JSON.parse(result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
	addTheme: function(sessionid,id,name,public,theme,afterGood,afterBad) {
		var publicString = '';
		if(public) {
			publicString = "1";
		}
		else {
			publicString = "0";
		}
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "add-theme": "", "theme-name": name, "theme-public": publicString, "theme": theme, "theme-id": id}
			})
		.done(function(result) {
			console.log(result);
			var res = JSON.parse(result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
	setTheme: function(sessionid,themeid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "set-theme": themeid}
			})
		.done(function(result) {
			var res = JSON.parse(result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
	getTheme: function(sessionid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "get-theme": ""}
			})
		.done(function(result) {
			var res = JSON.parse(result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
};