var SongText = {
	accessor: "",
	titleAccessor: "",
	text: "",
	inverted:false,
	paragraphed:0,
	verse_mode:false,
	exit: function() {
		SongText.accessor = "";
		SongText.titleAccessor = "";
		SongText.text = "";
		SongText.inverted = false;
		SongText.paragraphed = 0;
		SongText.ChordTransposing.transpose_count = 0;
		$(".js-page").css("margin-left","60px");
		$(".js-page").css("margin-right","60px");
	},
	initialization: function() {
		SongText.paragraphed = 0;
		SongText.ChordTransposing.transpose_count = 0;
	},
	setAccessor: function(acc) {
		SongText.accessor = acc;
	},
	setTitleAccessor: function(acc) {
		SongText.titleAccessor = acc;
	},
	loadText: function(text) {
		SongText.text = text;
	},
	webizeSpaces: function(str) {
		return str.replace(/ /g,"&nbsp;");
	},
	webizeNewlines: function(str) {
		return str.replace(/\n/g,"</br>");
	},
	webizeVerses: function(str) {
		var counter = 0;
		str = str.replace(/(\[\/[rbv]\]).*?(\[[rbv]\])/g,function(s) {
			return "[/"+ s[2] + "]</br>["+ s[2] + "]"
		});
		return str.replace(/\[[rbv]\].*?(\[\/[rbv]\])/g,function(s) {
			var type = s[1];
			s = s.substr(3,s.length-7);
			counter++;
			return "<span class=\"js-song-verse "+ type +"\" id=\"" + counter + "\">" + s + "</span>";
		});
	},
	webizeChords: function(str) {
		str = str.replace(/\[a\].+?(\[\/a\])\<\/br\>/g,function(s) {
			return "<span class=\"js-chord-parent\">"+s+"</span>";
		});
		return str.replace(/\[a\].+?(\[\/a\])/g,function(s) {
			s = s.substr(3,s.length-7);
			s = s + " ";
			s = s.replace(/[ABCDEFGH]#?(.*?(&nbsp;))/g,function(chord) {
				if(chord.indexOf("#") != -1) {
					chord = chord.substr(0,chord.length-6);
					return "<span class=\"song-chord js-song-chord\">" + chord + "</span>&nbsp;";
				}
				else {
					return "<span class=\"song-chord js-song-chord\">" + chord + "</span>";
				}
			});
			return s;
		});
	},
	invert: function() {
		if(!SongText.inverted) {
			$(".js-song-chord").css("color","yellow");
            $("body").css("background","black");
            $(SongText.accessor).css("color","white");
			$(SongText.titleAccessor).css("color","white");
        }
        else {
        	$(".js-song-chord").css("color","rgb(33, 89, 214)");
            $("body").css("background","white");
            $(SongText.accessor).css("color","black");
            $(SongText.titleAccessor).css("color","black");
        }
        SongText.inverted = !SongText.inverted;
	},
	refresh: function() {
		var webized = SongText.webizeNewlines(SongText.text);
		webized = SongText.webizeSpaces(webized);
		if(!SongText.verse_mode) {
			webized = SongText.Paragraphing.webizeParagraphs(webized);
		}
		webized = SongText.webizeChords(webized);
		if(SongText.verse_mode) {
			webized = SongText.webizeVerses(webized);
		}
		webized = SongText.AutomaticMatching.deleteTags(webized,"rbva");
		
		
		$(SongText.accessor).html(webized);
		if(Song.goneByPresentation) {
			SongText.AutomaticMatching.setMaximumFontSize();
		}
		SongText.refreshTranspose();
	},
	refreshTranspose: function() {
		var tr_count = SongText.ChordTransposing.transpose_count;
		if(tr_count > 0) {
			for (var i = 0; i < tr_count; i++) {
				SongText.transposeUp();
			};

		}
		else if(tr_count < 0) {
			for (var i = 0; i < tr_count*(-1); i++) {
				SongText.transposeDown();
			};
		}
		SongText.ChordTransposing.transpose_count = tr_count;
	},
	transposeUp: function() {
		SongText.TextChordTransposing.replaceEveryChord(SongText.ChordTransposing.raiseChord);
		SongText.ChordTransposing.transpose_count++;
		if(SongText.ChordTransposing.transpose_count == 12) {
			SongText.ChordTransposing.transpose_count = 0;
		}
	},
	transposeDown: function() {
		SongText.TextChordTransposing.replaceEveryChord(SongText.ChordTransposing.decreaseChord);
		SongText.ChordTransposing.transpose_count--;
		if(SongText.ChordTransposing.transpose_count == -12) {
			SongText.ChordTransposing.transpose_count = 0;
		}
	},
	VerseMode: {
		showingVerse: 0,
		activeVerseAccessor:"",
		parentAccessor: "",
		center:0,
		before:0,
		after:0,
		verses:[],
		currentVerseIndex:0,
		animationInProgress:false,
		setVerses: function(verses) {
			Song.OptionButtons.toggleVerseMode(verses.length > 0);
			SongText.VerseMode.verses = verses;
		},
		startVerseMode: function() {
			if(SongText.VerseMode.verses.length == 0) {
				Index.showError(Config.noVerses);
				return;
			}
			SongText.VerseMode.initializeVerseMode();
			SongText.VerseMode.showingVerse = SongText.VerseMode.verses[0];
			$(".js-song-verse").css("display","none");
			SongText.VerseMode.setCenter(SongText.VerseMode.verses[0]);
			SongText.VerseMode.setBefore(SongText.VerseMode.verses[SongText.VerseMode.verses.length-1]);
			SongText.VerseMode.setAfter(SongText.VerseMode.verses[1]);
			//Song.enterPressed();
			SongText.AutomaticMatching.matchedElement = ".js-song-text";
			SongText.AutomaticMatching.setMaximumFontSize();
			Song.goneByPresentation = !Song.goneByPresentation;
			Song.mouseStopped(function() {
				SongText.VerseMode.automaticCenter();
				SongText.VerseMode.automaticBefore();
				SongText.VerseMode.automaticAfter();
			});
			SongText.VerseMode.setCenter(SongText.VerseMode.verses[0]);
			SongText.VerseMode.setBefore(SongText.VerseMode.verses[SongText.VerseMode.verses.length-1]);
			SongText.VerseMode.setAfter(SongText.VerseMode.verses[1]);
			SongText.VerseMode.setNew();
			SongText.VerseMode.setOld();
			$(".js-song-verse-before").css("display","none");
			
			SongText.VerseMode.currentVerseIndex = 0;
			if(SongText.inverted) {
				$(".js-song-chord").css("color","yellow");
			}
			SongText.ChordOptions.refresh();
		},
		startNext: function() {
			if(!SongText.VerseMode.animationInProgress) {
				SongText.VerseMode.animationInProgress = true;
				SongText.VerseMode.animationNext(function() {
					SongText.VerseMode.animationInProgress = false;
				});
			}
		},
		startPrevious: function() {
			if(!SongText.VerseMode.animationInProgress) {
				SongText.VerseMode.animationInProgress = true;
				SongText.VerseMode.animationPrevious(function() {
					SongText.VerseMode.animationInProgress = false;
				});
			}
		},
		exit: function() {
			SongText.paragraphed = 0;
			SongText.verse_mode = false;
			$(".js-song-verse").css("display","block");
			$(".js-song-verse-center-parent").remove();
			$(".js-song-verse-before-parent").remove();
			$(".js-song-verse-after-parent").remove();
			$(".js-song-verse-old-parent").remove();
			$(".js-song-verse-new-parent").remove();
			Song.goneByPresentation = !Song.goneByPresentation;
			Song.mouseMoved();
			SongText.AutomaticMatching.matchedElement = ".js-song-text";
			SongText.AutomaticMatching.setMaximumFontSize();

			/*Song.enterPressed();
			SongText.AutomaticMatching.startAutomaticMatching();*/
		},
		initializeVerseMode: function() {
			SongText.paragraphed = 0;
			SongText.verse_mode = true;
			SongText.VerseMode.showingVerse = 1;
			SongText.VerseMode.parentAccessor = ".js-song-text";
			SongText.refresh();
		},
		setCenter: function(id) {
			/*SongText.VerseMode.center = id;
			$(".js-song-verse#"+id).css("display","block");
			$(".js-song-verse#"+id).css("position","fixed");
			var centerPos = (window.innerHeight/2)-($(".js-song-verse#"+id).height()/2);
			$(".js-song-verse#"+id).css("top",centerPos+"px");
			$(".js-song-verse#"+id).css("transform","");*/

			if($(".js-song-verse-center").length == 0) {
				var h = $(SongText.VerseMode.parentAccessor).html();
				var html = "<span class=\"js-song-verse-center-parent\"><span class=\"js-song-verse-center\"></span></span>";
				$(SongText.VerseMode.parentAccessor).html(h+html);
			}
			$(".js-song-verse-center-parent").css("perspective","1200px");
			$(".js-song-verse-center-parent").css("position","absolute");
			$(".js-song-verse-center-parent").css("perspective-origin",($(".js-song-verse-center").width()/2)+"px 500px");
			$(".js-song-verse-center").html($(".js-song-verse#"+id).html());

			$(".js-song-verse-center").css("display","block");
			$(".js-song-verse-center").css("position","absolute");
			var centerPos = (window.innerHeight/2)-($(".js-song-verse-center").height()/2);
			$(".js-song-verse-center-parent").css("top",centerPos+"px");
			$(".js-song-verse-center").css("transform","");
		},
		automaticCenter: function() {
			SongText.AutomaticMatching.matchedElement = ".js-song-verse-center";
			SongText.AutomaticMatching.setMaximumFontSize();
			var centerPos = (window.innerHeight/2)-($(".js-song-verse-center").height()/2);
			console.log("volt: "+$(".js-song-verse-center-parent").css("top")+", lesz: "+centerPos);
			$(".js-song-verse-center-parent").css("top",centerPos+"px");
			$(".js-song-verse-center-parent").css("perspective-origin",($(".js-song-verse-center").width()/2)+"px 500px");
		},
		setBefore: function(id) {
			SongText.VerseMode.before = id;
			if($(".js-song-verse-before").length == 0) {
				var h = $(SongText.VerseMode.parentAccessor).html();
				var html = "<span class=\"js-song-verse-before-parent\"><span class=\"js-song-verse-before\"></span></span>";
				$(SongText.VerseMode.parentAccessor).html(h+html);
			}
			$(".js-song-verse-before-parent").css("perspective","1200px");
			$(".js-song-verse-before-parent").css("position","absolute");
			$(".js-song-verse-before-parent").css("perspective-origin",($(".js-song-verse-before").width()/2)+"px 500px");
			$(".js-song-verse-before").html($(".js-song-verse#"+id).html());
			//$(".js-song-verse-before").css("background-color","bisque");
			$(".js-song-verse-before").css("position","fixed");
			//$(".js-song-verse-before").css("width",window.innerWidth+"px");
			var cpx = $(".js-song-verse-center-parent").css("top");
			var centeredTop = parseInt(cpx.substr(0,cpx.length-2));
			$(".js-song-verse-before-parent").css("top",-centeredTop+"px");
			$(".js-song-verse-before").css("transform","rotateX(40deg) scale(0.8,1)");
			$(".js-song-verse-before").css("transform-origin","bottom");
			$(".js-song-verse-before").css("opacity","0.7");
			/*$(".js-song-verse#"+id).css("display","block");
			$(".js-song-verse#"+id).css("position","absolute");
			var cpx = $(".js-song-verse#"+SongText.VerseMode.center).css("top");
			var centeredTop = parseInt(cpx.substr(0,cpx.length-2));
			var finalTop = $(".js-song-verse#"+id).height()-centeredTop-60;
			console.log("before: "+finalTop);
			$(".js-song-verse#"+id).css("top",finalTop+"px");
			$(SongText.VerseMode.parentAccessor).css("position","relative");
			$(SongText.VerseMode.parentAccessor).css("perspective","90em");
			$(".js-song-verse#"+id).css("transform","rotateX(35deg) scale(0.9, 0.6)");*/
		},
		automaticBefore: function() {
			SongText.AutomaticMatching.matchedElement = ".js-song-verse-before";
			SongText.AutomaticMatching.setMaximumFontSize();
			var cpx = $(".js-song-verse-center-parent").css("top");
			var centeredTop = parseInt(cpx.substr(0,cpx.length-2));
			$(".js-song-verse-before-parent").css("top",-centeredTop+"px");
			$(".js-song-verse-before-parent").css("perspective-origin",($(".js-song-verse-before").width()/2)+"px 500px");
		},
		setAfter: function(id) {
			SongText.VerseMode.after = id;
			if($(".js-song-verse-after").length == 0) {
				var h = $(SongText.VerseMode.parentAccessor).html();
				var html = "<span class=\"js-song-verse-after-parent\"><span class=\"js-song-verse-after\"></span></span>";
				$(SongText.VerseMode.parentAccessor).html(h+html);
			}
			$(".js-song-verse-after-parent").css("perspective","1200px");
			$(".js-song-verse-after-parent").css("position","fixed");
			$(".js-song-verse-after-parent").css("perspective-origin",($(".js-song-verse-after").width()/2)+"px 500px");
			$(".js-song-verse-after").html($(".js-song-verse#"+id).html());
			//$(".js-song-verse-before").css("background-color","bisque");
			$(".js-song-verse-after").css("position","fixed");
			//$(".js-song-verse-after").css("width",window.innerWidth+"px");
			var cpx = $(".js-song-verse-center-parent").css("top");
			var centeredBottom = parseInt(cpx.substr(0,cpx.length-2));
			var centeredTop = window.innerHeight-centeredBottom;
			$(".js-song-verse-after-parent").css("top",centeredTop+"px");
			$(".js-song-verse-after").css("transform","rotateX(-55deg) scale(0.8,1)");
			$(".js-song-verse-after").css("transform-origin","top");
			$(".js-song-verse-after-parent").css("opacity","0.7");
			/*$(".js-song-verse#"+id).css("display","block");
			$(".js-song-verse#"+id).css("position","absolute");
			var cpx = $(".js-song-verse#"+SongText.VerseMode.center).css("top");
			var centeredTop = parseInt(cpx.substr(0,cpx.length-2));
			var finalTop = ($(".js-song-verse#"+id).height()*(2/3))+centeredTop;
			console.log("after: "+finalTop);
			$(".js-song-verse#"+id).css("top",finalTop+"px");
			$(SongText.VerseMode.parentAccessor).css("position","relative");
			$(SongText.VerseMode.parentAccessor).css("perspective","90em");
			$(".js-song-verse#"+id).css("transform","rotateX(-30deg) scale(0.9, 0.6)");*/
		},
		automaticAfter: function() {
			SongText.AutomaticMatching.matchedElement = ".js-song-verse-after";
			SongText.AutomaticMatching.setMaximumFontSize();
			var cpx = $(".js-song-verse-center-parent").css("top");
			var centeredBottom = parseInt(cpx.substr(0,cpx.length-2));
			var centeredTop = window.innerHeight-centeredBottom;
			$(".js-song-verse-after-parent").css("top",centeredTop+"px");
			$(".js-song-verse-after-parent").css("perspective-origin",($(".js-song-verse-after").width()/2)+"px 500px");
		},
		//After után van
		setNew: function() {
			if($(".js-song-verse-new").length == 0) {
				var h = $(SongText.VerseMode.parentAccessor).html();
				var html = "<span class=\"js-song-verse-new-parent\"><span class=\"js-song-verse-new\"></span></span>";
				$(SongText.VerseMode.parentAccessor).html(h+html);
			}
			$(".js-song-verse-new-parent").css("perspective","1200px");
			$(".js-song-verse-new-parent").css("position","fixed");
			//$(".js-song-verse-before").css("background-color","bisque");
			$(".js-song-verse-new").css("position","fixed");
			//$(".js-song-verse-new").css("width",window.innerWidth+"px");
			$(".js-song-verse-new-parent").css("top",(window.innerHeight+100)+"px");
			$(".js-song-verse-new").css("transform","rotateX(-55deg) scale(0.8,1)");
			$(".js-song-verse-new").css("transform-origin","top");
			$(".js-song-verse-new-parent").css("opacity","0.7");

			
		},
		//Before előtt van
		setOld: function() {
			if($(".js-song-verse-old").length == 0) {
				var h = $(SongText.VerseMode.parentAccessor).html();
				var html = "<span class=\"js-song-verse-old-parent\"><span class=\"js-song-verse-old\"></span></span>";
				$(SongText.VerseMode.parentAccessor).html(h+html);
			}
			$(".js-song-verse-old-parent").css("perspective","1200px");
			$(".js-song-verse-old-parent").css("position","fixed");
			$(".js-song-verse-old").css("position","fixed");
			//$(".js-song-verse-old").css("width",window.innerWidth+"px");
			$(".js-song-verse-old-parent").css("top",(-(1.5*window.innerHeight))+"px");
			$(".js-song-verse-old").css("transform","rotateX(40deg) scale(0.8,1)");
			$(".js-song-verse-old").css("transform-origin","bottom");
			$(".js-song-verse-old-parent").css("opacity","0.7");

			
		},
		refreshNew: function() {
			SongText.AutomaticMatching.matchedElement = ".js-song-verse-new";
			SongText.AutomaticMatching.setMaximumFontSize();
			$(".js-song-verse-new-parent").css("perspective-origin",($(".js-song-verse-new").width()/2)+"px 500px");
			
		},
		refreshOld: function() {
			SongText.AutomaticMatching.matchedElement = ".js-song-verse-old";
			SongText.AutomaticMatching.setMaximumFontSize();
			$(".js-song-verse-old-parent").css("perspective-origin",($(".js-song-verse-old").width()/2)+"px 500px");
		},
		test:function(egy,ketto,harom) {
			SongText.VerseMode.initializeVerseMode();
			SongText.VerseMode.showingVerse = egy;
			$(".js-song-verse").css("display","none");
			SongText.VerseMode.setCenter(egy);
			SongText.VerseMode.setBefore(ketto);
			SongText.VerseMode.setAfter(harom);
			Song.enterPressed();
			SongText.VerseMode.setCenter(egy);
			SongText.VerseMode.setBefore(ketto);
			SongText.VerseMode.setAfter(harom);
		},
		animationNext: function(endFunction) {
			//Ha nincs after, akkor nem lehet továbbmenni
			if($(".js-song-verse-after").text().length == 0) {
				endFunction();
				return;
			}
			//center -> before
			//after -> center

			end = function() {
				$(".js-song-verse-before").css("display","block");
				//before,center,after beállítása
				//before törlése
				$(".js-song-verse-before-parent").remove();

				//center átírása before-ra
				$(".js-song-verse-center-parent").attr('class', 'js-song-verse-before-parent');
				$(".js-song-verse-center").attr('class', 'js-song-verse-before');
				//after átírása center-re
				$(".js-song-verse-after-parent").attr('class', 'js-song-verse-center-parent');
				$(".js-song-verse-after").attr('class', 'js-song-verse-center');

				//new átírása after-ra
				$(".js-song-verse-new-parent").attr('class', 'js-song-verse-after-parent');
				$(".js-song-verse-new").attr('class', 'js-song-verse-after');

				SongText.VerseMode.setNew();

				SongText.VerseMode.currentVerseIndex++;

				endFunction();
			};
			$(".js-song-verse-center").css("transform-origin","bottom");

			var centerTop = ((window.innerHeight/2)-($(".js-song-verse-after").height()/2));
			var beforeTop = centerTop-$(".js-song-verse-center").height();
			var afterTop = window.innerHeight-centerTop;

			$(".js-song-verse-center-parent").css("border-spacing","0px");
			var oldBeforeTop = -($(".js-song-verse-before").height()*1.5);
			$(".js-song-verse-before-parent").animate({
				top: oldBeforeTop+"px"
			}, 1000);

			scaleLinearFunction = function(x) {
				return (-0.005)*x+1;
			};
			secondScaleLinearFunction = function(x) {
				return (0.005)*x+0.8;
			};
			rotateLinearFuntion = function(x) {
				return (11/8)*x-55;
			};
			$(".js-song-verse-center-parent").animate({
				top: beforeTop,
				opacity: 0.7,
				borderSpacing: 40,
			}, {step: function(now,fx) {
				$(".js-song-verse-center").css('transform','rotateX('+now+'deg) scale('+scaleLinearFunction(now)+ ' ,1.0)');  
				$(".js-song-verse-after").css('transform','rotateX('+rotateLinearFuntion(now)+'deg) scale('+secondScaleLinearFunction(now)+ ' ,1.0)');  
			}, 
			duration:1000});

			//$(".js-song-verse-after-parent").css("border-spacing","-55px");
			
			$(".js-song-verse-after-parent").animate({
				top: centerTop,
				opacity: 1.0
			},1000,function() {
				end();
			});
			if(SongText.VerseMode.verses[SongText.VerseMode.currentVerseIndex+2] != undefined) {
				var newVerse = $(".js-song-verse#"+SongText.VerseMode.verses[SongText.VerseMode.currentVerseIndex+2]).html();
				$(".js-song-verse-new").html(newVerse);
				SongText.VerseMode.refreshNew();

				$(".js-song-verse-new-parent").animate({
					top: afterTop
				},1000);

			}
			
		},
		animationPrevious: function(endFunction) {
			//Ha nincs before, akkor nem lehet továbbmenni
			if($(".js-song-verse-before").text().length == 0 || $(".js-song-verse-before").css("display") == "none") {
				endFunction();
				return;
			}

			//before -> center
			//center -> after

			end = function() {
				$(".js-song-verse-after").css("display","block");
				//before,center,after beállítása
				//after törlése
				$(".js-song-verse-after-parent").remove();

				//center átírása after-ra
				$(".js-song-verse-center-parent").attr('class', 'js-song-verse-after-parent');
				$(".js-song-verse-center").attr('class', 'js-song-verse-after');
				//before átírása center-re
				$(".js-song-verse-before-parent").attr('class', 'js-song-verse-center-parent');
				$(".js-song-verse-before").attr('class', 'js-song-verse-center');

				//old átírása before-ra
				$(".js-song-verse-old-parent").attr('class', 'js-song-verse-before-parent');
				$(".js-song-verse-old").attr('class', 'js-song-verse-before');

				SongText.VerseMode.setOld();

				SongText.VerseMode.currentVerseIndex--;

				endFunction();
			};
			var centerTop = ((window.innerHeight/2)-($(".js-song-verse-before").height()/2));
			var afterTop = window.innerHeight-centerTop;
			var beforeTop = 0;
			if(SongText.VerseMode.verses[SongText.VerseMode.currentVerseIndex-2] != undefined) {
				var newVerse = $(".js-song-verse#"+SongText.VerseMode.verses[SongText.VerseMode.currentVerseIndex-2]).html();
				$(".js-song-verse-old").html(newVerse);
				SongText.VerseMode.refreshOld();

				var beforeTop = centerTop-$(".js-song-verse-old").height();
				$(".js-song-verse-old-parent").animate({
					top: beforeTop
				},1000);

			}
			else {
				beforeTop = -((window.innerHeight/2)-($(".js-song-verse-before").height()/2));
			}

			$(".js-song-verse-center").css("transform-origin","top");

			/*var beforeTop = -((window.innerHeight/2)-($(".js-song-verse-before").height()/2));
			var centerTop = -beforeTop;
			var afterTop = window.innerHeight-centerTop;*/
			
			
			

			$(".js-song-verse-after-parent").animate({
				top: window.innerHeight
			}, 1000);


			scaleLinearFunction = function(x) {
				return (-0.005)*x+1;
			};
			secondScaleLinearFunction = function(x) {
				return (0.005)*x+0.8;
			};
			rotateLinearFuntion = function(x) {
				return (11/8)*x-55;
			};


			$(".js-song-verse-before-parent").css("border-spacing","40px"); 
			$(".js-song-verse-before-parent").animate({
				top: centerTop,
				opacity: 1.0,
				borderSpacing: 0
			}, {step: function(now,fx) {
				$(".js-song-verse-before").
					css('transform','rotateX('+now+'deg) scale('+scaleLinearFunction(now)+ ' ,1.0)');  
				$(".js-song-verse-center").
					css('transform','rotateX('+rotateLinearFuntion(now)+'deg) scale('+secondScaleLinearFunction(now)+ ' ,1.0)');
			}, 
			duration:1000});

			$(".js-song-verse-center-parent").animate({
				top: afterTop,
				opacity: 0.7
			},1000,function() {
				end();
			});

			
		}
	},
	TextChordTransposing: {
		replaceEveryChord: function(replaceFunction) {
			$(".js-song-chord").each(function(i,e) {
				var chord = $(this).html();
				console.log(chord);
				chord = replaceFunction(chord);
				$(this).html(chord);
			});
		},
		deleteChordLines: function(str) {
			return str.replace(/(\[a\]).*?(\[\/a\])/g,"");
		},
		deleteEmptyLines: function(str) {
			str = str.replace(/^\n/g,"");
			return str.replace(/\n\s*\n/g,"\n");
		}
	},
	ChordTransposing: {
		transpose_count: 0,
		//Ha nincs benne # akkor van a végén egy &nbsp;
		raiseChord: function(chord) {
			if(chord.indexOf("#") != -1) {
				var letter = chord.substr(0,1);
				return SongText.ChordTransposing.subsequent(letter)+chord.substr(2,chord.length-1)+"&nbsp;";
			}
			else {
				var letter = chord.substr(0,1);
				if(Sheet.hasHalfNoteUp(letter)) {
					return letter+"#"+chord.substr(1,chord.length-7);
				}
				else {
					return SongText.ChordTransposing.subsequent(letter)+chord.substr(1,chord.length-1);
				}
			}
		},
		//Ha nincs benne # akkor van a végén egy &nbsp;
		decreaseChord: function(chord) {
			if(chord.indexOf("#") != -1) {
				var letter = chord.substr(0,1);
				return letter+chord.substr(2,chord.length-1)+"&nbsp;";
			}
			else {
				var letter = chord.substr(0,1);
				if(Sheet.hasHalfNoteDown(letter)) {
					console.log(letter + " " + Sheet.preceding(letter) + " " + chord.substr(1,chord.length-7));
					return Sheet.preceding(letter)+"#"+chord.substr(1,chord.length-7);
				}
				else {
					return Sheet.preceding(letter)+chord.substr(1,chord.length-1);
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
		}
	},
	AutomaticMatching: {
		matchedElement: "",
		startAutomaticMatching: function() {
			//eltünteti a sávokat
			Song.mouseStopped();
			SongText.AutomaticMatching.matchedElement = ".js-song-text";
			SongText.AutomaticMatching.setMaximumFontSize();
		},
		setMaximumFontSize: function() {
			$(".js-page").css("margin","0px 10px");

			$(SongText.AutomaticMatching.matchedElement).css("position","fixed");
			$(SongText.AutomaticMatching.matchedElement).css("font-size","100%");

			var szeles = $(".js-page").width() / SongText.AutomaticMatching.getWidth();
			var magas = window.innerHeight / $(SongText.AutomaticMatching.matchedElement).height();

			var size = 0;
			if(szeles < magas) {
				size = szeles*100;
			}
			else {
				size = magas*100;
			}
			//size -= 3;
			$(SongText.AutomaticMatching.matchedElement).css("font-size",size+"%");

			//apró simítások - addig csökkent, amíg benne nem lesz a képernyőben
			while(SongText.AutomaticMatching.getWidth() > $(".js-page").width() || $(SongText.AutomaticMatching.matchedElement).height() > window.innerHeight) {
				size--;
				$(SongText.AutomaticMatching.matchedElement).css("font-size",size+"%");
			};
			
			$(".js-song-text").css("position","absolute");
		},
		getWidth: function() {
			if(SongText.verse_mode) {
				/*if($(".js-song-text").width() == 0) {
					return $(".js-song-verse#"+SongText.VerseMode.showingVerse).width();
				}*/
				return $(SongText.AutomaticMatching.matchedElement).width();
			}
			else {
				return $(".js-first-paragraph").width()+$(".js-second-paragraph").width();
			}
		},

		deleteTags: function(str,tags) {
			var regex = new RegExp("((\\\[["+tags+"]\])|(\\\[\\\/["+tags+"]\]))","g");
			return str.replace(regex,"");
			//return str.replace(/((\[[v]\])|(\[\/[v]\]))/g,"");
		}
	},
	Paragraphing: {
		first: "",
		second: "",
		initialization: function(str) {
			SongText.Paragraphing.first = str;
		},
		moveOverLine: function() {
			if(SongText.Paragraphing.countLines(SongText.text)-1 >= SongText.paragraphed) {
				SongText.paragraphed++;
			}
		},
		putBackLine: function() {
			if(SongText.paragraphed > 0) {
				SongText.paragraphed--;
			}
		},
		webizeParagraphs: function(str) {
			var strArray = str.split("</br>");
			SongText.Paragraphing.first = "";
			SongText.Paragraphing.second = "";

			for (var i = 0; i < strArray.length-SongText.paragraphed; i++) {
				SongText.Paragraphing.first += strArray[i] + "</br>";
			};
			for (var i = strArray.length-SongText.paragraphed; i < strArray.length; i++) {
				SongText.Paragraphing.second += strArray[i] + "</br>";
			};

			return "<span class=\"first-paragraph js-first-paragraph\">" + 
					SongText.Paragraphing.first + "</span>"+
					"<span class=\"second-paragraph js-second-paragraph\">" +
					SongText.Paragraphing.second +
					"</span>"; 
		},
		countLines: function(str) {
			return str.split("\n").length;
		}
	},
	ChordOptions: {
		shown:true,
		toggleChords: function() {
			if(SongText.ChordOptions.shown) {
				$(".js-chord-parent").css("display","none");
			}
			else {
				$(".js-chord-parent").css("display","block");
			}
			SongText.ChordOptions.shown = !SongText.ChordOptions.shown;
		},
		refresh: function() {
			if(SongText.ChordOptions.shown) {
				$(".js-chord-parent").css("display","block");
			}
			else {
				$(".js-chord-parent").css("display","none");
			}
		}
	}
};