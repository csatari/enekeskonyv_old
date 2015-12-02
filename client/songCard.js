$(function(){
	/*jQuery('.js-song-card-collection').masonry({
	    itemSelector: '.js-song-card',
	    columnWidth: 200
	});*/
	$(document).on('click','.song-label',function(){
		Search.addWordToSearchbar($(this).text());
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
	},
	addCard: function(id_, title_, text_, labels_) {
		SongCard.cards.push({
			id: id_,
			title:title_,
			text:text_,
			labels:labels_
		});
	},
	drawCards: function() {


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
		        $('.js-song-card-collection').append(SongCard.cardHtml(item.id,item.title,item.text,item.labels));
	    	}
		});
		jQuery('.tooltipped').tooltip({delay: 50});

	},
	cardHtml: function(id,title,text,labels) {
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
		var html = 
		'<div class="card song-card js-song-card" id="' + id +'">\n' +
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
        			'</tr>\n' +
        		'</table>\n' +
    		'</div>\n' +
		'</div>';
		return html;
	}
};