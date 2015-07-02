$(function(){
 	$( ".js-registration" ).click(function() {
  		//regisztrációs ablak megnyitása
  		jQuery('#js-registration-modal').openModal();
  		//sidenav eltüntetése
  		jQuery('.button-collapse').sideNav('hide'); 
	});
	//Regisztráció gombra kattint
	$( ".js-registration-model-send" ).click(function() {
		//utolsó jelszó egyezés ellenőrzés
		if($("input#password").val() != $("input#password-re").val()) {
			$('#js-registration-result').text(Config.notEqualPasswords);
			$('#js-registration-result-modal-title').text(Config.registrationTitle);
			Registration.setRegistrationResultIcon(false);
			jQuery('#js-registration-result-modal').openModal();
			return;
		}
		//regisztráció elküldés
		jQuery('#js-registration-modal').closeModal();
  		Registration.sendRegistration($("input#lastname").val(),$("input#firstname").val(),
  			$("input#username").val(),$("input#email").val(),$("input#password").val(),
  			function() {
  				//siker
  				$('#js-registration-result').text(Config.registrationSuccesful);
  				$('#js-registration-result-modal-title').text(Config.registrationTitle);
  				Registration.setRegistrationResultIcon(true);
  				jQuery('#js-registration-result-modal').openModal();
  			},
  			function() {
  				//hiba
  				$('#js-registration-result').text(Config.registrationUnsuccesful);
  				$('#js-registration-result-modal-title').text(Config.registrationTitle);
				Registration.setRegistrationResultIcon(false);
				jQuery('#js-registration-result-modal').openModal();
  			});

	});
	//felhasználónév mezőből kilép
	$("input#username").blur(function() {
		Registration.isUsernameValid($("input#username").val());
	});
	$("input#password").blur(function() {
		Registration.arePasswordsEqual($("input#password").val(),$("input#password-re").val());
	});
	$("input#password-re").blur(function() {
		Registration.arePasswordsEqual($("input#password").val(),$("input#password-re").val());
	});

});

var Registration = {
	isValidName: function(name) {
		var firstLetter = name.charAt(0);
		if (firstLetter == firstLetter.toUpperCase()) {
			return true;
		}
		else return false;
	},
	/**
	 * bekapcsolja a circular progresst, és kikapcsolja a hibaszöveget
	 */
	setLoading: function() {
		$('.js-form-checking-loader').css({'display': 'block'});
		$('.js-form-error').text("");
	},
	stopLoading: function() {
		$('.js-form-checking-loader').css({'display': 'none'});
	},
	setError: function(error) {
		$('.js-form-checking-loader').css({'display': 'none'});
		$('.js-form-error').text(error);
	},
	clearError: function() {
		$('.js-form-error').text("");
	},
	isUsernameValid: function(username) {
		$.ajax({method: "POST", 
				url: Config.url+Config.registrationPage, 
				data: {"username": username}
			})
		.done(function(result) {
			if(JSON.parse(result)) {
				Registration.setError(Config.usernameExists);
			}
			else {
				Registration.clearError();
			}
		});
	},
	arePasswordsEqual: function(password1, password2) {
		if((password1 == "" && password2 == "") || password2 == "") {
			Registration.clearError();
			return;
		}
		if(password1 != password2) {
			Registration.setError(Config.notEqualPasswords);
		}
		else {
			Registration.clearError();
		}
	},

	sendRegistration: function(lastname,firstname,username,email,password,afterGood,afterBad) {
		$.ajax({method: "POST", 
				url: Config.url+Config.registrationPage, 
				data: {"firstname": firstname, "lastname": lastname, "username": username, "email": email, "password": password}
			})
		.done(function(result) {
			if(JSON.parse(result)) {
				afterGood();
			}
			else {
				afterBad();
			}
		});
	},
	// beállítja a regisztráció eredmény ablak ikonját -> true esetén siker, false esetén hiba
	setRegistrationResultIcon: function(state) {
		if(state) {
			$('.js-registration-result-good').css({'display': 'block'});
			$('.js-registration-result-bad').css({'display': 'none'});
		}
		else {
			$('.js-registration-result-good').css({'display': 'none'});
			$('.js-registration-result-bad').css({'display': 'block'});
		}
	}

};
