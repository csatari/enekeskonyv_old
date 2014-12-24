/**
 * Created by Albert on 2014.12.24..
 */

/**
 * Egy címmel ellátott hosszú vízszintes vonal
 * @param binding
 * @param title
 * @constructor
 */
function GroupTitle(binding, title) {
    this.binding = binding;
    this.SetTitle(title);
    AbstractElement.apply(this,arguments);
    this.Update();
}
GroupTitle.prototype = Object.create(AbstractElement.prototype);
GroupTitle.prototype.constructor = GroupTitle;

GroupTitle.prototype.CssStructure = function() {
    $(this.binding + " .cim").css({
        "margin-left": "5px",
        "display":"block",
        "margin-top":"15px"
    });
    $(this.binding + " .vonal").css({
        "margin-top": "3px",
        "margin-bottom":"15px"
    });
};

GroupTitle.prototype.CssVisual = function() {
    $(this.binding + " .cim").css({
        "font-family": "Arial, \"Helvetica Neue\", Helvetica, sans-serif",
        "font-size": "22px"
    });
    $(this.binding + " .vonal").css({
        "border-style": "solid",
        "border-width": "0px",
        "border-bottom-width": "1px"
    });

};

GroupTitle.prototype.ToHTML = function() {
    return "<span>" +
            "<span class=\"cim\">"+ Title +"</span>" +
            "<div class=\"vonal\"></div>" +
            "</span>";
}

var Title;

/**
 * Beállítja a címet
 * @param title
 * @constructor
 */
GroupTitle.prototype.SetTitle = function(title) {
    Title = title;
}