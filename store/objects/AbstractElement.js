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
}

/**
 * alapkinézetre vonatkozó CSS beállítások
 * @constructor
 */
AbstractElement.prototype.CssStructure = function() {
};

/**
 * Designra vonatkozó CSS beállítások
 * @constructor
 */
AbstractElement.prototype.CssVisual = function() {
};

/**
 * Visszaadja az elem HTML kódját
 * @constructor
 */
AbstractElement.prototype.ToHTML = function() {
}

/**
 * Újrarajzolja az elemet
 * @constructor
 */
AbstractElement.prototype.Update = function() {
    $(this.binding).html(this.ToHTML());
    this.CssStructure();
    this.CssVisual();
}

