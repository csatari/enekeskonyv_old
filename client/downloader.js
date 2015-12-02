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
		console.log({"download-songbook": "1", "downloadid": downloadid, "songbook": id})
		$.ajax({method: "POST", 
			url: Config.url+Config.downloadDataPage, 
			data: {"download-songbook": "1", "downloadid": downloadid, "songbook": id}
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