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

    $(".akkord.gomb").mousedown(function() {
        Editor.prototype.enekSzovegHozzaadasKurzorhoz("[a]","[/a]");
        return false;
    });
    $(".versszak.gomb").mousedown(function() {
        Editor.prototype.enekSzovegHozzaadasKurzorhoz("[v]","[/v]");
        return false;
    });
    $(".refren.gomb").mousedown(function() {
        Editor.prototype.enekSzovegHozzaadasKurzorhoz("[r]","[/r]");
        return false;
    });
    $(".atvezeto.gomb").mousedown(function() {
        Editor.prototype.enekSzovegHozzaadasKurzorhoz("[b]","[/b]");
        return false;
    });
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

Editor.prototype.enekSzovegHozzaadasKurzorhoz = function(kezdotag,vegtag) {
    var caretPosStart = $(".songText")[0].selectionStart;
    var caretPosEnd = $(".songText")[0].selectionEnd;
    var textAreaTxt = $(".songText").val();
    console.log(textAreaTxt);
    $(".songText").val(
        textAreaTxt.substring(0, caretPosStart) + kezdotag + textAreaTxt.substring(caretPosStart, caretPosEnd) +
            vegtag + textAreaTxt.substring(caretPosEnd));
    $(".songText")[0].selectionStart = caretPosEnd+3;
    $(".songText")[0].selectionEnd = caretPosEnd+3;
}