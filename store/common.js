var Common = {
	setInputValue: function(inputElement, value) {
		$(inputElement).val(value);
		if(value != "") {
			$(inputElement).siblings("label").addClass("active");
		}
		else {
			$(inputElement).siblings("label").removeClass("active");
		}
	}	
};
var Permissions = {
	SongOperation : {
		Create:1,
		Edit:2,
		EditRequest:3,
		Delete:4,
		DeleteRequest:5,
		Fork:6,
		AcceptRequest:7
	},
	SongbookOperation : {
		Create:1,
		Rename:2,
		Delete:3,
		Add:4,
		Browse:5,
		DeleteElement:6,
		Share:7,
		Download:8,
		Visibility:9
	},
	Songbook : {
    	User:1,
    	Owner:2,
    	Shared:3,
    	Admin:4
	}
};