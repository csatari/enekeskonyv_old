var Downloader = {
	downloadSongs: function(afterGood) {
		var id = $(".js-songbook-id").text();
		var downloadId = $(".js-songbook-downloadid").text();

		Downloader.downloadSongbookFromServer(id,downloadId,
			function(result) {
				afterGood(result);
			},function(){});
	},

	downloadSongbookFromServer: function(id, downloadid, afterGood, afterBad) {
		$.ajax({method: "POST", 
			url: Config.url+Config.downloadDataPage, 
			data: {"download-songbook": "1", "downloadid": downloadid, "songbook": id}
		})
		.done(function(result) {
			var res = JSON.parse(result);
			for (var i = 0; i < res.length; i++) {
				if(res[i]["verse_order"] != undefined) {
					res[i]["verse_order"] = JSON.parse(res[i]["verse_order"]);
				}
			};
			console.log(res);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res);
			}
			else {
				afterBad(res["error"]);
			}
		});
	},
};