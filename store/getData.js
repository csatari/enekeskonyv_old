var GetData = {
	loadLanguages: function(sessionid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.getDataPage, 
				data: {"sessionid": sessionid, "allLanguages": ""}
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