var Songbooks = {
	showAllVisibleSongbooks: function() {
		UserData.getAllVisibleSongbooks(Login.getSessionId(),
			function(result) {
				result.map(function(element) {
					console.log(element);
					SongbookCard.addCard(element.id,element.userid,element.title,element.public,element.username,element.permissions,element.permissionlevel);
				});	
				SongbookCard.drawCards();
			},function(r) {});
	}	
};