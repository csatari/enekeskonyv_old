var SongData = {
	addSong: function(sessionid, songid, title, text, notes, lang, otherlang, labels, comment, afterGood,afterBad) {
		$.ajax({method: "POST", 
			url: Config.url+Config.songDataPage, 
			data: {"sessionid": sessionid, "addSong": "1", "title": title, "text": text, "notes": notes, "lang": lang, "otherlang": otherlang,
					"labels": labels, "comment": comment, "songid": songid}
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
	searchSong: function(sessionid,title, songbook, afterGood, afterBad) {
		console.log({"sessionid": sessionid, "searchSong": "1", "title": title, "songbook": songbook})
		$.ajax({method: "POST", 
			url: Config.url+Config.songDataPage, 
			data: {"sessionid": sessionid, "searchSong": "1", "title": title, "songbook": songbook}
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
	getSong: function(sessionid, songId, afterGood, afterBad) {
		console.log("lekérdezés");
		$.ajax({method: "POST", 
			url: Config.url+Config.songDataPage, 
			data: {"sessionid": sessionid, "getSong": songId, "songbookid":0}
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
}