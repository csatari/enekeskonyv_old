$(function(){
	$("#invertedCanvas").css('visibility','collapse');
	$("#invertedCanvas").css('height','0');
});

var Sheet = {
	sheet:"",
	inverted:false,
	loading:false,
	transposed:false,
	transpose_count:0,
	MAX_TRANSPOSE:15,
	MIN_TRANSPOSE:-7,
	exit: function() {
		Song.sheet = "";
		Song.inverted = false;
		Song.loading = false;
		Song.transposed = false;
		Song.transpose_count = 0;
	},
	refresh: function() {
		Sheet.loading = true;
		var tabdiv = new Vex.Flow.TabDiv("div.vex-tabdiv"); 
		tabdiv.code = Sheet.sheet; 
		tabdiv.redraw(); 
		$(".editor").val(Sheet.sheet);
		Sheet.loading = false;
	},
	toHTML: function() {
		return "<div class=\"vextab-container\">" +
			"<div class=\"vex-tabdiv\" scale=\"1.0\" editor=\"false\" editor_width=\"800\" editor_height=\"330\">" +
				Sheet.sheet +
			"</div>"+
			"<canvas id=\"invertedCanvas\" width=\"680\" style=\"background: black;visibility:collapse;height:0\"></canvas>" +
		"</div>";
	},
	setScale: function(scale) {
		var reScale = /scale=[0-9.]*/;
		var reOptions = /options/;
		if(reScale.test(Sheet.sheet)) {
			Sheet.sheet = Sheet.sheet.replace(reScale,"scale="+scale);
		}
		else {
			Sheet.sheet = Sheet.sheet.replace(reOptions,"options scale="+scale);
		}
	},
	setWidth: function(width) {
		var reWidth = /width=[0-9.]*/;
		var reOptions = /options/;
		if(reWidth.test(Sheet.sheet)) {
			Sheet.sheet = Sheet.sheet.replace(reWidth,"width="+width);
		}
		else {
			Sheet.sheet = Sheet.sheet.replace(reOptions,"options width="+width);
		}
	},
	invert: function(done) {
		Sheet.createInvertedImage(function() {
			if(!Sheet.inverted) {
	            $(".vex-canvas").css('visibility','collapse');
	            $("#invertedCanvas").css('height',$(".vex-canvas").css('height'));
	            $("#invertedCanvas").css('width',$(".vex-canvas").css('width'));
	            $(".vex-canvas").css('height','0');
	            $("#invertedCanvas").css('visibility','visible');
	            $("body").css("background","black");
	        }
	        else {
	            $(".vex-canvas").css('visibility','visible');
	            $("#invertedCanvas").css('visibility','collapse');
	            $(".vex-canvas").css('height',$("#invertedCanvas").css('height'));
	            $(".vex-canvas").css('width',$("#invertedCanvas").css('width'));
	            $("#invertedCanvas").css('height','0');
	            $("body").css("background","white");
	        }
	        Sheet.inverted = !Sheet.inverted;
	        if(done!=undefined) { done(); }
		});
	},
	refreshForInverted: function() {
		if(Sheet.inverted) {
			Sheet.invert(Sheet.invert);
		}
	},
	createInvertedImage: function(ended) {
		var imageObj = $('.vex-canvas').get(0);
		var canvas = document.getElementById('invertedCanvas');
        var context = canvas.getContext('2d');
        var x = 0;
        var y = 0;
        canvas.height = imageObj.height;
        canvas.width = imageObj.width;
        context.drawImage(imageObj, x, y);

        var imageData = context.getImageData(x, y, imageObj.width, imageObj.height);
        var data = imageData.data;

        for(var i = 0; i < data.length; i += 4) {
            if(data[i] == 0 && data[i+1] == 0 && data[i+2] == 0) {
                data[i] = 255;
                data[i+1] = 255;
                data[i+2] = 255;
            }
            else if(data[i] == 255 && data[i+1] == 255 && data[i+2] == 255){
                data[i] = 255 - data[i];
                // green
                data[i + 1] = 255 - data[i + 1];
                // blue
                data[i + 2] = 255 - data[i + 2];
            }
            else {
                data[i] = 186;
                data[i+1] = 186;
                data[i+2] = 186;
            }
        }

        // overwrite original image
        context.putImageData(imageData, x, y);
        ended();
	},


	KeyPrediction: {
		forEachNote: function(noteFunction) {
			Sheet.KeyTransposing.replaceForEveryRythm(function(rhythm) {
				rhythm.replace(/[ABCDEFG](#)?/g,function(str) {
					noteFunction(str);
					return str;
				});
				return rhythm;
			});
		},
		countAllNotes: function() {
			var collection = {};
			Sheet.KeyPrediction.forEachNote(function(note) {
				if(collection[note] == undefined) {
					collection[note] = 1;
				}
				else {
					collection[note]++;
				}
			});
			return collection;
		},
		createKeyDegreeArray: function(array) {
			var degreeArray = [];
			var order = ["F","C","G","D","A","E"]; //sorrend
			for (var i = 0; i < order.length; i++) {
				degreeArray[i] = 0;
				//sima hang
				var note = order[i];
				if(array[note] != undefined) {
					degreeArray[i]-=array[note];
				}
				//keresztes hang
				note = note + "#";
				if(array[note] != undefined) {
					degreeArray[i]+=array[note];
				}
			};
			return degreeArray;
		},
		takeFirstNValue: function(array,n) {
			return array.slice(0,n);
		},
		removeBelowZeroFromBack: function(array) {
			var l = array.length;
			for (var i = array.length - 1; i >= 0; i--) {
				if(array[i] <= 0) {
					l--;
				}
				else break;
			}
			return Sheet.KeyPrediction.takeFirstNValue(array,l);
		},
		getKeyNumberFromKeyDegreeArray: function(array) {
			array = Sheet.KeyPrediction.removeBelowZeroFromBack(array);
			var keyNumber = array.length;

			var sum = -1;
			while(sum < 0 && keyNumber != 0) {
				sum = 0;
				for (var i = 0; i<keyNumber; i++) {
					sum += array[i];
				}
				if(sum < 0) {
					keyNumber--;
				}
			}
			array = Sheet.KeyPrediction.takeFirstNValue(array,keyNumber);


			array = Sheet.KeyPrediction.removeBelowZeroFromBack(array);
			keyNumber = array.length;

			return keyNumber;
		},
		//4 kitalálja az új előjegyzést
		getPredictedKey: function() {
			var keyDegree = Sheet.KeyPrediction.createKeyDegreeArray(Sheet.KeyPrediction.countAllNotes());
			var keyNumber = Sheet.KeyPrediction.getKeyNumberFromKeyDegreeArray(keyDegree);
			return Sheet.KeyPrediction.getKeyFromKeyNumber(keyNumber);
		},
		getKeyFromKeyNumber: function(keyNumber) {
			if(keyNumber == 0) return "C";
			else if(keyNumber == 1) return "G";
			else if(keyNumber == 2) return "D";
			else if(keyNumber == 3) return "A";
			else if(keyNumber == 4) return "E";
			else if(keyNumber == 5) return "B";
			else if(keyNumber == 6) return "F#";
		},
		setAllKeys: function(key) {
			Sheet.sheet = Sheet.sheet.replace(/key=[ABCDEFG](#)?/g,"key="+key);
		},
		removeSharpsAccordingToKey: function(key) {
			Sheet.KeyPrediction.actualKey = key;
			Sheet.KeyTransposing.replaceForEveryRythm(Sheet.KeyPrediction.removeSharpsInRhythm);
		},
		actualKey: "C",
		removeSharpsInRhythm: function(rhythm) {
			var notesToUnsharpen = Sheet.KeyTransposing.keyToSharpen(Sheet.KeyPrediction.actualKey);
			rhythm = rhythm.replace(/[ABCDEFG](#)?/g,function(str) {
				if(str.length > 1) {
					if(str.substr(1,2) == "#" && notesToUnsharpen.indexOf(str.substr(0,1)) != -1) {
						return str.substr(0,1);
					}
					return str;
				}
				else {
					if(notesToUnsharpen.indexOf(str) != -1) {
						return str+"n";
					}
					else {
						return str;
					}
				}
			});
			return rhythm;
		},
		//4 kitalálja az új előjegyzést
		//5 állítsa be az új előjegyzést
		changeToPredictedKey: function() {
			//4 kitalálja az új előjegyzést
			var key = Sheet.KeyPrediction.getPredictedKey();
			Sheet.KeyPrediction.setAllKeys(key);
			//5.1 kitalálja, hogy melyik hangokat érinti
			//5.2 amelyik hangon kereszt van, arról leszedi
			//5.3 amin nem volt, arra natural-t tesz
			Sheet.KeyPrediction.removeSharpsAccordingToKey(key);
			//Sheet.refresh();
		}
	},
	
	KeyTransposing: {
		replaceAllNotesAccordingToKeys: function() {
			if(/key/.test(Sheet.sheet)) {
				var reNotewKey = /key=[ABCDEFG#]((.|\s)*?)(text|tabstave)/g;
				Sheet.sheet = Sheet.sheet.replace(reNotewKey,function(str) {
					return Sheet.KeyTransposing.addSharpsAccordingToKey(str);
				});
				Sheet.KeyTransposing.replaceForEveryRythm(Sheet.KeyTransposing.normalizeSharps);
			}
		},
		replaceForEveryRythm: function(replaceFunction) {
			var reNotewKey = /key=[ABCDEFG#]((.|\s)*?)(text|tabstave)/g;
			if(! /\|/.test(Sheet.sheet)) {
				return;
			}
			Sheet.sheet = Sheet.sheet.replace(reNotewKey,function(noteline) {
				var precedingKey = noteline.substr(0,6);
				var nline = noteline.substr(6,noteline.length);
				var newNotes = "";
				var rhythmArray = nline.split("|");
				for(var i = 0;i<rhythmArray.length;i++) {
					
					newNotes = newNotes + replaceFunction(rhythmArray[i]);
					if(i != rhythmArray.length-1) {
						newNotes = newNotes + "|";
					}
				}
				newNotes = precedingKey + newNotes;
				return newNotes;
			});
		},
		//replaceForEveryRythm függvényeként használandó. Hozzáadja a natural módosítót a megfelelő hangokhoz
		addNatural: function(rhythm) {
			var sharpenedNote = [];
			rhythm = rhythm.replace(/[ABCDEFG](#)?/g,function(str) {
				if(str.length > 1) {
					if(str.substr(1,2) == "#") {
						sharpenedNote.push(str.substr(0,1));
					}
					return str;
				}
				else {
					if(sharpenedNote.indexOf(str) != -1) {
						return str+"n";
					}
					else {
						return str;
					}
					
				}
			});
			return rhythm;
		},
		//replaceForEveryRythm függvényeként használandó. Letörli az összes natural módosítót
		removeNatural: function(rhythm) {
			rhythm = rhythm.replace(/[ABCDEFG](n)/g,function(str) {
				return str.substr(0,1);
			});
			return rhythm;
		},
		//replaceForEveryRythm függvényeként használandó.
		//Ha van egy kereszt, az összes rákövetkezőt keresztezi
		normalizeSharps: function(rhythm) {
			var noteToSharpen = [];
			rhythm = rhythm.replace(/[ABCDEFG](#)?/g,function(str) {
				if(str.length > 1) {
					if(str.substr(1,2) == "#") {
						noteToSharpen.push(str.substr(0,1));
					}
					return str;
				}
				else {
					if(noteToSharpen.indexOf(str) != -1) {
						return Sheet.transposeLetterUp(str);
					}
					else {
						return str;
					}
				}
			});
			return rhythm;
		},
		//Visszaadja egy sorra, hogy mi az előjegyzés
		getKeyForLine: function(line) {
			var reKey = /key=[ABCDEFG](#)?/;
			var keyArray = Sheet.sheet.match(reKey);
			return keyArray[0].substr(4,keyArray[0].length);
		},
		//Visszaadja egy előjegyzésre, hogy mi lesz a reguláris kifejezés, 
		//ami visszaadja az előjegyzés által érintett hangokat
		//figyelmen kívül hagyja, ami mögött kereszt van, és ami natural-lal van jelölve
		getRegexForNotesAccordingToKey: function(key) {
			var keys = "";
			var keyToSharpenArray = Sheet.KeyTransposing.keyToSharpen(key);
			for(var i = 0; i<keyToSharpenArray.length;i++) {
				if(i == 0) { keys = "("; }
				keys = keys + keyToSharpenArray[i];
				if(i == keyToSharpenArray.length-1) {
					keys = keys + ")";
				}
				else {
					keys = keys + "|";
				}
			}
			return new RegExp(keys+"(?!(#|n))","g");
		},
		addSharpsAccordingToKey: function(line) {
			var key = Sheet.KeyTransposing.getKeyForLine(line);
			var regex = Sheet.KeyTransposing.getRegexForNotesAccordingToKey(key);
			
			var precedingKey = line.substr(0,6);
			var newLine = line.substr(6,line.length).replace(regex,function(str) {
				return Sheet.transposeLetterUp(str);
			});

			newLine = Sheet.KeyTransposing.changeToC(precedingKey) + newLine;
			return newLine;
		},
		changeToC: function(precedingKey) {
			return precedingKey.replace(/[ABCDEFG](#)?/g,"C");
		},
		// Megmondja egy előjegyzésről, hogy milyen hangokat kell kereszttel ellátni
		keyToSharpen: function(key) {
			if(key == "C") { return []; }
			else if(key == "G") { return ["F"]; }
			else if(key == "D") { return ["F","C"]; }
			else if(key == "A") { return ["F","C","G"]; }
			else if(key == "E") { return ["F","C","G","D"]; }
			else if(key == "B") { return ["F","C","G","D","A"]; }
			else if(key == "F#") { return ["F","C","G","D","A","E"]; }
			else if(key == "C#") { return ["F","C","G","D","A","E","B"]; }
			//TODO 7 kereszt nem támogatott ???
			//else if(key == "C#") { return ["F","C","G","D","A","E","B#"]; } //B#???
		},
		// 1 Első transzponálás
		transposeInitialization: function() {
			if(!Sheet.transposed) {
				Sheet.transposed = true;
			}
			else {
				return;
			}

			if(/key/.test(Sheet.sheet)) {
				//1.1 kereszt berakása, ahonnan hiányzik (vmi után)
				Sheet.KeyTransposing.replaceForEveryRythm(Sheet.KeyTransposing.normalizeSharps);
				//1.2 illetve natural-ok törlése
				Sheet.KeyTransposing.replaceForEveryRythm(Sheet.KeyTransposing.removeNatural);
			}
		},
		//2 átvált C-be
		changeAllNotesToCKey: function() {
			
			if(/key/.test(Sheet.sheet)) {
				//2.1 amelyik hang a kulcsban van, arra rak egy keresztet
				var reNotewKey = /key=[ABCDEFG#]((.|\s)*?)(text|tabstave)/g;
				Sheet.sheet = Sheet.sheet.replace(reNotewKey,function(str) {
					return Sheet.KeyTransposing.addSharpsAccordingToKey(str);
				});
				//2.2 letöröl minden naturalt
				Sheet.KeyTransposing.replaceForEveryRythm(Sheet.KeyTransposing.removeNatural);
			}
		},
		//3 megemel minden hangot
		raiseEveryNote: function() {
			var reNotes = /[ABCDEFG#-]+[\/][0-9]/g;
			var notesArray = Sheet.sheet.match(reNotes);
			Sheet.sheet = Sheet.sheet.replace(reNotes,function(str) {
				return Sheet.transposeNoteUp(str);
			});
		},
		//3 csökkent minden hangot
		decreaseEveryNote: function() {
			var reNotes = /[ABCDEFG#-]+[\/][0-9]/g;
			var notesArray = Sheet.sheet.match(reNotes);
			Sheet.sheet = Sheet.sheet.replace(reNotes,function(str) {
				return Sheet.transposeNoteDown(str);
			});
		}
	},
	transposeUp: function() {
		if(Sheet.transpose_count>= Sheet.MAX_TRANSPOSE) {
			return;
		}
		//1 Első transzponálás
		Sheet.KeyTransposing.transposeInitialization();
		//2 átvált C-be
		Sheet.KeyTransposing.changeAllNotesToCKey();
		//3 megemel minden hangot
		Sheet.KeyTransposing.raiseEveryNote();
		//4 kitalálja az új előjegyzést
		//5 állítsa be az új előjegyzést
		Sheet.KeyPrediction.changeToPredictedKey();

		Sheet.SheetCordTransposing.transposeUp();
		/*Sheet.KeyTransposing.replaceForEveryRythm(Sheet.KeyTransposing.removeNatural);
		var reNotes = /[ABCDEFG#-]+[\/][0-9]/g;
		var notesArray = Sheet.sheet.match(reNotes);
		console.log(notesArray);
		Sheet.sheet = Sheet.sheet.replace(reNotes,function(str) {
			return Sheet.transposeNoteUp(str);
		});
		Sheet.KeyTransposing.replaceForEveryRythm(Sheet.KeyTransposing.addNatural);*/
		Sheet.transpose_count++;
		Sheet.refresh();
		Sheet.refreshForInverted();
	},
	transposeDown: function() {
		if(Sheet.transpose_count<= Sheet.MIN_TRANSPOSE) {
			return;
		}
		//1 Első transzponálás
		Sheet.KeyTransposing.transposeInitialization();
		//2 átvált C-be
		Sheet.KeyTransposing.changeAllNotesToCKey();
		//3 megemel minden hangot
		Sheet.KeyTransposing.decreaseEveryNote();
		//4 kitalálja az új előjegyzést
		//5 állítsa be az új előjegyzést
		Sheet.KeyPrediction.changeToPredictedKey();

		Sheet.SheetCordTransposing.transposeDown();
		/*Sheet.KeyTransposing.replaceForEveryRythm(Sheet.KeyTransposing.removeNatural);
		var reNotes = /[ABCDEFG#-]+[\/][0-9]/g;
		var notesArray = Sheet.sheet.match(reNotes);
		console.log(notesArray);
		Sheet.sheet = Sheet.sheet.replace(reNotes,function(str) {
			return Sheet.transposeNoteDown(str);
		});
		Sheet.KeyTransposing.replaceForEveryRythm(Sheet.KeyTransposing.addNatural);*/
		Sheet.transpose_count--;
		
		Sheet.refresh();
		Sheet.refreshForInverted();
	},
	//Feltranszponál egy A-C-B-D/4 formájú hangsort
	transposeNoteUp: function(note) {
		var noteHeight = note.substr(note.length-1);
		var transposed = note.replace(/[ABCDEFG#]+[-]*/g,function(str) {
			return Sheet.transposeLetterUp(str,noteHeight);
		});
		return Sheet.normalizedTransposedNotes(transposed);
	},
	//Letranszponál egy A-C-B-D/4 formájú hangsort
	transposeNoteDown: function(note) {
		var noteHeight = note.substr(note.length-1);
		var transposed = note.replace(/[ABCDEFG#]+[-]*/g,function(str) {
			return Sheet.transposeLetterDown(str,noteHeight);
		});
		return Sheet.normalizedTransposedNotes(transposed);
	},
	//Törli a felesleges kötőjelet hangok végéről és a felesleges /n-t
	normalizedTransposedNotes: function(notes) {
		notes = notes.replace(/\s\/[0-9]/g,"");
		notes = notes.replace(/^\/[0-9]\s/g,"");
		notes = notes.replace(/-\/[0-9]/g,function(str) {
			return str.substring(1,str.length);
		});
		return notes;
	},
	//Feltranszponál egy G#- formájú hangot
	transposeLetterUp: function(letter,height) {
		var note = letter.substr(0,1);
		var dash = "";
		if(letter.indexOf("-") > -1) {
			dash = "-";
		}
		if(letter.indexOf("#") > -1) {
			if(Sheet.hasHalfNoteUp(note)) {
				return Sheet.subsequent(note)+dash;
			}
		}
		else {
			if(Sheet.hasHalfNoteUp(note)) {
				return note+"#"+dash;
			}
			else {
				if(note == Sheet.lastNoteUp) {
					return "/"+height+" "+Sheet.subsequent(note)+"/"+(parseInt(height)+1)+" ";
				}
				else {
					return Sheet.subsequent(note)+dash;
				}
			}
		}
	},
	//Letranszponál egy G#- formájú hangot
	transposeLetterDown: function(letter,height) {
		var note = letter.substr(0,1);
		var dash = "";
		if(letter.indexOf("-") > -1) {
			dash = "-";
		}
		if(letter.indexOf("#") > -1) {
			return note+dash;
		}
		else {
			if(Sheet.hasHalfNoteDown(note)) {
				return Sheet.preceding(note)+"#"+dash;
			}
			else {
				if(note == Sheet.lastNoteDown) {
					return "/"+height+" "+Sheet.preceding(note)+"/"+(parseInt(height)-1)+" ";
				}
				else {
					return Sheet.preceding(note)+dash;
				}
			}
		}
	},
	//Visszaadja a hang rákövetkező hangját félhangok figyelmen kívül hagyásával
	subsequent: function(letter) {
		if(letter == "C") return "D";
		if(letter == "D") return "E";
		if(letter == "E") return "F";
		if(letter == "F") return "G";
		if(letter == "G") return "A";
		if(letter == "A") return "B";
		if(letter == "B") return "C";
		if(letter == "H") return "C";
		else return "";
	},
	//Visszaadja a hang megelőző hangját félhangok figyelmen kívül hagyásával
	preceding: function(letter) {
		if(letter == "D") return "C";
		if(letter == "E") return "D";
		if(letter == "F") return "E";
		if(letter == "G") return "F";
		if(letter == "A") return "G";
		if(letter == "B") return "A";
		if(letter == "H") return "A";
		if(letter == "C") return "B";
		else return "";
	},
	//Igaz, ha félhang lépés van felfele
	hasHalfNoteUp: function(note) {
		if(note == "C" || note == "D" || note == "F" || note == "G" || note == "A") {
			return true;
		}
		else return false;
	},
	//Igaz, ha félhang lépés van lefele
	hasHalfNoteDown: function(note) {
		if(note == "B" || note == "A" || note == "G" || note == "E" || note == "D" || note == "H") {
			return true;
		}
		else return false;
	},
	lastNoteUp: "B",
	lastNoteDown: "C",

	SheetCordTransposing: {
		replaceEveryChord: function(replaceFunction) {
			Sheet.sheet = Sheet.sheet.replace(/text :.*/g,function(str) {
				str = str.replace(/[ABCDEFGH]#?((.*?(?=,))|(.+?$))/g,function(chord) {
					chord = replaceFunction(chord);
					return chord;
				});
				return str;
			});
		},
		transposeUp: function() {
			Sheet.SheetCordTransposing.replaceEveryChord(Sheet.ChordTransposing.raiseChord);
		},
		transposeDown: function() {
			Sheet.SheetCordTransposing.replaceEveryChord(Sheet.ChordTransposing.decreaseChord);
		}
	},
	ChordTransposing: {
		raiseChord: function(chord) {
			if(chord.indexOf("#") != -1) {
				var letter = chord.substr(0,1);
				return Sheet.subsequent(letter)+chord.substr(2,chord.length-1);
			}
			else {
				var letter = chord.substr(0,1);
				if(Sheet.hasHalfNoteUp(letter)) {
					return letter+"#"+chord.substr(1,chord.length-1);
				}
				else {
					return Sheet.subsequent(letter)+chord.substr(1,chord.length-1);
				}
			}
		},
		decreaseChord: function(chord) {
			if(chord.indexOf("#") != -1) {
				var letter = chord.substr(0,1);
				return letter+chord.substr(2,chord.length-1);
			}
			else {
				var letter = chord.substr(0,1);
				if(Sheet.hasHalfNoteDown(letter)) {
					return Sheet.preceding(letter)+"#"+chord.substr(1,chord.length-1);
				}
				else {
					return Sheet.preceding(letter)+chord.substr(1,chord.length-1);
				}
			}
		},
	},
	AutomaticMatching: {
		startAutomaticMatching: function() {
			var invertBack = false;
			if(Sheet.inverted) {
				Sheet.invert();
				invertBack = true;
			}
			//eltünteti a sávokat
			Song.mouseStopped();
			//letörli a margót
			$("div.js-note-root").css("left","0px");
			$("div.js-note-root").css("margin-top","0px");
			//Beállítja a megfelelő magasságot
			var preferredScale = Sheet.AutomaticMatching.getPreferredScale();
			Sheet.setScale(preferredScale);
			Sheet.setWidth(window.innerWidth / preferredScale);
			Sheet.refresh();
			if(invertBack) { Sheet.invert(); }
			//Sheet.refreshForInverted();
		},
		getPreferredScale: function() {
			Sheet.setScale("1.0");
			Sheet.refresh();
			var actualSheetHeight = $(".vex-canvas").height();
			var preferredScale = window.innerHeight / actualSheetHeight;
			return preferredScale;
		}
	}
};