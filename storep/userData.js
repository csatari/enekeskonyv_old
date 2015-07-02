$(function(){
	UserData.getName(Login.getSessionId(),
		function(name) {
			//siker
			$('.js-user-details').text(name);
		}, function () {
			//hiba

		});
});

var UserData = {
	getName: function(sessionid,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.userDataPage, 
				data: {"sessionid": sessionid, "name": "asd"}
			})
		.done(function(result) {
			console.log("name: "+result);
			var res = JSON.parse(result);
			if(res["error"] == "" || res["error"] == undefined) {
				afterGood(res["lastname"]+" "+res["firstname"]);
			}
			else {
				afterBad(res["error"]);
			}
		});
	}
};