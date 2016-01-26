$(function(){
	$("#searchbar-back-button").click(function() {
		Searchbar.backButtonClickedPrivate();
	});
});

var Searchbar = {
	visibility:true,
	toggleSearchProgress: function(enabled) {
		if(enabled) {
			$(".js-search-progress").css("display","block");
		}
		else {
			$(".js-search-progress").css("display","none");
		}
	},
	toggleSongbar: function(enabled) {
		if(enabled) {
			$('.js-searchbar-menu').attr('style', 'display: none !important');
			$('#searchbar-back-button').attr('style', 'display: block !important');
		}
		else {
			$('.js-searchbar-menu').attr('style', 'display: block !important');
			$('#searchbar-back-button').attr('style', 'display: none !important');
		}
	},
	backButtonClickedPrivate: function() {
		setTimeout(function() {
			Searchbar.backButtonClicked();
		},250);
	},
	backButtonClicked: function() {},
	toggleVisibility: function(visible) {
		if(visible) {
			$( ".js-searchbar-background" ).css("display","block");
			$( ".js-searchbar-background" ).animate({
				height: "64px"
			}, 500, function() {});
			Searchbar.visibility = true;
		}
		else {
			$( ".js-searchbar-background" ).animate({
				height: "0px"
			}, 500, function() {
				$( ".js-searchbar-background" ).css("display","none");
			});
			Searchbar.visibility = false;
		}
	}
};