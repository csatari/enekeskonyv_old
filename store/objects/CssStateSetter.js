/**
 * Created by Albert on 2014.12.26..
 */

/**
 * Ennek az osztálynak a segítségével könnyen beállítható egy elem css leírói hoverrel együtt jquery-n keresztül.
 * @param element
 * @param normalState Array típus
 * @param hoverState Array típus
 * @constructor
 */
var CssStateSetter = function(element,normalState,hoverState) {
    var Normal = function(elem) {
        $(elem).css(normalState);
    };
    var Hover = function(elem) {
        $(elem).css(hoverState);
    };

    Normal(element); //meghíváskor a normál megjelenést állítja be
    $(element).mouseover(function() {
        Hover(this);
    }).mouseout(function() {
        Normal(this);
    });
}