$(function(){
	$(".js-search-progress").css("display","none");
});
var Search = {
	searchSong: function(titlePart) {
		Search.toggleSearchProgress(true);
		console.log(Footer.songbook.id)
		SongData.searchSong(Login.getSessionId(),titlePart,Footer.songbook.id,
			function(result) {
				SongCard.cards = [];
				console.log(result)
				result.map(function(item) {
					console.log(item);
					SongCard.addCard(item.id,item.title, item.song,item.labels, item.permissions, item.in_songbook);
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