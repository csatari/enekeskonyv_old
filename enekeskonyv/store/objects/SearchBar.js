/**
 * Created by Albert on 2014.12.24..
 */

/**
 * A kereső.
 * @param binding
 * @constructor
 */
function SearchBar(binding) {
    this.binding = binding;
    AbstractElement.apply(this,arguments);
    this.Update();
}
SearchBar.prototype = Object.create(AbstractElement.prototype);
SearchBar.prototype.constructor = SearchBar;

SearchBar.prototype.CssStructure = function() {
    $(this.binding).css({
        'min-width': '455px',
        'text-align': 'center',
        'position': 'fixed',
        'left': '33%',
        'z-index': '3',
        'height': '40px',
        'top': '3%'
    });
    $(this.binding + " > .keresoGomb").css({
        'padding': '5px',
        'width': '55px',
        'height': '40px',
        'border':'none',
        'float':'left'
    });
    $(this.binding + " > button > .keresoGombKep").css({
        'height':'80%',
        'padding':'0px',
        'margin-right': 'auto',
        'margin-left': 'auto'
    });
    $(this.binding + " > .keresoInput").css({
        'vertical-align': 'top',
        'height': '38px',
        'margin':'0px',
        'padding':'0px',
        'padding-left':'3px',
        'display':'inline-block',
        'float':'left',
        'width':'400px'
    });
};

SearchBar.prototype.CssVisual = function() {
    $(this.binding + " > .keresoGomb").css({
        'border-top-right-radius': '10px',
        'border-bottom-right-radius': '10px',
        "background-color": "transparent",
        "background": "rgb(32,124,202)", /* Old browsers */
        "background": "-moz-linear-gradient(top,  rgba(32,124,202,1) 0%, rgba(0,118,244,1) 21%, rgba(0,118,244,1) 100%)", /* FF3.6+ */
        "background": "-webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(32,124,202,1)), color-stop(21%,rgba(0,118,244,1)), color-stop(100%,rgba(0,118,244,1)))", /* Chrome,Safari4+ */
        "background": "-webkit-linear-gradient(top,  rgba(32,124,202,1) 0%,rgba(0,118,244,1) 21%,rgba(0,118,244,1) 100%)", /* Chrome10+,Safari5.1+ */
        "background": "-o-linear-gradient(top,  rgba(32,124,202,1) 0%,rgba(0,118,244,1) 21%,rgba(0,118,244,1) 100%)", /* Opera 11.10+ */
        "background": "-ms-linear-gradient(top,  rgba(32,124,202,1) 0%,rgba(0,118,244,1) 21%,rgba(0,118,244,1) 100%)", /* IE10+ */
        "background": "linear-gradient(to bottom,  rgba(32,124,202,1) 0%,rgba(0,118,244,1) 21%,rgba(0,118,244,1) 100%)", /* W3C */
        "filter": "progid:DXImageTransform.Microsoft.gradient( startColorstr='#207cca', endColorstr='#0076f4',GradientType=0 )" /* IE6-9 */
    });
    $(this.binding + " > .keresoInput").css({
        'border-top-left-radius': '10px',
        'border-bottom-left-radius': '10px',
        'border': 'rgb(156, 156, 156)',
        'border-style': 'solid',
        'border-width': '1px'
    });
};

SearchBar.prototype.ToHTML = function() {
    return "<input class=\"keresoInput\" type=\"text\" placeholder=\"Keresés\"/>" +
        "<button class=\"keresoGomb\">" +
        "<img class=\"keresoGombKep\" src=\"resources/search.png\"/>" +
        "</button>";
}