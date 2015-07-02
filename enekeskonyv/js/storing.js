/**
 * Created by Albert on 2014.07.19..
 */
var storing = {};
var timeInMs = 0;
storing.db = null;
storing.song = {};
storing.counter = 0;
/**
 * Megnyitja az adatbázist. openFinished eseményt hívja meg, amikor végzett a megnyitással
 */
storing.open = function() {
    var version = 3;
    var request = indexedDB.open("songbook",version);

    request.onupgradeneeded = function(e) {
        console.log("onugpradeneeded");
        var db = e.target.result;
        e.target.transaction.onerror = storing.onerror;

        if(db.objectStoreNames.contains("songs")) {
            db.deleteObjectStore("songs");
            console.log("torolve");
        }

        var store = db.createObjectStore("songs",
            {keyPath: "id"});
    };
    request.onsuccess = function(e) {
        storing.db = e.target.result;
        storing.openFinished();

    };

    request.onerror = storing.onerror;
};
/**
 * Hozzáad egy éneket az adatbázishoz
 * @param id
 * @param cim
 * @param elemSzoveg
 */
storing.song.add = function(store,id,cim,elemSzoveg) {
    //console.log("hozzáadás: "+id+" "+cim);
    var data = {
        "cim": cim,
        "szoveg": elemSzoveg,
        "id": id
    };

    var request = store.put(data);
    request.onsuccess = function(e) {
        if(id == 49999) {
            var newTimeInMs = Date.now();
            console.log("Eltérés: "+(newTimeInMs-timeInMs)+ "      "+newTimeInMs);
        }
        if(id % 10000 == 0) {
            console.log(id+" added");
        }
        //console.log(id+" added");
    };

    request.onerror = function(e) {
        console.log(id+" couldnt add");
    }
};

storing.init = function() {

    storing.open();
    storing.openFinished = function() {
        timeInMs = Date.now();
        console.log("A mostani idő: "+timeInMs);
        /*var db = storing.db;
        var trans = db.transaction(["songs"],"readwrite");
        var store = trans.objectStore("songs");
        for(var i=1; i<50000; i++) {

            storing.song.add(store,i,"Az első ének","így megy ez a dal, hogy.... megpróbálok kicsit hosszabb szöveget írni, csak hogy szemléltessek egy valódi éneket így megy ez a dal, hogy.... megpróbálok kicsit hosszabb szöveget írni, csak hogy szemléltessek egy valódi éneket így megy ez a dal, hogy.... megpróbálok kicsit hosszabb szöveget írni, csak hogy szemléltessek egy valódi éneket így megy ez a dal, hogy.... megpróbálok kicsit hosszabb szöveget írni, csak hogy szemléltessek egy valódi éneketígy megy ez a dal, hogy.... megpróbálok kicsit hosszabb szöveget írni, csak hogy szemléltessek egy valódi éneket így megy ez a dal, hogy.... megpróbálok kicsit hosszabb szöveget írni, csak hogy szemléltessek egy valódi éneket");
        }*/

        //storing.song.add(2,"A második ének","ez meg így megy, hogy....");
    };
};

storing.init();