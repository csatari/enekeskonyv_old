/**
 * Created by Albert on 2014.12.21..
 */
/**
 * Egy HTML-ben megjeleníthető elemet ebből kell származtatni
 * @constructor
 */
function AbstractElement() {

    if (this.constructor === AbstractElement) {
        throw new Error("Can't instantiate abstract class!");
    }
    /**
     * alapkinézetre vonatkozó CSS beállítások
     * @constructor
     */
    var CssStructure = function() {
        throw new Error("Abstract method!");
    };
    /**
     * Designra vonatkozó CSS beállítások
     * @constructor
     */
    var CssVisual = function() {
        throw new Error("Abstract method!");
    };
}

/**
 * Visszaadja az elem HTML kódját
 * @constructor
 */
AbstractElement.prototype.ToHTML = function() {
}

/**
 * Kirajzolja az elemet
 * @constructor
 */
AbstractElement.prototype.Update = function() {
    $(this.binding).html(this.ToHTML());
}

