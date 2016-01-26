$(function(){
	var comboid;
	$(".js-combo-settings").click(function() {
		Settings.showSettings();
	});
	$(".js-combo-save").click(function() {
		Settings.closeSettings();
	});
	$(".js-combo-input").focus(function() {
		Settings.startListening(this);
	});
	$(".js-combo-input").blur(function() {
		Settings.stopListening();
	});
	/*$(".js-combo-darken").focus(function() {
		Settings.startListening(".js-combo-darken");
	});
	$(".js-combo-darken").blur(function() {
		Settings.stopListening();
	});
	$(".js-combo-transpose-up").focus(function() {
		Settings.startListening(".js-combo-transpose-up");
	});
	$(".js-combo-transpose-up").blur(function() {
		Settings.stopListening();
	});
	$(".js-combo-transpose-down").focus(function() {
		Settings.startListening(".js-combo-transpose-down");
	});
	$(".js-combo-transpose-down").blur(function() {
		Settings.stopListening();
	});*/


	$(document).keydown(function(e){
		if(Settings.listening) {
			if(e.ctrlKey && !e.altKey && !e.shiftKey) {
				console.log(e.which);
				Settings.setKey("Ctrl",e.which);
				e.preventDefault();
			}
			else if(!e.ctrlKey && e.altKey && !e.shiftKey) {
				console.log(e.which);
				Settings.setKey("Alt",e.which);
				e.preventDefault();
			}
			else if(!e.ctrlKey && !e.altKey && e.shiftKey) {
				console.log(e.which);
				Settings.setKey("Shift",e.which);
				e.preventDefault();
			}
			else if(e.ctrlKey && e.altKey && !e.shiftKey) {
				console.log(e.which);
				Settings.setKey("Ctrl+Alt",e.which);
				e.preventDefault();
			}
			else if(e.ctrlKey && !e.altKey && e.shiftKey) {
				console.log(e.which);
				Settings.setKey("Ctrl+Shift",e.which);
				e.preventDefault();
			}
			else if(!e.ctrlKey && e.altKey && e.shiftKey) {
				console.log(e.which);
				Settings.setKey("Alt+Shift",e.which);
				e.preventDefault();
			}
			else if(e.ctrlKey && e.altKey && e.shiftKey) {
				console.log(e.which);
				Settings.setKey("Ctrl+Alt+Shift",e.which);
				e.preventDefault();
			}
			else {
				e.preventDefault();
			}
		}
		else {
			comboid = Settings.Save.getId(e.which,e.ctrlKey,e.altKey,e.shiftKey);
			if(comboid != 0) {
				Settings.comboPressed(comboid);
				e.preventDefault();
			}
		}
	});
});
/*
Id - Action
1 - Elsötétítés
2 - Transzponálás fel
3 - Transzponálás le

*/
var Settings = {
	listening:false,
	accessor:"",
	comboPressed: function(id) {
		console.log(id);
		if(id == 1) { //elsötétítés
			Song.Action.darken();
		}
		else if(id == 2) { // transzponálás fel
			Song.Action.transposeUp();
		}
		else if(id == 3) { // transzponálás le
			Song.Action.transposeDown();
		}
		else if(id == 4) { //versszakos mód
			Song.Action.verseMode();
		}
	},
	showSettings: function() {
		$('.button-collapse').sideNav('hide');
		$("#js-keyboard-combo-modal").openModal();
	},
	closeSettings: function() {
		Settings.getAllKeys(function(strings,ids) {
			Settings.Save.saveKeys(strings,ids, function() {
				Settings.Save.updateHtml();
				$("#js-keyboard-combo-modal").closeModal();
			});
		});
	},
	startListening: function(accessor) {
		Settings.listening = true;
		Settings.accessor = accessor;
	},
	stopListening: function() {
		Settings.listening = false;
	},
	setKey: function(trigger,key) {
		var c = String.fromCharCode(key);
		Common.setInputValue(Settings.accessor,trigger+"+"+c);
		//$(Settings.accessor).attr("value",trigger+"+"+c);
	},
	getAllKeys: function(callback) {
		var keyStrings = [];
		var keyIds = [];
		var children = $(".js-combo-list").children().children("input");
		$(".js-combo-list").find("input").each(function(id) {
			keyStrings.push($(".js-combo-list").find("input").eq(id).val());
			keyIds.push(parseInt($(".js-combo-list").find("input").eq(id).attr("data")));
		});
		callback(keyStrings,keyIds);
	},
	Save: {
		db_name:"SongbookDB",
		db_table_name:"key",
		db:null,
		saveKeys: function(keyStrings,keyStringId,done) {
			var transaction = Database.db.transaction([Settings.Save.db_table_name], "readwrite");
			transaction.oncomplete = function(event) {
				//console.log("All done!");
				done();
			};

			transaction.onerror = function(event) {
				// Don't forget to handle errors!
			};
			var objectStore = transaction.objectStore(Settings.Save.db_table_name);
			
			var putter = function(id) {
				var alt=false,
					ctrl=false,
					shift=false;
					c=null;
				if(keyStrings[id].match(/Ctrl/) != null) {
					ctrl=true;
				}
				if(keyStrings[id].match(/Alt/) != null) {
					alt=true;
				}
				if(keyStrings[id].match(/Shift/) != null) {
					shift=true;
				}
				c = keyStrings[id].charCodeAt(keyStrings[id].length-1);

				var request = objectStore.put({
			    	"id": keyStringId[id],
			    	"keychar": c,
			    	"alt": alt,
			    	"ctrl": ctrl,
			    	"shift": shift
			    });
				request.onsuccess = function(event) {
					console.log(event);
					if(id < keyStrings.length-1) {
						putter(id+1);
					}
				};
				request.onerror = function(event) {
					console.log("error");
					if(id < keyStrings.length-1) {
						putter(id+1);
					}
				};
			};
			if(keyStrings.length > 0) {
				putter(0);
			}
		},
		loadKeys: function(callback) {
			var transaction = Database.db.transaction([Settings.Save.db_table_name], "readwrite");
			var store = transaction.objectStore(Settings.Save.db_table_name);
			var items = [];
			transaction.oncomplete = function(event) {
				callback(items);
			};

			transaction.onerror = function(event) {
				// Don't forget to handle errors!
			};
			var cursorRequest = store.openCursor();

			cursorRequest.onsuccess = function(evt) {                    
		        var cursor = evt.target.result;
		        if (cursor) {
		            items.push(cursor.value);
		            cursor.continue();
		        }
		    };
		},
		updateHtml: function() {
			Settings.Save.loadKeys(function(keys) {
				$(".js-key-combos").html("");
				for(var i in keys) {
					var ctrl=0,alt=0,shift=0,value = "";
					if(keys[i].ctrl) { ctrl=1; value += "Ctrl+"; }
					if(keys[i].alt) { alt=1; value += "Alt+"; }
					if(keys[i].shift) { shift=1; value += "Shift+"; }
					value += String.fromCharCode(keys[i].keychar);
					$(".js-key-combos").html($(".js-key-combos").html()+
						"|"+keys[i].id+":"+ctrl+alt+shift+","+keys[i].keychar);
					console.log(value);
					Common.setInputValue(".js-combo-input[data=\""+keys[i].id+"\"]",value);
				}
			});
		},
		getId: function(keychar,ctrl_,alt_,shift_) {
			var ctrl=0,alt=0,shift=0,id=0;
			if(ctrl_) ctrl=1;
			if(alt_) alt=1;
			if(shift_) shift=1;
			var keys = $(".js-key-combos").html();
			var regex = new RegExp("\\|[0-9]+:"+ctrl+alt+shift+","+keychar,"g");

			keys.replace(regex,function(s) {
				var temp = s.match(/\|[0-9]*:/)[0];
				id = temp.substr(1,temp.length-2);
				return s;
			});
			return parseInt(id);
		}
	}
};