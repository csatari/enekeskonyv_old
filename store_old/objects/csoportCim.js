/**
 * Created by Albert on 2014.08.14..
 */
var CsoportCim = function(adatkoto, cim) {
    var adatkoto = adatkoto;
    var cim = cim;

    var vazBeallitas = function() {
        $(adatkoto).html(
            "<span>" +
                "<span class=\"cim\">"+ cim +"</span>" +
                "<div class=\"vonal\"></div>" +
                "</span>"
        );
    };

    /***
     * Megjelenít egy csoportot összefoglaló címet
     * @param adatkoto
     */
    this.megjelenit = function() {
        console.log("cím1: "+this.cim+" 2:"+cim);
        vazBeallitas(cim);
        cssBeallitas();
    };
    /***
     * Beállítja a cím stílusát
     */
    var cssBeallitas = function() {
        $(adatkoto + " .cim").css({
            "margin-left": "5px",
            "font-family": "Arial, \"Helvetica Neue\", Helvetica, sans-serif",
            "font-size": "22px",
            "display":"block",
            "margin-top":"15px"
        });
        $(adatkoto + " .vonal").css({
            "border-style": "solid",
            "margin-top": "3px",
            "border-width": "0px",
            "border-bottom-width": "1px",
            "margin-bottom":"15px"
        });
    };
};