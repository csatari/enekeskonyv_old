/**
 * Események:
 *  mentes - amikor megnyomja a Mentés gombot
 *  elvetes - amikor megnyomja az Elvetés gombot
 * @param Adatkoto
 * @constructor
 */
var FelhasznaloKezelo = function(Adatkoto) {
    var bejelentkezve = false;
    var szerkesztes = false;
    var nev = "";

    var adatkoto = Adatkoto;

    this.megjelenit = function() {
        cssBeallitas();
        frissites();
    };

    this.bejelentkezes = function(bejelentkezoNev) {
        nev = bejelentkezoNev;
        bejelentkezve = true;
        frissites();
    };

    this.szerkesztesToggle = function(szerkeszt) {
        szerkesztes = szerkeszt;
        frissites();
    };

    var cssBeallitas = function() {
        $(adatkoto).css({
            'position':'fixed',
            'right':'3%',
            'top':'3%',
            'z-index':2,
            'font-size':'20px',


            'background-color':'white'
        });
        $(adatkoto+"> .bejelentkezes").css({
            'border-right': 'solid',
            'border-width': '1px',
            'border-color': 'rgb(202, 202, 202)',
            'padding':'3px'
        });
        $(adatkoto+"> table").css({
            'border': 'solid',
            'border-width': '1px',
            'border-color': 'rgb(202, 202, 202)',
            'border-collapse': 'collapse'
        });
        $(adatkoto+"> table > tbody > tr > td").css({
            'padding': '3px',
            'font-size': '20px'
        });
        $(adatkoto+"> table > tbody > tr > td:first-child").css({
            'border-right-style': 'solid',
            'border-right-color': 'rgb(202,202,202)',
            'border-right-width': '1px'
        });
        $(adatkoto+"> table > tbody > tr:first-child").css({
            'border-bottom-style': 'solid',
            'border-bottom-color': 'rgb(202,202,202)',
            'border-bottom-width': '1px'
        });

    };

    var frissites = function() {
        if(!szerkesztes) {
            if(!bejelentkezve) {
                $(adatkoto).html(
                    "<table><tr><td>Bejelentkezés</td><td>Regisztráció</td></tr>" +
                        "</table>"
                );
            }
            else {
                $(adatkoto).html(
                    "<table><tr><td>Kép</td><td>Név</td></tr>" +
                        "</table>"
                );
            }
        }
        else {
            if(!bejelentkezve) {
                $(adatkoto).html(
                    "<table><tr><td>Bejelentkezés</td><td>Regisztráció</td></tr>" +
                        "<tr><td><a class='link mentes' href='#'>Mentés</a></td><td><a class='link elvetes' href='#'>Elvetés</a></td></tr></table>"

                   /* "<span class='bejelentkezes'>Bejelentkezés</span><span class='regisztracio'>Regisztráció</span>" +
                    "<br><span class='szerkesztesMentes'>Mentés</span><span class='szerkesztesElvetes'>Elvetés</span>"*/
                );
            }
            else {
                $(adatkoto).html(
                    "<table><tr><td>Kép</td><td>Név</td></tr>" +
                        "<tr><td><a class='link mentes' href='#'>Mentés</a></td><td><a class='link elvetes' href='#'>Elvetés</a></td></tr></table>"
                );
            }
        }
        cssBeallitas();

        $(adatkoto + " .mentes").click(function() {
            var event = new Event('mentes');
            document.dispatchEvent(event);
        });
        $(adatkoto + " .elvetes").click(function() {
            var event = new Event('elvetes');
            document.dispatchEvent(event);
        });
    };
};