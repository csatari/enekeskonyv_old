$(function(){
	$("#invertedCanvas").css('visibility','collapse');
	$("#invertedCanvas").css('height','0');
});

var Sheet = {
	sheet:"",
	inverted:false,
	refresh: function() {
		var tabdiv = new Vex.Flow.TabDiv("div.vex-tabdiv"); 
		tabdiv.code = Sheet.sheet; 
		tabdiv.redraw(); 
		$(".editor").val(Sheet.sheet);
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
		Sheet.refresh();
	},
	setWidth: function(width) {
		var reWidth = /width=[0-9]*/;
		var reOptions = /options/;
		if(reWidth.test(Sheet.sheet)) {
			Sheet.sheet = Sheet.sheet.replace(reWidth,"width="+width);
		}
		else {
			Sheet.sheet = Sheet.sheet.replace(reOptions,"options width="+width);
		}
		Sheet.refresh();
	},
	invert: function() {
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
		});
		
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
	}
};