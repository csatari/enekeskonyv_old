/**
 * Created by Albert on 2014.12.26..
 */
/**
 * Egy HTML-ben megjeleníthető elemet ebből kell származtatni, ha ezt az osztályt ToHTML-lel ágyaztatom be
 * @constructor
 */
function AbstractEmbeddedElement() {

    if (this.constructor === AbstractEmbeddedElement) {
        throw new Error("Can't instantiate abstract class!");
    }
}

/**
 * alapkinézetre vonatkozó CSS beállítások
 * @constructor
 */
AbstractEmbeddedElement.prototype.CssStructure = function() {
};

/**
 * Designra vonatkozó CSS beállítások
 * @constructor
 */
AbstractEmbeddedElement.prototype.CssVisual = function() {
};

/**
 * Visszaadja az elem HTML kódját
 * @constructor
 */
AbstractEmbeddedElement.prototype.ToHTML = function() {
}

/**
 * Újrarajzolja az elemet
 * @constructor
 */
AbstractEmbeddedElement.prototype.Update = function() {
    this.CssStructure();
    this.CssVisual();
}

/**
 * Visszaadja a binding hivatkozás nélküli verzióját. Pl .class helyett class
 * @constructor
 */
AbstractEmbeddedElement.prototype.BindingName = function() {
    return this.binding.substr(1,this.binding.length);
}