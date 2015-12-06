var Fab = {
	visibility:false,
	toggleVisibility: function(visible) {
		if(visible) {
			$( "div.js-fab" ).animate({
				bottom: "24px"
			}, 500, function() {
				// Animation complete.
			});
			Fab.visibility = true;
		}
		else {
			$( "div.js-fab" ).animate({
				bottom: "-60px"
			}, 500, function() {
				// Animation complete.
			});
			Fab.visibility = false;
		}
	}	
};