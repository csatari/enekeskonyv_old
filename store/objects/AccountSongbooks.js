/**
 * Created by Albert on 2014.12.26..
 */

function AccountSongbooks(binding) {
    this.binding = binding;
    AbstractElement.apply(this,arguments);
    this.Update();
}
AccountSongbooks.prototype = Object.create(AbstractElement.prototype);
AccountSongbooks.prototype.constructor = AccountSongbooks;

AccountSongbooks.prototype.CssStructure = function() {
    $(this.binding).css({
        'position':'fixed',
        'right':'3%',
        'top':'3%',
        'z-index':2
    });
};

AccountSongbooks.prototype.CssVisual = function() {
    $(this.binding).css({
        'font-size':'20px',
        'background-color':'white'
    });
};

AccountSongbooks.prototype.ToHTML = function() {
    return "<table class='abc'><tr><td><span class='link login'>Bejelentkezés</span></td><td>" +
        "<span class='link signup'>Regisztráció</span></td></tr>" +
        "</table>";
}