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
<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.14.
 * Time: 20:04
 */
require_once("db.php");
$token = md5(rand(1000,9999)); //you can use any encryption
$_SESSION['token'] = $token; //store it as session variable
?>

<html>
<head>
    <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <script src="../js/jquery-1.11.1.js"></script>
    <script src="js/enekpont.js" charset="utf-8"></script>
    <script src="objects/felhasznaloEnekek.js" charset="utf-8"></script>
    <script src="objects/felhasznaloKezelo.js" charset="utf-8"></script>
    <script src="js/masonry.pkgd.min.js"></script>
    <link rel="stylesheet" type="text/css" href="css/fooldal.css">
    <link rel="stylesheet" type="text/css" href="css/enekpont.css">
    <script>
        var megnyomva = false;
        var ujcim = 6;
        var megjelenitettEnekek;
        $(document).ready(function() {
            //Lehet, hogy így kell majd hozzáadni egy elemet...
            var felhasznaloKezelo = new FelhasznaloKezelo(".Reg");
            felhasznaloKezelo.megjelenit();
            document.addEventListener("login",function(e) {
                $(".loginPanel").css("display","block");
            });
            document.addEventListener("signup",function(e) {
                $(location).attr('href','signup.php');
            });

            var felhasznaloEnekek = new FelhasznaloEnekek(".felhasznaloEnekek");
            felhasznaloEnekek.megjelenit();
            document.addEventListener("osszesenek",function(e) {
                console.log("Az összes énekeskönyv letöltése!");
                $.ajax({
                    type: "POST",
                    url:"jsoncommunicator/enekeskonyvLetolto.php",
                    data: {
                        "token": "<?php echo $token; ?>"
                    }
                }).done(function(e) {
                    if(e != "") {
                        alert("Nem sikerült a letöltés!");
                    }
                    else {
                        alert("Sikerült a letöltés!");
                    }
                });
            });
            $(".enekek").masonry({
                itemSelector: ".enekpont",
                columnWidth: 250
            });
            $( ".nyomkodni" ).click(function() {
                felhasznaloKezelo.bejelentkezes("Albert");

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
            $(".keresoInput").keyup(function() {
                console.log("elindult: "+$(".keresoInput").val());
                $.ajax({
                    type: "POST",
                    url:"jsoncommunicator/enekKereso.php",
                    data: {
                        "cim": $(".keresoInput").val()
                    }
                }).done(function(e) {
                    var enekek = JSON.parse(e);
                    if(megjelenitettEnekek != e) {
                        $('.enekek').html("");
                        console.log("lefutott");
                        for(var i=0; i<enekek.length; i++) {
                            $('.enekek').append(enekpont.megjelenit(enekek[i]));
                            $('.enekek').masonry( 'addItems', $('#'+enekek[i].id+".enekpont"));
                        }
                        $('.enekek').masonry();
                    }
                    megjelenitettEnekek = e;
                });
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
<div class="felhasznaloEnekek">
</div>
<div class="Reg"></div>
<div class="loginPanel">
    <input type="text" placeholder="Felhasználónév"/>
    <input type="text" placeholder="Jelszó"/>
    <button onclick="">Bejelentkezés</button>
</div>
<!--<button class="nyomkodni">Nyomj meg!</button>-->
<div class="enekek"></div>
</body>

</html>