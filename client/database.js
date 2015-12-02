$(function() {
	if (!window.indexedDB) {
	    window.alert("Your browser doesn't support a stable version of IndexedDB.");
	}
	else {
		Database.openDatabase();
	}
});

var Database = {
	db: null,
	db_name: "SongbookDB",
	db_table_name: "song",
	firstTime: function() {
		Downloader.downloadSongs(function(result) {
			var objectStore = Database.db.createObjectStore(Database.db_table_name, {keyPath: "id"});
			objectStore.createIndex("title", "title", { unique: false });
			objectStore.createIndex("labels", "labels", { unique: false });

			objectStore.transaction.oncomplete = function(event) {
				var transaction = Database.db.transaction([Database.db_table_name], "readwrite");
				transaction.oncomplete = function(event) {
					//console.log("All done!");
				};

				transaction.onerror = function(event) {
					// Don't forget to handle errors!
				};
				var objectStore = transaction.objectStore(Database.db_table_name);
				for (var i = 0; i < result.length; i++) {
				    var labels_temp = [];
				    for(var j = 0; j < result[i].labels.length; j++) {
				    	labels_temp.push(result[i].labels[j].toLowerCase());
				    }
				    result[i].labels = labels_temp;
				    var request = objectStore.add(result[i]);
					request.onsuccess = function(event) {
						//console.log(event);
					};
				    
				}	
			}
		});
	},
	openDatabase: function() {
		console.log("openDatabase");
		var request = indexedDB.open(Database.db_name);
		request.onerror = function(event) {	};
		request.onsuccess = function(event) {
			Database.db = event.target.result;
			Database.refreshDatabase();
		};
	},
	refreshDatabase: function() {
		//ha van szerver, akkor továbbmegyek
		Server.callWhenServerAvailable(function() {
			console.log($.inArray(Database.db_table_name,Database.db.objectStoreNames));
			//ha nincs még adatbázis, akkor
			if($.inArray(Database.db_table_name,Database.db.objectStoreNames) < 0) {
				Database.firstTime();
			}
			else {
				console.log("már letöltöttem");
			}
			//ha már van adatbázis, akkor
		});
		

	},
	getById: function(id,result) {
		var transaction = Database.db.transaction([Database.db_table_name]);
		var objectStore = transaction.objectStore(Database.db_table_name);
		var request = objectStore.get(id);
		request.onerror = function(event) {
			// Handle errors!
		};
		request.onsuccess = function(event) {
			result(request.result);
		};
	},
	getByTitlePart: function(titlepart,result) {
		var transaction = Database.db.transaction([Database.db_table_name]);
		var objectStore = transaction.objectStore(Database.db_table_name);
		var request = objectStore.openCursor();
		var resultArray = [];
		request.onsuccess = function(event) {
			var cursor = event.target.result;
			if(cursor) {
				if (cursor.value.title.toLowerCase().indexOf(titlepart.toLowerCase()) !== -1) {  
					resultArray.push(cursor.value.id);
				}
				cursor.continue();
			}
			else {
				result(resultArray);
			}
		};
	},
	getByLabel: function(label,result) {
		var transaction = Database.db.transaction([Database.db_table_name]);
		var objectStore = transaction.objectStore(Database.db_table_name);
		var request = objectStore.openCursor();
		var resultArray = [];
		request.onsuccess = function(event) {
			var cursor = event.target.result;
			if(cursor) {
				if(cursor.value.labels != undefined) {
					if (cursor.value.labels.indexOf(label.toLowerCase()) !== -1) {  
						resultArray.push(cursor.value.id);
					}
				}
				cursor.continue();
			}
			else {
				result(resultArray);
			}
		};
	},
	test: function() {
		Database.getById(4,function(result) {
			console.log(result);
		});
		//return 0;
	}
};