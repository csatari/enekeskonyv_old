$(function(){
	/*jQuery('.js-song-card-collection').masonry({
	    itemSelector: '.js-song-card',
	    columnWidth: 200
	});*/
	$(document).on('click','.song-label',function(){
		Search.addWordToSearchbar($(this).text());
	});
	$(document).on('click','.js-song-add-remove',function(){
		if(Footer.songbook.id != 0) {
			var id = $(this).parent().parent().attr("id");
			var in_songbook = $(this).attr("id");
			console.log(id+": add-remove " + in_songbook);
			if(in_songbook == 1) {
				SongbookData.removeSongFromSongbook(Login.getSessionId(),id,Footer.songbook.id,
					function() {
						SongCard.getCardById(id).in_songbook = 0;
						SongCard.drawCards();
						Footer.setSongNumber(Footer.songbook.songNumber-1);
					},function(){});
			}
			else {
				SongbookData.addSongToSongbook(Login.getSessionId(),id,Footer.songbook.id,
					function() {
						SongCard.getCardById(id).in_songbook = 1;
						SongCard.drawCards();
						Footer.setSongNumber(Footer.songbook.songNumber+1);
					},function(){});
			}
		}
	});
});

var SongCard = {
	cards:[],
	getCardById: function(id) {
		var retitem = undefined;
		SongCard.cards.map(function(item) {
			if(parseInt(item.id) == parseInt(id)) {
	    		retitem = item;
	    	}
		});
		return retitem;
	},
	createCardCollection: function() {
		$(".js-page").html('<div class="js-song-card-collection"></div>');
		/*jQuery('.js-song-card-collection').masonry({
		    itemSelector: '.js-song-card',
		    columnWidth: 200
		});*/
	},
	addCard: function(id_, title_, text_, labels_, permissions_, in_songbook_) {
		SongCard.cards.push({
			id: id_,
			title:title_,
			text:text_,
			labels:labels_,
			permissions:permissions_,
			in_songbook:in_songbook_
		});
	},
	drawCards: function() {
		//ha csak a sorrend történik, akkor át kell állítani a sorrendet, majd a következővel frissíteni:
		/*
				$grid.masonry('reloadItems')
				var $grid = jQuery('.js-song-card-collection').masonry({
					    itemSelector: '.js-song-card',
					    columnWidth: 200
					});
		*/

		/*Masonry-val együtt kirajzolás
		if($('.js-song-card-collection').html() == undefined) {
			SongCard.createCardCollection();
		}
		//kitörlöm a teljes tartalmat
		//$('.js-song-card-collection').html("");
		//nem szükséges elemek törlése
		$('.js-song-card').each(function(e) {
			var id = $(this).attr("id");
			//törölni kell ilyenkor
			if(SongCard.getCardById(id) == undefined) {
				$(this).remove();
				jQuery('.js-song-card-collection').masonry('remove', $(this));
			}
		});
		//új elemek beillesztése
		SongCard.cards.map(function(item) {
	    	if($('#'+item.id+'.js-song-card').length == 0) {
		        $('.js-song-card-collection').append(SongCard.cardHtml(item.id,item.title,item.text,item.labels));
		        jQuery('.js-song-card-collection').masonry('addItems',$('#'+item.id+'.js-song-card'));
	    	}
		});
		jQuery('.js-song-card-collection').masonry();*/


		if($('.js-song-card-collection').html() == undefined) {
			SongCard.createCardCollection();
		}
		//kell-e újra beszúrni a kártyákat?
		var needChange = false;
		var count = 0;
		$('.js-song-card').each(function(e) {
			var id = $(this).attr("id");
			if(SongCard.cards[count] == undefined) {
				needChange = true;
			}
			else {
				if(id != SongCard.cards[count].id) {
					needChange = true;
				}
			}
			count++;

		});
		//elemek beszúrása
		if(needChange) {
			$('.js-song-card-collection').html("");
		}

		$('.js-song-card-collection').html("");
		SongCard.cards.map(function(item) {
	    	if($('#'+item.id+'.js-song-card').length == 0) {
		        $('.js-song-card-collection').append(SongCard.cardHtml(item.id,item.title,item.text,
		        														item.labels,item.permissions, item.in_songbook));
	    	}
		});
		jQuery('.tooltipped').tooltip({delay: 50});

	},
	cardHtml: function(id,title,text,labels,permissions,in_songbook) {
		var textsHTML = "";
		var textSplit = text.split("\n");
		var textdotdotdot = "";
		if(textSplit.length > 4) {
			textdotdotdot = "...";
		}
		var counter = 0;
		textSplit.map(function(item) {
			if(counter < 4) {
				if(counter == 3) {
					textsHTML = textsHTML + '<p>' + item + textdotdotdot + '</p>';
				}
				else {
					textsHTML = textsHTML + '<p>' + item +'</p>';
				}
			}
			counter++;
			
		});
		var labelsHTML = "";
		if(labels != "") {
			labels.map(function(item) {
				labelsHTML = labelsHTML + '<span class="waves-effect waves-light btn song-label js-song-label text-orange">#' + item +'</span>';
			});
		}
		var permissionsHTML = "";
		if(permissions != []) {
			if(permissions.indexOf(Permissions.SongOperation.Edit) != -1) {
				permissionsHTML = permissionsHTML + 
				'<span class="waves-effect waves-light btn-floating btn-large song-settings-button activator tooltipped js-song-edit-button" data-position="bottom" data-delay="50" data-tooltip="' + Config.edit + '">' +
			    	'<i class="material-icons">mode_edit</i>' +
			    '</span>';
			}
			if(permissions.indexOf(Permissions.SongOperation.EditRequest) != -1) {
				permissionsHTML = permissionsHTML + 
				'<span class="waves-effect waves-light btn-floating btn-large song-settings-button activator tooltipped" data-position="bottom" data-delay="50" data-tooltip="' + Config.editRequest + '">' +
			    	'<i class="material-icons">mode_edit</i>' +
			    '</span>';
			}
			if(permissions.indexOf(Permissions.SongOperation.Delete) != -1) {
				permissionsHTML = permissionsHTML + 
				'<span class="waves-effect waves-light btn-floating btn-large song-settings-button activator tooltipped" data-position="bottom" data-delay="50" data-tooltip="' + Config.delete + '">' +
			    	'<i class="material-icons">delete</i>' +
			    '</span>';
			}
			if(permissions.indexOf(Permissions.SongOperation.DeleteRequest) != -1) {
				permissionsHTML = permissionsHTML + 
				'<span class="waves-effect waves-light btn-floating btn-large song-settings-button activator tooltipped" data-position="bottom" data-delay="50" data-tooltip="' + Config.deleteRequest + '">' +
			    	'<i class="material-icons">delete</i>' +
			    '</span>';
			}
			if(permissions.indexOf(Permissions.SongOperation.Fork) != -1) {
				permissionsHTML = permissionsHTML + 
				'<span class="waves-effect waves-light btn-floating btn-large song-settings-button activator tooltipped" data-position="bottom" data-delay="50" data-tooltip="' + Config.fork + '">' +
			    	'<i class="material-icons">call_split</i>' +
			    '</span>';
			}
		}
		var song_adder_iconHTML = "";
		if(in_songbook == 1) {
			song_adder_iconHTML = "remove";
		}
		else {
			song_adder_iconHTML = "add";
		}
		
		var song_adderHTML = "";
		if(Footer.visibility) {
			song_adderHTML = '<span class="song-songbook-adder">\n' +
				'<span class="waves-effect waves-light btn-floating btn-large song-songbook-adder-button js-song-add-remove" style="background-color: #4F6D7A;" id="' + in_songbook + '">\n' +
        			'<i class="material-icons">' + song_adder_iconHTML + '</i>\n' +
        		'</span>\n' +
			'</span>\n';
		}
		var html = 
		'<div class="card song-card js-song-card" id="' + id +'">\n' +
			song_adderHTML +
			'<div class="card-content waves-effect waves-dark">\n' +
				'<span class="card-title black-text">' + title + '</span>\n'
				 + textsHTML + 
			'</div>\n' +
    		'<div class="card-action">\n' +
    			'<table>\n' +
    				'<tr>\n' +
    					'<td class="no-padding">\n'
    						 + labelsHTML + 
    					'</td>\n' +
		        		'<td class="no-padding song-button-space">\n' +
		        			'<span class="waves-effect waves-light btn-floating btn-large song-button activator">\n' +
		            			'<i class="material-icons">settings</i>\n' +
		            		'</span>\n' +
        				'</td>\n' +
        			'</tr>\n' +
        		'</table>\n' +
    		'</div>\n' +
    		'<div class="card-reveal card-settings">' +
				'<span class="card-title grey-text text-darken-4">' +
					permissionsHTML + 
				'</span>' +
	        '</div>' +
		'</div>';
		return html;

	}
};