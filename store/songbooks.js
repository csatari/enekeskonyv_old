$(function(){
	$(document).on('click','.js-songbook-title',function(){
		var id = $(this).parent().attr("id");
		Footer.downloadData(id);
		//Footer.toggleVisibility(true);
	});
});
var Songbooks = {
	showAllVisibleSongbooks: function() {
		UserData.getAllVisibleSongbooks(Login.getSessionId(),
			function(result) {
				SongbookCard.cards = [];
				result.map(function(element) {
					console.log(element);
					SongbookCard.addCard(element.id,element.userid,element.title,element.public,element.username,element.permissions,element.permissionlevel,element.songnumber);
				});	
				SongbookCard.drawCards();
			},function(r) {});
	},
	showAllSongbookSongs: function(songbookId) {
		SongbookData.getAllSongFromSongbook(Login.getSessionId(),songbookId,
			function(result) {
				SongCard.cards = [];
				result.map(function(item) {
					SongCard.addCard(item.id,item.title, item.song,item.labels, item.permissions, item.in_songbook);
				});
				SongCard.drawCards();
			},function(r) {});
	}
};