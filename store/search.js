$(function(){
	$(".js-search-progress").css("display","none");
});
var Search = {
	searchSong: function(titlePart) {
		Search.toggleSearchProgress(true);
		SongData.searchSong(Login.getSessionId(),titlePart,
			function(result) {
				SongCard.cards = [];
				result.map(function(item) {
					SongCard.addCard(item.id,item.title, item.song,item.labels);
				});
				SongCard.drawCards();
				Search.toggleSearchProgress(false);
			},
			function(error) {
				console.log(error);
				Search.toggleSearchProgress(false);
			});
	},
	addWordToSearchbar: function(word) {
		var words = $(".js-search").val().split(" ");
		for(var i = 0; i < words.length; i++) {
			if(words[i][0] == "#") {
				words[i] = words[i].toLowerCase();
			}
		    else {
		    	words[i] = "";
		    }
		}
		word = word.toLowerCase();
		if($.inArray(word,words) == -1) {
			console.log("nincsbenne");
			var searchedElements = "";
			words.map(function(item) {
				searchedElements = searchedElements + item + " ";
			});
			searchedElements = searchedElements + word;
			$(".js-search").val(searchedElements);
			Search.searchSong($(".js-search").val());
		}
	},
	toggleSearchProgress: function(enabled) {
		if(enabled) {
			$(".js-search-progress").css("display","block");
		}
		else {
			$(".js-search-progress").css("display","none");
		}
	}
};