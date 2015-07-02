var Themes = {
	themeArray: [
		//FONTOS A SORREND, ALUL ÁT KELL ÍRNI EGY CSOMÓ MINDENT, HA VÁLTOZIK, OTT, AHOL SPLIT-ET HASZNÁLTAM
		Config.searchBarBg+":searchbar-background:background-color:#64b5f6",
		Config.background+":body-background:background-color:#F0F8FF",
		Config.circleButtonBg+":circle-button-background:background-color:#F44336",
		Config.cardBg+":card-panel:background-color:#FFFFFF",
	],
	themeSettingToHtml: function(id,themeString) {
		var themeSettingArray = themeString.split(":");
		return '<tr><td class="settings-size"><span>' + themeSettingArray[0] + ':</span></td>'+
						'<td>'+
							'<div class="col s12">'+
								'<input type="text" id="' + id + '" class="js-edit-theme" value="' + themeSettingArray[3] + '"/>'+
							'</div>'+
						'</td>'+
					'</tr>';
	},
	/**
	** fromArray - ha ez igaz, akkor a fent meghatározott tömbből fogja beállítani a stílust, egyébként az űrlapon megadott stílusokból
	**/
	setCurrentTheme: function(fromArray) {
		if(fromArray) {
			jQuery.each(Themes.themeArray, function(key,value) {
				Themes.setStringTheme(value);
			});
		}
		else {
			$(".js-edit-theme").each(function(elem) {
				var id = $(this).attr("id");
				var str = Themes.themeArray[id];
				var themeSettingArray = str.split(":");
				themeSettingArray[3] = $(this).val();
				Themes.setStringTheme(themeSettingArray.join(":"));
			});
		}
	},
	setStringTheme: function(string) {
		console.log(string);
		var themeSettingArray = string.split(":");
		//$("."+themeSettingArray[1]).css(themeSettingArray[2],themeSettingArray[3]);

		if(themeSettingArray[2] == "background-color") {
			$( "."+themeSettingArray[1] ).animate({
				backgroundColor: themeSettingArray[3]
			}, 1000 );
		}
		else if(themeSettingArray[2] == "color") {
			$( "."+themeSettingArray[1] ).animate({
				color: themeSettingArray[3]
			}, 1000 );
		}
	}
};

$(function(){
	//$(".js-theme-settings").
	jQuery.each(Themes.themeArray, function(key,value) {
		$(".js-theme-settings").append(Themes.themeSettingToHtml(key,value));
		jQuery(".js-edit-theme").ColorPicker({
			color: value.split(":")[3],
			onSubmit: function(hsb, hex, rgb, el) {
				$(el).val("#"+hex);
				$(el).ColorPickerHide();
				Themes.setCurrentTheme(false);
			}
		});
	});
});
