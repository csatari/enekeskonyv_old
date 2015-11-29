var Themes = {
	NAME: 0,
	MARKER: 1,
	TAG: 2,
	VALUE: 3,
	defaultArray: [
		Config.searchBarBg+":searchbar-background:background-color:#64b5f6",
		Config.background+":body-background:background-color:#F0F8FF",
		Config.circleButtonBg+":circle-button-background:background-color:#F44336",
		Config.cardBg+":card-panel:background-color:#FFFFFF",
	],
	themeArray: [
		//0 				1 						2  				3
		Config.searchBarBg+":searchbar-background:background-color:#64b5f6",
		Config.background+":body-background:background-color:#F0F8FF",
		Config.circleButtonBg+":circle-button-background:background-color:#F44336",
		Config.cardBg+":card-panel:background-color:#FFFFFF",
	],
	downloadedThemes: [],
	myChosenTheme: 0,
	getStringFromArrayByMarker: function(array,marker) {
		var val = undefined;
		$.each(array,function(key,value) {
			var str = value.split(":");
			if(str[Themes.MARKER] == marker) {
				val = value;
			}
		});
		return val;
	},
	themeSettingToHtml: function(id,themeString) {
		var themeSettingArray = themeString.split(":");
		return '<tr><td class="settings-size"><span>' + themeSettingArray[Themes.NAME] + ':</span></td>'+
						'<td>'+
							'<div class="row"><div class="col s12">'+
								'<input type="text" id="' + themeSettingArray[Themes.MARKER] + '" class="js-edit-theme" value="' + themeSettingArray[Themes.VALUE] + '"/>'+
							'</div></div>'+
						'</td>'+
					'</tr>';
	},
	/**
	** fromArray - ha ez igaz, akkor a fent meghatározott tömbből fogja beállítani a stílust, egyébként az űrlapon megadott stílusokból
	**/
	setCurrentTheme: function(fromArray) {
		if(fromArray) {
			jQuery.each(Themes.themeArray, function(key,value) {
				var themeSettingArray = value.split(":");
				if(value == "") {
					$.each(Themes.defaultArray,function(key,value) {
						var themeDefaultArray = value.split(":");
						var inTheme = false;
						$.each(Themes.themeArray,function(key_,value_) {
							var splittedThemeArray = value_.split(":");
							if(splittedThemeArray[Themes.MARKER] == themeDefaultArray[Themes.MARKER]) {
								inTheme = true;
							}
						});
						if(!inTheme) {
							Themes.setStringTheme(value,themeDefaultArray[Themes.MARKER]);
							Themes.themeArray.push(value);
						}
					});
				}
				else {
					Themes.setStringTheme(value,themeSettingArray[Themes.MARKER]);
				}
				
			});
		}
		else {
			$(".js-edit-theme").each(function(elem) {
				var id = $(this).attr("id");
				var str = Themes.getStringFromArrayByMarker(Themes.themeArray,id);
				//var str = Themes.themeArray[id];
				var themeSettingArray = str.split(":");
				themeSettingArray[Themes.VALUE] = $(this).val();
				Themes.setStringTheme(themeSettingArray.join(":"));
			});
		}
	},
	setStringTheme: function(string,id) {
		var themeSettingArray = string.split(":");
		//$("."+themeSettingArray[1]).css(themeSettingArray[2],themeSettingArray[3]);
		if(id != undefined) {
			$("#"+id+".js-edit-theme").val(themeSettingArray[Themes.VALUE]);
			jQuery("#"+id+".js-edit-theme").ColorPickerSetColor(themeSettingArray[Themes.VALUE]);
		}
		if(themeSettingArray[Themes.TAG] == "background-color") {
			$( "."+themeSettingArray[Themes.MARKER] ).animate({
				backgroundColor: themeSettingArray[Themes.VALUE]
			}, 1000 );
		}
		else if(themeSettingArray[Themes.TAG] == "color") {
			$( "."+themeSettingArray[Themes.MARKER] ).animate({
				color: themeSettingArray[Themes.VALUE]
			}, 1000 );
		}
	},
	setCurrentId: function(id) {
		$(".editing-id").text(id);
	},
	getCurrentId: function() {
		return $(".editing-id").text();
	},
	saveSetTheme: function() {
		var title = $(".js-chosen-theme-name").val();
		if(title == "") {
			Index.showError(Config.missingTitle);
			return;
		}
		var public = $(".js-chosen-theme-public").is(":checked");
		var id = Themes.getCurrentId();
		console.log("most az id: "+id)
		if(id == "-1" || id == "0" || id == "") {
			id = "0";
		}
		console.log("most az id2: "+id)
		var fullStrArray = [];
		$(".js-edit-theme").each(function(element) {
			var id = $(this).attr("id");
			var str = Themes.getStringFromArrayByMarker(Themes.themeArray,id);
			//var str = Themes.themeArray[id];
			var themeSettingArray = str.split(":");
			themeSettingArray[Themes.VALUE] = $(this).val();
			fullStrArray.push(themeSettingArray.join(":"));
		});
		UserData.addTheme(Login.getSessionId(),
							id,title,public,fullStrArray.join(";"),
							function(result) {
								Themes.setCurrentId(result);
								Themes.getThemes(result,function(){});
							},
							function(result) {
								Index.showError(result);
							});
	},
	getThemes: function(id, done) {
		UserData.getThemes(Login.getSessionId(),
			function(result) {
				Themes.downloadedThemes = result;
				Themes.setThemeSelection();
				if(id != undefined) {
					$('.js-choose-theme').val(id);
				}
				done();
			},
			function(result) {});
	},
	setThemeSelection: function() {
		$(".js-choose-theme").html("");
		//$(".js-choose-theme").append('<option class="conf-default" value="0">Alapbeállítás_</option>');
		$(".js-choose-theme").append('<option class="conf-custom" value="-1">Egyedi_</option>');
		Config.runConfig();
		$.each(Themes.downloadedThemes,function(key,value) {
			$(".js-choose-theme").append('<option value="'+value["id"]+'">'+value['title']+'</option>');
		});
		$(".js-choose-theme").val(Themes.myChosenTheme);
	},
	setThemeById: function(themeid) {
		if(Themes.downloadedThemes == "") {
			return;
		}
		Themes.setCurrentId(themeid);
		if(themeid == "0") {
			Common.setInputValue(".js-chosen-theme-name","");
			//$(".js-chosen-theme-name").val("");
			Themes.themeArray = Themes.defaultArray;
			Themes.setCurrentTheme(true);
			UserData.setTheme(Login.getSessionId(),themeid,function(res){},function(res){});
		}
		else if(themeid == "-1") {
			//egyedi
			Common.setInputValue(".js-chosen-theme-name","");
			Themes.setCurrentId("");
		}
		else {
			var chosenTheme;
			$.each(Themes.downloadedThemes,function(key,value) {
				if(value["id"] == themeid) {
					chosenTheme = value;
				}
			});
			Common.setInputValue(".js-chosen-theme-name",chosenTheme["title"]);
			//$(".js-chosen-theme-name").val(chosenTheme["title"]);
			if(chosenTheme["public"] == "1") {
				$(".js-chosen-theme-public").prop('checked', true);
			}
			else {
				$(".js-chosen-theme-public").prop('checked', false);
			}
			var splittedTheme = chosenTheme["theme"].split(";");
			Themes.themeArray = [];
			$.each(splittedTheme,function(key,value) {
				Themes.themeArray.push(value);
			});
			Themes.setCurrentTheme(true);
			Themes.myChosenTheme = themeid;
			UserData.setTheme(Login.getSessionId(),themeid,function(res){},function(res){});
		}
	},
	applyUserTheme: function() {
		Themes.getThemes(undefined,function() {
			UserData.getTheme(Login.getSessionId(),
				function(result) {
					Themes.setThemeById(result);
				},function(result) {});
		});
	}
};

$(function(){
	//téma beállítása
	Themes.applyUserTheme();
	jQuery.each(Themes.themeArray, function(key,value) {
		$(".js-theme-settings").append(Themes.themeSettingToHtml(key,value));
		jQuery(".js-edit-theme").ColorPicker({
			color: value.split(":")[Themes.VALUE],
			onSubmit: function(hsb, hex, rgb, el) {
				$(el).val("#"+hex);
				jQuery(el).ColorPickerHide();
				Themes.setCurrentTheme(false);
			}
		});
	});
	$(".js-theme-button").click(function() {
		Themes.saveSetTheme();
	});
	$(".js-choose-theme").change(function() {
		Themes.setThemeById($(".js-choose-theme").val());
	});
});
