var SongData = {
	addSong: function(sessionid, songid, title, text, notes, lang, otherlang, labels, comment, verseOrder, afterGood,afterBad) {
		if(songid == "") {
			songid = 0;
		}
		$.ajax({method: "POST", 
			url: Config.url+Config.songDataPage, 
			data: {"sessionid": sessionid, "addSong": "1", "title": title, "text": text, "notes": notes, "lang": lang, "otherlang": otherlang,
					"labels": labels, "comment": comment, "songid": songid, "verseOrder": JSON.stringify(verseOrder)}
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
		//console.log({"sessionid": sessionid, "searchSong": "1", "title": title, "songbook": songbook})
		$.ajax({method: "POST", 
			url: Config.url+Config.songDataPage, 
			data: {"sessionid": sessionid, "searchSong": "1", "title": title, "songbook": songbook}
		})
		.done(function(result) {
			var res = JSON.parse(result);
			if(res["verse_order"] != undefined) {
				res["verse_order"] = JSON.parse(res["verse_order"]);
			}
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
	getSong: function(sessionid, songId, afterGood, afterBad) {
		$.ajax({method: "POST", 
			url: Config.url+Config.songDataPage, 
			data: {"sessionid": sessionid, "getSong": songId, "songbookid": Footer.songbook.id}
		})
		.done(function(result) {
			var res = JSON.parse(result);
			console.log(res);
			//verseOrder tömbösítése
			if(res["verse_order"] != undefined) {
				res["verse_order"] = JSON.parse(res["verse_order"]);
			}
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res);
			}
			else {
				afterBad(res["error"]);
			}
		});
	}
}