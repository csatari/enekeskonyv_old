var testdb = {};
testdb.db = null;
testdb.counter = 0;
testdb.open = function() {
	var version = 1;
	var request = indexedDB.open("teszteles",version);
	
	request.onupgradeneeded = function(e) {
		var db = e.target.result;
		e.target.transaction.onerror = testdb.onerror;

		if(db.objectStoreNames.contains("tabla")) {
		  db.deleteObjectStore("tabla");
		}

		var store = db.createObjectStore("tabla",
		  {keyPath: "id"});
	};
	request.onsuccess = function(e) {
		testdb.db = e.target.result;
		console.log("success!");
		testdb.addElem("ez egy szöveg?");
		testdb.addElem("igen ,ez szöveg");
		testdb.addElem("igen ,ez szöveg2");
		testdb.addElem("igen ,ez szöveg3");
		testdb.addElem("igen ,ez szöveg4");
		testdb.addElem("igen ,ez szöveg5");
	};
	
	request.onerror = testdb.onerror;
};

testdb.addElem = function(elemSzoveg) {
	var db = testdb.db;
	console.log("db: "+db);
	var trans = db.transaction(["tabla"],"readwrite");
	var store = trans.objectStore("tabla");
	
	var data = {
		"szoveg": elemSzoveg,
		"id": testdb.counter
	};
	
	var request = store.put(data);
	testdb.counter++;
	request.onsuccess = function(e) {
		console.log("belerakva..."+testdb.counter);
		
	};
	
	request.onerror = function(e) {
		console.log("error a hozzáadásnál",e);
	}
};

//window.addEventListener("DOMContentLoaded",init,false);

testdb.open();

