/**
 * Created by Albert on 2014.12.26..
 */

/**
 * A szerkesztőben a harmadik rész, a kotta.
 * @param binding
 * @constructor
 */
function Notes(binding) {
    this.binding = binding;
    AbstractElement.apply(this,arguments);
    this.Update();
    Notes.prototype.editorTitle = new GroupTitle(".notesTitle","Kotta");
}
Notes.prototype = Object.create(AbstractElement.prototype);
Notes.prototype.constructor = Notes;

Notes.prototype.Update = function() {
    $(this.binding).html(this.ToHTML());
    var tabdiv = new Vex.Flow.TabDiv("div.vex-tabdiv");
    tabdiv.redraw();
}

Notes.prototype.ToHTML = function() {
    return "<div class='notesTitle'></div>" +
        "<div class='kotta'>" +
        "<div style='width:700; margin-left: auto; margin-right: auto;'>" +
        "<div class='vex-tabdiv' width='680' scale='1.0' editor='true' editor_width='680' editor_height='330' style='position: relative;'>" +
        "options stave-distance=30 space=10" +
        "\ntabstave notation=true tablature=false key=C time=4/4</div>" +
        "</div>" +
        "</div>";
}