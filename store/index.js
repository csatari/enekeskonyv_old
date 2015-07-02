$(function(){
 	$('.button-collapse').sideNav({menuWidth: 240, activationWidth: 70});
 	//$(".button-collapse").sideNav();
 	$('.collapsible').collapsible();
 	$('.button-collapse').sideNav('hide');
 	
  $(".js-search").keyup(function() {
      if($(".js-search").val().length > 0) {
        Search.searchSong($(".js-search").val());
      }
  });
  $(".js-search").change(function() {
      if($(".js-search").val().length > 0) {
        Search.searchSong($(".js-search").val());
      }
  });
});