var felhasznaloKezelo = {};

felhasznaloKezelo.bejelentkezve = false;
felhasznaloKezelo.nev = "";

felhasznaloKezelo.adatkoto = "";

felhasznaloKezelo.cssBeallitas = function() {
    $(felhasznaloKezelo.adatkoto).css({
        'position':'fixed',
        'right':'3%',
        'top':'3%',
        'z-index':2,
        'font-size':'20px',
        'border': 'solid',
        'border-width': '1px',
        'border-color': 'rgb(202, 202, 202)',
        'padding':'3px'
    });
    $(felhasznaloKezelo.adatkoto+"> .bejelentkezes").css({
        'border-right': 'solid',
        'border-width': '1px',
        'border-color': 'rgb(202, 202, 202)',
        'padding':'3px'
    });
    $(felhasznaloKezelo.adatkoto+"> .regisztracio").css({
        'padding':'3px'
    });
    $(felhasznaloKezelo.adatkoto+"> .kep").css({
    });
    $(felhasznaloKezelo.adatkoto+"> .nev").css({
    });
};
felhasznaloKezelo.megjelenit = function(adatkoto) {
    felhasznaloKezelo.adatkoto = adatkoto;
    felhasznaloKezelo.cssBeallitas();

    felhasznaloKezelo.frissites();
};

felhasznaloKezelo.bejelentkezes = function(nev) {
    felhasznaloKezelo.nev = nev;
    felhasznaloKezelo.bejelentkezve = true;
    felhasznaloKezelo.frissites();
}

felhasznaloKezelo.frissites = function() {
    if(!felhasznaloKezelo.bejelentkezve) {
        $(felhasznaloKezelo.adatkoto).html(
            "<span class='bejelentkezes'>Bejelentkezés</span><span class='regisztracio'>Regisztráció</span>"
        );
    }
    else {
        $(felhasznaloKezelo.adatkoto).html(
            "<div class='kep'></div><div class='nev'>"+felhasznaloKezelo.nev+"</div>"
        );
    }
    felhasznaloKezelo.cssBeallitas();
};