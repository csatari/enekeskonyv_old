$(function(){
	$(".js-modal-textbox-ok").click(function() {

		jQuery(".js-modal-textbox").closeModal();
		if(ModalTextbox.modalDone != undefined) {
			ModalTextbox.modalDone(ModalTextbox.getText());
		}
		ModalTextbox.clearText();
	});
	$(".js-modal-textbox-cancel").click(function() {
		jQuery('.js-modal-textbox').closeModal();
	});
});

var ModalTextbox = {
	setTitle: function(title) {
		$(".js-modal-textbox-title").html(title);
	},
	openTextbox: function(textname) {
		$('.js-modal-textbox-textname').html(textname);
		jQuery('.js-modal-textbox').openModal();
	},
	getText: function() {
		return $("#textbox-text").val();
	},
	clearText: function() {
		$("#textbox-text").val("");
	}
};