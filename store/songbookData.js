var SongbookData = {
	getSongbookCount: function(sessionid, songbookId, afterGood, afterBad) {
		$.ajax({method: "POST", 
			url: Config.url+Config.songbookDataPage, 
			data: {"sessionid": sessionid, "get-songbook-count": "1", "songbook": songbookId}
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
	getSongbookData: function(sessionid, songbookId, afterGood, afterBad) {
		$.ajax({method: "POST", 
			url: Config.url+Config.songbookDataPage, 
			data: {"sessionid": sessionid, "get-songbook-data": "1", "songbook": songbookId}
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
	getAllSongFromSongbook: function(sessionid, songbookId, afterGood, afterBad) {
		$.ajax({method: "POST", 
			url: Config.url+Config.songbookDataPage, 
			data: {"sessionid": sessionid, "get-all-songs-from-songbook": "1", "songbook": songbookId}
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
	addSongToSongbook: function(sessionid,songid,songbookId, afterGood, afterBad) {
		console.log({"sessionid": sessionid, "add-song-to-songbook": "1", "song": songid, "songbook": songbookId});
		$.ajax({method: "POST", 
			url: Config.url+Config.songbookDataPage, 
			data: {"sessionid": sessionid, "add-song-to-songbook": "1", "song": songid, "songbook": songbookId}
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
	removeSongFromSongbook: function(sessionid,songid,songbookId, afterGood, afterBad) {
		console.log({"sessionid": sessionid, "remove-song-from-songbook": "1", "song": songid, "songbook": songbookId});
		$.ajax({method: "POST", 
			url: Config.url+Config.songbookDataPage, 
			data: {"sessionid": sessionid, "remove-song-from-songbook": "1", "song": songid, "songbook": songbookId}
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