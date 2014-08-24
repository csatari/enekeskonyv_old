/**
 * Created by Albert on 2014.08.24..
 */
/**
 * Az énekeket képes letölteni a store-ból és elmenteni a saját adatbázisában.
 * @param adatKoto Ebben a html elemben található vesszővel elválasztva az összes letöltendő ének id-je.
 * @constructor
 */
var EnekLetolto = function(adatKoto) {
    var db = null;
    var adatkoto = adatKoto;
    var transaction = null;
    var store = null;
    var letoltottEnekArray = [];
    var utolsoLetoltottEnek = 0;
    var enekLetoltoOldal = "http://localhost:7776/enekeskonyv/enekeskonyv/store/jsoncommunicator/enekKereso.php";

    /**
     * Elindítja a letöltés, adatbázisba töltést. Publikus függvény
     */
    this.letoltes = function() {
        open();
    };
    /**
     * Akkor hívódik meg, amikor megnyílt az adatbázis. Elkezdi letölteni a megadott énekeket
     */
    var megnyitasBetoltve = function() {
        letoltes($(adatkoto).text());
    };
    /**
     * Az adatbázist nyitja meg, illetve hozza létre, ha még nem létezett.
     */
    var open = function() {
        var version = 1;
        var request = indexedDB.open("enekeskonyv",version);

        request.onupgradeneeded = function(e) {
            var db = e.target.result;
            e.target.transaction.onerror = EnekLetolto.onerror;

            if(db.objectStoreNames.contains("enekek")) {
                db.deleteObjectStore("enekek");
            }

            var store = db.createObjectStore("enekek",
                {keyPath: "id"});
        };

        request.onsuccess = function(e) {
            db = e.target.result;
            megnyitasBetoltve();
        };
    }
    /**
     * Hiba esetén ez fut le.
     * @param e
     */
    var onerror = function(e) {
        console.log("Hiba történt: "+e);
    }
    /**
     * Hozzáad egy JSON objektumot a store változóba beállítot táblába.
     * @param enekArray
     */
    var addEnek = function(enekArray) {
        var request = store.put(enekArray);
        request.onsuccess = function(e) {
            console.log(enekArray["id"] + " hozzáadva");
        };
        request.onerror = function(e) {
            console.log(enekArray["id"]+" hiba a hozzáadásnál");
        }
    };
    /**
     * A kapott paraméterben szereplő énekeket elkezdi letölteni a store-ból. Beállítja az utolsó éneket is.
     * @param enekek Vesszővel elválasztott összes ének listája
     */
    var letoltes = function(enekek) {
        var enekArray = enekek.split(",");
        utolsoLetoltottEnek = enekArray[enekArray.length-1];
        console.log("utolsó: "+utolsoLetoltottEnek);
        for(var i=0; i<enekArray.length;i++) {
            enekLetoltese(enekArray[i]);
        }
    }
    /**
     * Letölti a megadott id-jű éneket a beállított oldalról JSON-nel. A sikeresen letöltött énekeket hozzáadja a letoltottEnekArray tömbhöz,
     * és amikor letöltötte az utolsó éneket is, akkor meghívja az adatbázishoz hozzáadó függvényt.
     * @param id
     */
    var enekLetoltese = function(id) {
        $.ajax({
            type: "POST",
            url:enekLetoltoOldal,
            data: {
                "id": id
            }
        }).done(function(e) {
            var obj = JSON.parse(e);
            if(obj["id"] == null) {
                console.log(id+" ének hibát dobott");
            }
            else {
                console.log(obj["id"]+" ének letöltve...");
                letoltottEnekArray.push(obj);
            }
            if(id == utolsoLetoltottEnek) {
                enekekHozzaadasa();
            }
        });
    }
    /**
     * Létrehoz egy tranzakciót, és az elmentett letoltottEnekArray-ből egyesével kiolvassa az énekeket, majd hozzáadja az adatbázishoz
     */
    var enekekHozzaadasa = function() {
        transaction = db.transaction(["enekek"],"readwrite");
        store = transaction.objectStore("enekek");
        for(var i=0; i<letoltottEnekArray.length;i++) {
            addEnek(letoltottEnekArray[i]);
        }
    }
}
