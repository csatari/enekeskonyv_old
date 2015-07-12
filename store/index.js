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
  $('body').on('click', '.js-song-edit-button', function() {
      var id = $(this).parent().parent().parent().attr("id");
      console.log("megnyomom az editet");
      SideNav.goToEdit(function() {
        $('.material-tooltip').remove();
        Edit.setEditedSong(id,true);
      });
  });
  $('.js-song-edit-button').click(function() {
    console.log("clicked?");
  })
});

var Index = {
  showError: function(string) {
    $('#js-registration-result').text(string);
    Registration.setRegistrationResultIcon(false);
    jQuery('#js-registration-result-modal').openModal();
  }
};