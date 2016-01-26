$(function(){
	$(".js-search-progress").css("display","none");
	$(".js-search").keyup(function(event) {
		Search.searchTriggered();
	});
	$(".js-search").change(function() {
		if(Index.mobileAndTabletcheck()) {
			Search.searchTriggered();
		}
	});
	$(".js-search").keypress(function(e) {
	    if(e.which == 13) {
	    	Search.searchTriggered();
	    	e.preventDefault();
	    	return;
	    }
	});
});
var Search = {
	counterArray: [],
	searchTriggered: function() {
		if($(".js-search").val().length > 0) {
			Search.searchSong($(".js-search").val());
		}
		if(Song.enabled) {
			Searchbar.backButtonClicked();
		}
		if(event.keyCode == 13) {
			return;
		}
	},
	getSortedKeys: function(obj) {
	    var keys = []; for(var key in obj) keys.push(key);
	    return keys.sort(function(a,b){return obj[a]-obj[b]});
	},
	/*searchSong: function(titlePart,result) {
		Searchbar.toggleSearchProgress(true);
		SongCard.cards = [];
		var parts = titlePart.split(" ");
		Search.counterArray = [];
		var counterMax = parts.length;
		var counter = 0;
		endFunction = function() {
			counter += 1;
			if(counter == counterMax) {
				Search.drawAllSongs(Search.getSortedKeys(Search.counterArray).reverse(),
					function() {
						SongCard.drawCards();
						Searchbar.toggleSearchProgress(false);
					});
			}
		};
		for(var i = 0; i < parts.length; i++) {
			if(parts[i] == "") {
				endFunction();
				continue;
			}
			if(parts[i][0] == "#") {
				var label = parts[i].substr(1,parts[i].length);
				Database.getByLabel(label,function(result) {
					Search.countSongsInArray(result);
					endFunction();
				});
			}
		    else {
		    	Database.getByTitlePart(parts[i],function(result) {
					Search.countSongsInArray(result);
					endFunction();
				});
		    }
		}
	},*/
	searchSong: function(titlePart) {
		Searchbar.toggleSearchProgress(true);
		SongCard.cards = [];
		var parts = titlePart.split(" ");
		Search.counterArray = [];
		var counterMax = parts.length;
		var counter = 0;
		endFunction = function() {
			counter += 1;
			if(counter == counterMax) {
				Search.drawAllSongs(Search.getSortedKeys(Search.counterArray).reverse(),
					function() {
						SongCard.drawCards();
						Searchbar.toggleSearchProgress(false);
					});
			}
		};
		loop = function(index) {
			if(index < parts.length) {
				if(parts[index] == "") {
					endFunction();
					loop(index+1);
				}
				else {
					if(parts[index][0] == "#") {
						var label = parts[index].substr(1,parts[index].length);
						Database.getByLabel(label,function(result) {
							Search.countSongsInArray(result);
							endFunction();
							loop(index+1);
						});
					}
				    else {
				    	Database.getByTitlePart(parts[index],function(result) {
							Search.countSongsInArray(result);
							endFunction();
							loop(index+1);
						});
				    }
				}
			}
			else {
				endFunction();
			}
		};

		loop(0);
	},
	drawAllSongs: function(songArray,end) {
		if(songArray.length == 0) {
			end();
		}
		for(var i = 0; i < songArray.length; i++) {
			Database.getById(parseInt(songArray[i]),function(song) {
				SongCard.addCard(song.id,song.title, song.song,song.labels);
				if(song.id == songArray[songArray.length-1]) {
					end();
				}
			});
		}
	},
	countSongsInArray: function(array) {
		for(var i = 0; i < array.length; i++) {
			if(Search.counterArray[array[i]] == undefined) {
				Search.counterArray[array[i]] = 1;
			}
			else {
				Search.counterArray[array[i]] += 1;
			}
		}
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
	}
};