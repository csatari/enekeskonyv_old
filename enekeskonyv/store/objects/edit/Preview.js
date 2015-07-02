/**
 * Created by Albert on 2014.12.26..
 */

/**
 * A szerkesztőben az előnézet
 * @param binding
 * @constructor
 */
function Preview(binding) {
    this.binding = binding;
    AbstractElement.apply(this,arguments);
    this.Update();
    Preview.prototype.editorTitle = new GroupTitle(".elonezetEnekCim","Előnézet");
}
Preview.prototype = Object.create(AbstractElement.prototype);
Preview.prototype.constructor = Preview;


Preview.prototype.ToHTML = function() {
    return "<div class='elonezet'>" +
        "<div class='elonezetEnekCim'></div>" +
        "</div>";
}