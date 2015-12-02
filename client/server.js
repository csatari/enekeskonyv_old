var Server = {
	waiting:1,
	//egy függvényt kap paraméterül, ami akkor hívódik meg, ha elérhető a szerver
	callWhenServerAvailable: function(available) {
		$.ajax({method: "POST", 
			url: Config.url+Config.getDataPage, 
			data: {"getData": "1"}
		})
		.done(function(result) {
			available();
		})
		.error(function(result) {
			//console.log("várok: "+Server.waiting + " mp-et");
			setTimeout(function() {
				if(Server.waiting < 512) {
					Server.waiting = Server.waiting * 2;
				}
				Server.callWhenServerAvailable(available);
			},Server.waiting*1000);
			
		});
	}	
};