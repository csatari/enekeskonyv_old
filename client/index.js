$(function(){
 	$('.button-collapse').sideNav({menuWidth: 240, activationWidth: 70});
 	//$(".button-collapse").sideNav();
 	$('.collapsible').collapsible();
 	$('.button-collapse').sideNav('hide');
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
  /*$(".js-page").load("song.html", function() {
      Config.runConfig();
      jQuery.getScript("song.js").done(function() {
        console.log("song.html betöltés");
      });
  });*/
});

var Index = {
  showError: function(string) {
    $('#js-registration-result').text(string);
    Registration.setRegistrationResultIcon(false);
    jQuery('#js-registration-result-modal').openModal();
  },
  clearPage: function() {
    $(".js-song-card-collection").html("");
    $(".js-song-page").html("");
  }
};