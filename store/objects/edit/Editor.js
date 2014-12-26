/**
 * Created by Albert on 2014.12.26..
 */

/**
 * A szerkesztőben a legfelső menürészlet, a Szerkesztő
 * @param binding
 * @constructor
 */
function Editor(binding) {
    this.binding = binding;
    AbstractElement.apply(this,arguments);
    this.Update();
    Editor.prototype.editorTitle = new GroupTitle(".editorTitle","Szerkesztő");
}
Editor.prototype = Object.create(AbstractElement.prototype);
Editor.prototype.constructor = Editor;


Editor.prototype.ToHTML = function() {
    return "<div class='editorWrapper'>" +
        "<div class='editorTitle'></div>" +
        "<input class='enekcim' type='text' placeholder='Cím...'/>" +
        "<div class='szerkesztoBeallitasok'>" +
            "<span class='gomb akkord'>Akkord</span>" +
            "<span class='gomb versszak'>Versszak</span>" +
            "<span class='gomb refren'>Refrén</span>" +
            "<span class='gomb atvezeto'>Átvezető</span>" +
        "</div>" +
        "<textarea class='songText' placeholder='Ide jön az ének szövege...'></textarea>" +
        "</div>";
}