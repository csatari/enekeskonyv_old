/**
 * Created by Albert on 2014.08.03..
 */
var felhasznaloEnekek = {};

felhasznaloEnekek.adatkoto = "";

/**
 * Beállítja a felhasználó énekeire vonatkozó stílusokat
 */
felhasznaloEnekek.cssBeallitas = function() {
    $(felhasznaloEnekek.adatkoto).css({
        "border-width": "1px",
        "border-style": "solid",
        "border-color": "rgb(202, 202, 202)",
        "position": "fixed",
        "background":"white",
        "z-index": "4",
        "left": "2%",
        "top": "3%"
    });

    $(felhasznaloEnekek.adatkoto + " > .enekeim").css({
        "border-width": "0px 0px 1px 0px",
        "border-style": "solid",
        "border-color": "rgb(202, 202, 202)",
        "width": "100%"
    });

    $(felhasznaloEnekek.adatkoto + " > .enekeim > tbody > tr > td:first-child").css({
        "width": "40px"
    });
    $(felhasznaloEnekek.adatkoto + " > .enekeskonyveim > tbody > tr > td:first-child").css({
        "width": "40px"
    });

    $(felhasznaloEnekek.adatkoto + " > .enekeskonyveim").css({
        "width": "100%"
    });
    $(felhasznaloEnekek.adatkoto + " td.cim").css({
        "font-size": "20px"
    });
    $(felhasznaloEnekek.adatkoto + " .ujenekeskonyvInput").css({
        "display": "none"
    });
};
/***
 * Megjeleníti a felhasználó énekeit és énekeskönyveit
 * @param adatkoto
 */
felhasznaloEnekek.megjelenit = function(adatkoto) {
    felhasznaloEnekek.adatkoto = adatkoto;
    felhasznaloEnekek.frissites();
    felhasznaloEnekek.cssBeallitas();
};
/***
 * Megjeleníti a felhasználó énekeinek a vázát
 */
felhasznaloEnekek.frissites = function() {
    //Kirajzolja a felhasználó énekeinek vázát
    $(felhasznaloEnekek.adatkoto).html(
        "<table class=\"enekeim\">"+
            "<tr>"+
                "<td><img src=\"resources/songbooks.png\" width=\"32\"/></td>"+
                "<td class=\"cim\">Énekeim</td>"+
            "</tr>"+
            "<tr>"+
                "<td></td>"+
                "<td><a href=\"#\" class=\"link ujenek\">Új</a></td>"+
            "</tr>"+
            "<tr>"+
                "<td></td>"+
                "<td><a href=\"#\" class=\"link\">Összes</td>"+
                "</tr>"+
        "</table>"+
        "<table class=\"enekeskonyveim\">"+
            "<tr>"+
                "<td><img src=\"resources/note.png\" height=\"32\" width=\"32\"/></td>"+
                "<td class=\"cim\">Énekeskönyveim</td>"+
            "</tr>"+
            "<tr>"+
                "<td></td>"+
                "<td>"+
                    "<a href=\"#\" class=\"link ujenekeskonyvLink\">Új</a>"+
                    "<input class=\"ujenekeskonyvInput\" type=\"text\" placeholder=\"Énekeskönyv címe\"/>"+
                "</td>"+
            "</tr>"+
        "</table>"
    );
    //Lekéri a felhasználó már beállított énekeskönyveit
    $.ajax({
        type: "POST",
        url:"jsoncommunicator/enekeskonyvKereso.php",
        data: {
            "get": 1,
            "userid": 0
        }
    }).done(function(e) {
        var enekeskonyvek = JSON.parse(e);
        for(var i=0; i<enekeskonyvek.length; i++) {
            $(felhasznaloEnekek.adatkoto + " .enekeskonyveim").append(
                "<tr>"+
                "<td></td>"+
                    "<td>"+
                        "<a href=\"#\" class=\"link enekeskonyvLink\" id=\""+enekeskonyvek[i]["id"]+"\">"+enekeskonyvek[i]["title"]+"</a>"+
                    "</td>"+
                "</tr>"
            );
        }
    });
    //Ha az új énekeskönyvre kattint, akkor átvált egy inputboxszá
    $(felhasznaloEnekek.adatkoto + " .ujenekeskonyvLink").click(function() {
        $(this).css("display","none");
        $(felhasznaloEnekek.adatkoto + " .ujenekeskonyvInput").css("display","inline");
    });
    //Ha entert nyom az új énekeskönyv inputboxában, akkor elmenti az énekeskönyvet (kérést küld), ha escape-t, akkor csak kilép
    $(felhasznaloEnekek.adatkoto + " .ujenekeskonyvInput").keyup(function(key) {
        if(key["keyCode"] == 13) {
            var title = $(felhasznaloEnekek.adatkoto + " .ujenekeskonyvInput").val();
            $.ajax({
                type: "POST",
                url:"jsoncommunicator/enekeskonyvKereso.php",
                data: {
                    "add": title,
                    "userid": 0
                }
            }).done(function(e) {
                felhasznaloEnekek.frissites();
            });
            $(this).css("display","none");
            $(felhasznaloEnekek.adatkoto + " .ujenekeskonyvLink").css("display","inline");
            $(this).val("");

        }
        else if(key["keyCode"] == 27) {
            $(this).css("display","none");
            $(felhasznaloEnekek.adatkoto + " .ujenekeskonyvLink").css("display","inline");
            $(this).val("");
        }
    });
};