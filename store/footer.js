$(function(){
	$(".js-footer-close").click(function() {
		Footer.toggleVisibility(false);
	});
	$(".js-footer").click(function() {
		Songbooks.showAllSongbookSongs(Footer.songbook.id);
	});
});

var Footer = {
	songbook: {
		id: 0,
		title: "",
		songNumber: 0
	},
	downloadData: function(id) {
		//download data for songbook by id
		SongbookData.getSongbookData(Login.getSessionId(),id,
			function(songbook) {
				Footer.setId(songbook.id);
				Footer.setData(songbook.title, songbook.songnumber);
				Footer.toggleVisibility(true);
			},function(res) {});
		//open it too
	},
	setId: function(id) {
		$(".js-footer-songbook-id").text(id);
		Footer.songbook.id = id;
	},
	toggleVisibility: function(visible) {
		if(visible) {
			$( "div.js-footer" ).animate({
				height: "75px"
			}, 100, function() {
				// Animation complete.
			});
		}
		else {
			$( "div.js-footer" ).animate({
				height: "0px"
			}, 100, function() {
				// Animation complete.
			});
		}
	},
	setData: function(title,songNumber) {
		$(".js-footer-title").text(title);
		$(".js-footer-song-number").text(songNumber + " " + Config.songs);
		Footer.songbook.title = title;
		Footer.songbook.songNumber = songNumber;
	}
};