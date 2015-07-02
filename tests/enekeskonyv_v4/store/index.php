<!--/** A Store főoldala
PHP alapú megjelenítés, kis Javascripttel.
PHP objektumelvű:
    interface Megjelenitheto; az ezzel implementált osztályoknak van megjelenítő része is
    interface AdatbazisKezelo; kiköti, hogy fog használni adatbázist
    class Fooldal; a mindent összekapcsoló osztály
    class Beallitasok; a bal oldali menüpontot megjelenítő és kezelő osztály
    class FelhasznaloInformacio; a jobb felső pontot kezelő osztály
    class Kereso; a kereső
    class EnekPont; egy éneket a keresőben megjelenítő és kezelő pont

Feladat általában: Adatbáziskezelés, Linkek kezelése,
Javascript feladata: Megjelenítés, JSON-nal lekérdezés, feltöltés
-->


<html>
<head>
    <script src="../js/jquery-1.11.1.js"></script>
    <script src="js/enekpont.js"></script>
    <script src="js/felhasznaloKezelo.js.js"></script>
    <script src="js/masonry.pkgd.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/fooldal.css">
    <link rel="stylesheet" type="text/css" href="css/enekpont.css">
    <script>
        var megnyomva = false;
        var ujcim = 6;
        $(document).ready(function() {
            $("body").append(felhasznaloKezelo.megjelenit());
            $(".enekek").masonry({
                itemSelector: ".enekpont",
                columnWidth: 150
            });
            $( ".nyomkodni" ).click(function() {
                $.ajax({
                    url: "enekpont.php"
                }).done(function (e) {
                    if(!megnyomva) {
                        var obj = JSON.parse(e);
                        console.log("lekérve: "+e+" "+obj[0].cim);
                        for(var i=0;i<5;i++) {
                            $('.enekek').append(enekpont.megjelenit(obj[i]));
                            $('.enekek').masonry( 'addItems', $('#'+obj[i].id));
                            $('.enekek').masonry();
                        }
                        megnyomva = !megnyomva;
                    }
                    else {
                        var ujenek = "<div class=\"enekpont\" id=\""+ujcim+"\">Valami új cím</div>";
                        $('.enekek').append(ujenek);
                        $('.enekek').masonry( 'addItems', $('#'+ujcim+".enekpont"));
                        $('.enekek').masonry();
                        ujcim++;
                    }
                });
            });
            $(".keresoGomb").click(function() {
                var ujenek = "<div class=\"enekpont\" id=\""+ujcim+"\">"+$(".keresoInput").val()+"</div>";
                $('.enekek').append(ujenek);
                $('.enekek').masonry( 'addItems', $('#'+ujcim+".enekpont"));
                $('.enekek').masonry();
                ujcim++;
            });
        });
    </script>
</head>
<body>
<div class="kereso">
    <input class="keresoInput" type="text" placeholder="Keresés" value=""/>
    <button class="keresoGomb">
        <img class="keresoGombKep" src="resources/search.png"/>
    </button>
</div>
<button class="nyomkodni">Nyomj meg!</button>
<div class="enekek"></div>
</body>

</html>