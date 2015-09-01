var SongbookCard = {
	cards:[],
	getCardById: function(id) {
		var retitem = undefined;
		SongbookCard.cards.map(function(item) {
			if(parseInt(item.id) == parseInt(id)) {
	    		retitem = item;
	    	}
		});
		return retitem;
	},
	addCard: function(id_, userid_, title_, public_, username_, permissions_, permissionName_, songNumber_) {
		SongbookCard.cards.push({
			id: id_,
			userid:userid_,
			title:title_,
			public:public_,
			username:username_,
			permissions:permissions_,
			permissionName:permissionName_,
			songNumber:songNumber_
		});
	},
	createCardCollection: function() {
		$(".js-page").html('<div class="songbooks-root js-songbooks-root"></div>');
	},
	drawCards: function() {


		if($('.js-songbooks-root').html() == undefined) {
			SongCard.createCardCollection();
		}
		//elemek beszúrása
		$('.js-songbooks-root').html("");
		SongbookCard.cards.map(function(item) {
	    	if($('#'+item.id+'.js-songbook-card').length == 0) {
		        $('.js-songbooks-root').append(SongbookCard.cardHtml(item.id,item.userid,item.title,item.public,item.username,item.permissions, item.permissionName, item.songNumber));
	    	}
		});
		jQuery('.tooltipped').tooltip({delay: 50});
	},
	cardHtml: function(id,userid,title,public,username,permissions,permissionName,songNumber) {
		var textsHTML = "";

		/*var labelsHTML = "";
		if(labels != "") {
			labels.map(function(item) {
				labelsHTML = labelsHTML + '<span class="waves-effect waves-light btn song-label js-song-label text-orange">#' + item +'</span>';
			});
		}*/
		var permissionsHTML = "";
		if(permissions != []) {
			if(permissions.indexOf(Permissions.SongbookOperation.Rename) != -1) {
				permissionsHTML = permissionsHTML + 
				'<span class="waves-effect waves-light btn-floating btn-large song-button activator tooltipped" data-position="bottom" data-delay="0" data-tooltip="' + Config.rename + '">' +
	            	'<i class="material-icons">mode_edit</i>' +
	        	'</span>';
			}
			if(permissions.indexOf(Permissions.SongbookOperation.Delete) != -1) {
				permissionsHTML = permissionsHTML + 
				'<span class="waves-effect waves-light btn-floating btn-large song-button activator tooltipped" data-position="bottom" data-delay="0" data-tooltip="' + Config.delete + '">' +
	            	'<i class="material-icons">delete</i>' +
	        	'</span>';
			}
			if(permissions.indexOf(Permissions.SongbookOperation.Share) != -1) {
				permissionsHTML = permissionsHTML + 
				'<span class="waves-effect waves-light btn-floating btn-large song-button activator tooltipped" data-position="bottom" data-delay="0" data-tooltip="' + Config.share + '">' +
	            	'<i class="material-icons">share</i>' +
	        	'</span>';
			}
			if(permissions.indexOf(Permissions.SongbookOperation.Download) != -1) {
				permissionsHTML = permissionsHTML + 
				'<span class="waves-effect waves-light btn-floating btn-large song-button activator tooltipped" data-position="bottom" data-delay="0" data-tooltip="' + Config.download + '">' +
	            	'<i class="material-icons">get_app</i>' +
	        	'</span>';
			}
		}	
		var permissionNameHTML = "";
		if(permissionName == Permissions.Songbook.User) {
			permissionNameHTML = Config.User;
		}
		else if(permissionName == Permissions.Songbook.Owner) {
			permissionNameHTML = Config.Owner;
		}
		else if(permissionName == Permissions.Songbook.Shared) {
			permissionNameHTML = Config.Shared;
		}
		else if(permissionName == Permissions.Songbook.Admin) {
			permissionNameHTML = Config.Admin;
		}
		var html = 
		'<div class="card songbook-card js-songbook-card" id="' + id +'">\n' +
			'<div class="card-content waves-effect waves-dark">\n' +
				'<span class="card-title black-text">' + title + '</span>\n' + 
				'<div class="card-owner">' + username + '</div>' +
				'<p>' + songNumber + ' ' + Config.songs + '</p>' +
			'</div>\n' +
    		'<div class="card-action">\n' +
    			'<table>\n' +
    				'<tr>\n' +
    					'<td class="no-padding">\n' +
    						'<span class="songbook-permission text-orange btn">' +
				        		permissionNameHTML +
        					'</span>' +
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