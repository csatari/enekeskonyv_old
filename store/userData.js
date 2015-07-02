var UserData = {
	getName: function(sessionid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "name": ""}
			})
		.done(function(result) {
			//console.log("name: "+result);
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
	}
};