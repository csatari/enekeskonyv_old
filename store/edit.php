<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.14.
 * Time: 20:04
 */
?>

<html>
<head>
    <meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <script src="../js/jquery-1.11.1.js"></script>
    <script src="objects/felhasznaloKezelo.js" charset="utf-8"></script>
    <script src="objects/csoportCim.js" charset="utf-8"></script>
    <link rel="stylesheet" type="text/css" href="css/edit.css">

    <!-- Vextab css -->
    <link href="VexTab/vextab.css" rel="stylesheet" type="text/css">
    <link href="VexTab//tabdiv.css" media="screen" rel="Stylesheet" type="text/css">

    <!-- Support Sources -->
    <script src="VexTab//vexflow-min.js"></script><style type="text/css"></style>
    <script src="VexTab//underscore-min.js"></script>
    <script src="VexTab//tabdiv-min.js"></script>
    <script>
        $(document).ready(function() {
            var felhasznaloKezelo = new FelhasznaloKezelo(".Reg");
            felhasznaloKezelo.megjelenit();
            felhasznaloKezelo.szerkesztesToggle(true);
            document.addEventListener("mentes",function(e) {
                console.log("mentés");
            });
            document.addEventListener("elvetes",function(e) {
                console.log("elvetés");
            });

            var szerkesztoCim = new CsoportCim(".csoportcim","Szerkesztő");
            szerkesztoCim.megjelenit();
            var elonezetCim = new CsoportCim(".elonezetCim","Előnézet");
            elonezetCim.megjelenit();
            var beallitasokCim = new CsoportCim(".beallitasokCim","Beállítások");
            beallitasokCim.megjelenit();
            var kottaCim = new CsoportCim(".kottaCim","Kotta");
            kottaCim.megjelenit();
            //csoportCim.megjelenit(".csoportcim","Szerkesztő");
            //csoportCim.megjelenit(".elonezetCim","Előnézet");
        });
    </script>
</head>
<body>
<div class="Reg"></div>
<div class="megjelenito">
    <span class="csoportcim"></span>
    <div class="enekSzerkeszto">
        <input class="enekcim" type="text" placeholder="Cím..."/>
        <div class="szerkesztoBeallitasok">
            <a href="#" class="gomb">Akkord</a>
            <a href="#" class="gomb">Versszak</a>
            <a href="#" class="gomb">Refrén</a>
            <a href="#" class="gomb">Átvezető</a>
        </div>
        <textarea class="enekSzoveg" placeholder="Ide jön az ének szövege..."></textarea>
    </div>
    <span class="elonezetCim"></span>
    <div class="elonezetEnek">
        <div class="elonezetEnekCim">Ének címe</div>
        <div class="elonezetEnekSzoveg">Ének szövege....<br>megnit<br>bbbalsaldasdsa
            Ének szövege....<br>megnit<br>
            Ének szövege....<br>megnit<br>
            Ének szövege....<br>megnit<br>Ének szövege....<br>megnit<br>
            Ének szövege....<br>megnit<br>
            Ének szövege....<br>megnit<br>
        </div>
    </div>
    <span class="kottaCim"></span>
    <div class="kotta">
        <div style="width:700; margin-left: auto; margin-right: auto;">
            <div class="vex-tabdiv" width="680" scale="1.0" editor="true" editor_width="680" editor_height="330" style="position: relative;">options stave-distance=30 space=10
tabstave notation=true tablature=false key=C time=4/4
notes C-D-E-F-G-A-B/4 C-D-E-F-G-A-B/5</div>
        </div>
    </div>
    <span class="beallitasokCim"></span>
    <div class="beallitasok">
        <table>
            <tr>
                <td><span class="beallitasokCimke">Nyelv:</span></td>
                <td><span class="beallitasokLeiro">
                        <select>
                            <option value="1">Magyar</option>
                            <option value="2">English</option>
                        </select>
                    </span>
                </td>
            </tr>
            <tr>
                <td><span class="beallitasokCimke">Más nyelven:</span></td>
                <td><span class="beallitasokLeiro">
                        <select>
                            <option value="0">Nem</option>
                            <option value="1">Egyik ének...</option>
                        </select>
                    </span>
                </td>
            </tr>
            <tr>
                <td><span class="beallitasokCimke">Címkék:</span></td>
                <td><span class="beallitasokLeiro">
                        <input type="text" placeholder="Címkék vesszővel felsorolva"/>
                    </span>
                </td>
            </tr>
            <tr>
                <td><span class="beallitasokCimke">Megjegyzés:</span></td>
                <td><span class="beallitasokLeiro">
                        <textarea placeholder="Szöveg, link, kép, videó"></textarea>
                    </span>
                </td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>