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
			    console.log(result[i]);
				request.onsuccess = function(event) {
					console.log(event);
				};
				request.onerror = function(event) {
					console.log("error");
				};
			    
			}	
		});
	},
	refreshDatabase: function() {
		Downloader.downloadSongs(function(result) {
			var transaction = Database.db.transaction([Database.db_table_name], "readwrite");
			transaction.oncomplete = function(event) {
				//console.log("All done!");
			};

			transaction.onerror = function(event) {
				// Don't forget to handle errors!
			};
			var objectStore = transaction.objectStore(Database.db_table_name);
			var getter = function(id) {
				var request = objectStore.get(result[id].id);
				request.onsuccess = function(event) {
					//nincs még benne
					if(request.result == undefined) {
						var addRequest = objectStore.add(result[id]);
						addRequest.onsuccess = function(event) {
							if(id < result.length-1) {
								getter(id+1);
							}
						};
					}
					else {
						if(id < result.length-1) {
							getter(id+1);
						}
					}
				};
			};
			getter(0);
		});
		Settings.Save.updateHtml();
	},
	openDatabase: function() {
		var request = indexedDB.open(Database.db_name);
		request.onerror = function(event) {	};
		request.onsuccess = function(event) {
			Database.db = event.target.result;
			if(Database.isDatabaseCreated()) {
				Database.refreshDatabase();
			}
			
		};
		request.onupgradeneeded = function(event) { 
			var db = event.target.result;
			var objectStore = db.createObjectStore(Database.db_table_name, {keyPath: "id"});
			objectStore.createIndex("title", "title", { unique: false });
			objectStore.createIndex("labels", "labels", { unique: false });
			db.createObjectStore(Settings.Save.db_table_name, {keyPath: "id"});

			objectStore.transaction.oncomplete = function(event) {
				Database.firstTimeWhenServerAvailable();
			};
		};
	},
	isDatabaseCreated: function() {
		if($.inArray(Database.db_table_name,Database.db.objectStoreNames) < 0) {
			return false;
		}
		else {
			return true;
		}
	},
	firstTimeWhenServerAvailable: function() {
		//ha van szerver, akkor továbbmegyek
		Server.callWhenServerAvailable(function() {
			Database.firstTime();
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
	//Megj: csak a legfrissebb verziójú énekeket adja vissza
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
				Database.checkIfAllNewest(resultArray,result);
				//result(resultArray);
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
					var labels = Database.toLowerAll(cursor.value.labels);
					if (labels.indexOf(label.toLowerCase()) !== -1) {  
						resultArray.push(cursor.value.id);
					}
				}
				cursor.continue();
			}
			else {
				Database.checkIfAllNewest(resultArray,result);
				//result(resultArray);
			}
		};
	},
	checkIfAllNewest: function(array,resultFunction) {
		var onlyNewResultArray = [];
		checker = function(id) {
			if(id < array.length) {
				Database.isNewestSong(array[id],function(is) {
					if(is) {
						onlyNewResultArray.push(array[id]);
					}
					checker(id+1);
				});
			}
			else {
				resultFunction(onlyNewResultArray);
			}
		};

		checker(0);

	},
	isNewestSong: function(songid,result) {
		Database.getById(songid,function(song) {
			var version_thread = song.oldest_version;
			var version = song.version;

			var transaction = Database.db.transaction([Database.db_table_name]);
			var objectStore = transaction.objectStore(Database.db_table_name);
			var request = objectStore.openCursor();
			var highestVersion = 0;
			request.onsuccess = function(event) {
				var cursor = event.target.result;
				if(cursor) {
					if(cursor.value.oldest_version == version_thread && cursor.value.version > highestVersion) {
						highestVersion = cursor.value.version;
					}
					cursor.continue();
				}
				else {
					result(highestVersion == version);
				}
			};
		});
	},
	toLowerAll: function(array) {
		for (var i = 0; i < array.length; i++) {
			array[i] = array[i].toLowerCase();
		};
		return array;
	},
	test: function() {
		Database.getById(4,function(result) {
			console.log(result);
		});
		//return 0;
	}
};