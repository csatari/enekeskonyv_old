/**
 * Created by Albert on 2014.12.26..
 */

/**
 * A szerkesztőben a legutolsó részlet, a Beállítások
 * @param binding
 * @constructor
 */
function Options(binding) {
    this.binding = binding;
    AbstractElement.apply(this,arguments);
    this.Update();
    Options.prototype.editorTitle = new GroupTitle(".optionsTitle","Beállítások");
    Options.prototype.languagesList = [];
    Options.prototype.songsList = [];
}
Options.prototype = Object.create(AbstractElement.prototype);
Options.prototype.constructor = Options;

Options.prototype.Update = function() {
    $(this.binding).html(this.ToHTML());
    this.CssStructure();
    this.CssVisual();
    if(this.editorTitle!= null) {
        this.editorTitle.Update();
    }
}

Options.prototype.ToHTML = function() {

    var htmlStr = "" +
        "<div class='optionsTitle'></div>" +
        "<div class='beallitasok'>" +
        "<table>" +
            "<tr>" +
                "<td><span class='beallitasokCimke'>Nyelv:</span></td>" +
                "<td><span class='beallitasokLeiro'>" +
                    "<select class='nyelv'>";
    if(this.languagesList!=null) {
        this.languagesList.forEach(function(element, index, array) {
            htmlStr = htmlStr +
                    "<option value='"+element["id"]+"'>"+element["nev"]+"</option>";
        });
    }
    htmlStr=htmlStr+"</select>" +
                "</span>" +
                "</td>" +
            "</tr>" +
            "<tr>" +
                "<td><span class='beallitasokCimke'>Más nyelven:</span></td>" +
                "<td><span class='beallitasokLeiro'>" +
                    "<select class='masnyelven'>" +
                    "<option value='0'>Nem</option>";
    if(this.songsList!=null) {
        this.songsList.forEach(function(element, index, array) {
            var pontpontpont = "...";
            if(element["leiro"].substr(0,100) == element["leiro"]) pontpontpont = "";
            htmlStr = htmlStr +
                    "<option value='"+element["id"]+"'>"+element["cim"]+" ("+
                        element["leiro"].substr(0,100)+pontpontpont+")"+"</option>";
        });
    }
    htmlStr=htmlStr+"</select>" +
                "</span>" +
                "</td>" +
            "</tr>" +
            "<tr>" +
            "<td><span class='beallitasokCimke'>Címkék:</span></td>" +
                "<td><span class='beallitasokLeiro'>" +
                    "<input type='text' class='cimkek' placeholder='Címkék vesszővel felsorolva'/>" +
                "</span>" +
                "</td>" +
            "</tr>" +
            "<tr>" +
            "<td><span class='beallitasokCimke'>Megjegyzés:</span></td>" +
                "<td><span class='beallitasokLeiro'>" +
                    "<textarea class='megjegyzes' placeholder='Szöveg, link, kép, videó'></textarea>" +
                "</span>" +
                "</td>" +
            "</tr>" +
        "</table>" +
        "</div>";
    return htmlStr;
}

/**
 * Beállítja a nyelveket
 * @param languages JSON kódolt stringet vár
 * @constructor
 */
Options.prototype.SetLanguages = function(languages) {
    if(this.languagesList != undefined) {
        var json = JSON.parse(languages);
        var l = this.languagesList;
        json.forEach(function(element, index, array) {
            l.push(element);
        });
    }
    this.Update();
}

/**
 * Beállítja az énekeket
 * @param songs JSON kódolt stringet vár
 * @constructor
 */
Options.prototype.SetSongs = function(songs) {
    if(this.songsList != undefined) {
        var json = JSON.parse(songs);
        var l = this.songsList;
        json.forEach(function(element, index, array) {
            l.push(element);
        });
    }
    this.Update();
}