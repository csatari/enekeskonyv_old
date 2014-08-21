/**
 * Created by Albert on 2014.08.03..
 */
var felhasznaloEnekek = {};

var FelhasznaloEnekek = function(Adatkoto) {
    var adatkoto = Adatkoto;

    /**
     * Beállítja a felhasználó énekeire vonatkozó stílusokat
     */
    var cssBeallitas = function() {
        $(adatkoto).css({
            "border-width": "1px",
            "border-style": "solid",
            "border-color": "rgb(202, 202, 202)",
            "position": "fixed",
            "background":"white",
            "z-index": "4",
            "left": "2%",
            "top": "3%"
        });

        $(adatkoto + " > .enekeim").css({
            "border-width": "0px 0px 1px 0px",
            "border-style": "solid",
            "border-color": "rgb(202, 202, 202)",
            "width": "100%"
        });

        $(adatkoto + " > .enekeim > tbody > tr > td:first-child").css({
            "width": "40px"
        });
        $(adatkoto + " > .enekeskonyveim > tbody > tr > td:first-child").css({
            "width": "40px"
        });

        $(adatkoto + " > .enekeskonyveim").css({
            "width": "100%"
        });
        $(adatkoto + " td.cim").css({
            "font-size": "20px"
        });
        $(adatkoto + " .ujenekeskonyvInput").css({
            "display": "none"
        });
    };

    /***
     * Megjeleníti a felhasználó énekeit és énekeskönyveit
     * @param adatkoto
     */
    this.megjelenit = function() {
        frissites();
        cssBeallitas();
    };

    /***
     * Megjeleníti a felhasználó énekeinek a vázát
     */
    var frissites = function() {
        //Kirajzolja a felhasználó énekeinek vázát
        $(adatkoto).html(
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
                "<td><a href=\"#\" class=\"link osszesenek\">Összes</td>"+
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
                $(adatkoto + " .enekeskonyveim").append(
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
        $(adatkoto + " .ujenekeskonyvLink").click(function() {
            $(this).css("display","none");
            $(adatkoto + " .ujenekeskonyvInput").css("display","inline");
        });
        //Ha entert nyom az új énekeskönyv inputboxában, akkor elmenti az énekeskönyvet (kérést küld), ha escape-t, akkor csak kilép
        $(adatkoto + " .ujenekeskonyvInput").keyup(function(key) {
            if(key["keyCode"] == 13) {
                var title = $(adatkoto + " .ujenekeskonyvInput").val();
                if(title != "") {
                    $.ajax({
                        type: "POST",
                        url:"jsoncommunicator/enekeskonyvKereso.php",
                        data: {
                            "add": title,
                            "userid": 0
                        }
                    }).done(function(e) {
                        frissites();
                    });
                }
                $(this).css("display","none");
                $(adatkoto + " .ujenekeskonyvLink").css("display","inline");
                $(this).val("");
            }
            else if(key["keyCode"] == 27) {
                $(this).css("display","none");
                $(adatkoto + " .ujenekeskonyvLink").css("display","inline");
                $(this).val("");
            }
        });
        $(adatkoto + " .ujenek").click(function(key) {
            window.location.href = "./edit.php";
        });

        $(adatkoto + " .osszesenek").click(function() {
            var event = new Event("osszesenek");
            document.dispatchEvent(event);
        });
    };
};





