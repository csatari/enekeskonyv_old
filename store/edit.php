<?php
/**
 * Created by PhpStorm.
 * User: Albert
 * Date: 2014.08.14.
 * Time: 20:04
 */
require_once("adatkezelok/nyelv.php");
require_once("adatkezelok/enek.php");
$token = md5(rand(1000,9999)); //you can use any encryption
$_SESSION['token'] = $token; //store it as session variable
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
                if(kitoltesEllenorzes()) {
                    $.ajax({
                        type: "POST",
                        url:"jsoncommunicator/enekHozzaado.php",
                        data: {
                            "token": "<?php echo $token; ?>",
                            "cim": $(".enekcim").val(),
                            "szoveg": $(".enekSzoveg").val(),
                            "kotta": $(".vex-tabdiv textarea").val(),
                            "nyelv": $("select.nyelv").val(),
                            "masnyelven": $("select.masnyelven").val(),
                            "cimkek": $(".cimkek").val(),
                            "megjegyzes": $(".megjegyzes").val()
                        }
                    }).done(function(e) {
                        if(e != "") {
                            alert("Nem sikerült a mentés!");
                        }
                        else {
                            window.location.href = "index.php";
                        }
                    });

                }
            });
            document.addEventListener("elvetes",function(e) {
                window.location.href = "index.php";
            });

            var szerkesztoCim = new CsoportCim(".csoportcim","Szerkesztő");
            szerkesztoCim.megjelenit();
            var elonezetCim = new CsoportCim(".elonezetCim","Előnézet");
            elonezetCim.megjelenit();
            var beallitasokCim = new CsoportCim(".beallitasokCim","Beállítások");
            beallitasokCim.megjelenit();
            var kottaCim = new CsoportCim(".kottaCim","Kotta");
            kottaCim.megjelenit();

            $(".enekcim").keyup(function() {
                cimElonezet($(".enekcim").val());
            });
            $(".enekSzoveg").keyup(function() {
                enekElonezet($(".enekSzoveg").val());
            });
            $(".akkord.gomb").mousedown(function() {
                enekSzovegHozzaadasKurzorhoz("[a]","[/a]");
                return false;
            });
            $(".versszak.gomb").mousedown(function() {
                enekSzovegHozzaadasKurzorhoz("[v]","[/v]");
                return false;
            });
            $(".refren.gomb").mousedown(function() {
                enekSzovegHozzaadasKurzorhoz("[r]","[/r]");
                return false;
            });
            $(".atvezeto.gomb").mousedown(function() {
                enekSzovegHozzaadasKurzorhoz("[b]","[/b]");
                return false;
            });

        });
        function enekSzovegHozzaadasKurzorhoz(kezdotag,vegtag) {
            var caretPosStart = $(".enekSzoveg")[0].selectionStart;
            var caretPosEnd = $(".enekSzoveg")[0].selectionEnd;
            var textAreaTxt = $(".enekSzoveg").val();
            console.log(textAreaTxt);
            $(".enekSzoveg").val(
                textAreaTxt.substring(0, caretPosStart) + kezdotag + textAreaTxt.substring(caretPosStart, caretPosEnd) +
                vegtag + textAreaTxt.substring(caretPosEnd));
            $(".enekSzoveg")[0].selectionStart = caretPosEnd+3;
            $(".enekSzoveg")[0].selectionEnd = caretPosEnd+3;
        }
        function kitoltesEllenorzes() {
            var elfogadhato = true;
            if($('.enekcim').val() == "") {
                $('.enekcim').css({
                    "border-color": "red"
                });
                elfogadhato = false;
            }
            else {
                $('.enekcim').css({
                    "border-color": "black"
                });
            }

            if($(".enekSzoveg").val() == "" || $(".vex-tabdiv textarea").val() == "") {
                $('.enekSzoveg').css({
                    "border-color": "red"
                });
                $('.vex-tabdiv textarea').css({
                    "border-color": "red"
                });
                elfogadhato = false;
            }
            return elfogadhato;
        }
        function cimElonezet(cim) {
            $(".elonezetEnekCim").text(cim);
        }
        function enekElonezet(enek) {
            $(".elonezetEnekSzoveg").text(enek);
        }
    </script>
</head>
<body>
<div class="Reg"></div>
<div class="megjelenito">
    <span class="csoportcim"></span>
    <div class="enekSzerkeszto">
        <input class="enekcim" type="text" placeholder="Cím..."/>
        <div class="szerkesztoBeallitasok">
            <span class="gomb akkord">Akkord</span>
            <span class="gomb versszak">Versszak</span>
            <span class="gomb refren">Refrén</span>
            <span class="gomb atvezeto">Átvezető</span>
        </div>
        <textarea class="enekSzoveg" placeholder="Ide jön az ének szövege..."></textarea>
    </div>
    <span class="elonezetCim"></span>
    <div class="elonezetEnek">
        <div class="elonezetEnekCim"></div>
        <div class="elonezetEnekSzoveg"></div>
    </div>
    <span class="kottaCim"></span>
    <div class="kotta">
        <div style="width:700; margin-left: auto; margin-right: auto;">
            <div class="vex-tabdiv" width="680" scale="1.0" editor="true" editor_width="680" editor_height="330" style="position: relative;">options stave-distance=30 space=10
tabstave notation=true tablature=false key=C time=4/4</div>
        </div>
    </div>
    <span class="beallitasokCim"></span>
    <div class="beallitasok">
        <table>
            <tr>
                <td><span class="beallitasokCimke">Nyelv:</span></td>
                <td><span class="beallitasokLeiro">
                        <select class="nyelv">
                            <?php
                                $nyelv = new Nyelv($db);
                                $osszesNyelv = $nyelv->getAll();
                                foreach($osszesNyelv as $egyNyelv) {
                                    echo "<option value='".$egyNyelv->id."'>".$egyNyelv->nev."</option>";
                                }
                            ?>
                        </select>
                    </span>
                </td>
            </tr>
            <tr>
                <td><span class="beallitasokCimke">Más nyelven:</span></td>
                <td><span class="beallitasokLeiro">
                        <select class="masnyelven">
                            <option value="0">Nem</option>
                            <?php
                                $enekek = new EnekSQL($db);
                                $osszesenek = $enekek->getAll();
                                foreach($osszesenek as $egyEnek) {
                                    /* @var $egyEnek EnekTabla */

                                    $pontpontpont = "...";
                                    if(substr($egyEnek->leiro,0,100) == $egyEnek->leiro) { $pontpontpont = "";}
                                    echo "<option value='".$egyEnek->id."'>".$egyEnek->cim." (".substr($egyEnek->leiro,0,100).$pontpontpont.")</option>";
                                }
                            ?>
                        </select>
                    </span>
                </td>
            </tr>
            <tr>
                <td><span class="beallitasokCimke">Címkék:</span></td>
                <td><span class="beallitasokLeiro">
                        <input type="text" class="cimkek" placeholder="Címkék vesszővel felsorolva"/>
                    </span>
                </td>
            </tr>
            <tr>
                <td><span class="beallitasokCimke">Megjegyzés:</span></td>
                <td><span class="beallitasokLeiro">
                        <textarea class="megjegyzes" placeholder="Szöveg, link, kép, videó"></textarea>
                    </span>
                </td>
            </tr>
        </table>
    </div>
</div>
</body>
</html>