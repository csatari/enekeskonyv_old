/**
 * Created by Albert on 2014.07.29..
 */
var felhasznaloKezelo = {};

felhasznaloKezelo.bejelentkezve = false;

felhasznaloKezelo.megjelenit = function() {

    if(felhasznaloKezelo.bejelentkezve) {
        return '<div class="felhasznaloKezelo">Gézukaa</div>';
    }
    else {
        return '<div class="felhasznaloKezelo">Bejelentkezés|Regisztráció</div>';
    }
};