/**
 * Created by Albert on 2014.12.21..
 */
/**
 * Jobb felső menü, ami a felhasználó belépési adatait mutatja. Ezen kívül több szerepet is betölt:
 * - Mentés - Elvetés gombot mutat az Editorban
 * @param binding
 * @constructor
 */
function AccountFlyer(binding) {
    this.binding = binding;
    AbstractElement.apply(this,arguments);
    this.Update();
}
AccountFlyer.prototype = Object.create(AbstractElement.prototype);
AccountFlyer.prototype.constructor = AccountFlyer;

AccountFlyer.prototype.CssStructure = function() {
    $(this.binding).css({
        'position':'fixed',
        'right':'3%',
        'top':'3%',
        'z-index':2
    });
};

AccountFlyer.prototype.CssVisual = function() {
    $(this.binding).css({
        'font-size':'20px',
        'background-color':'white'
    });
    $(this.binding+"  > .bejelentkezes").css({
        'border-right': 'solid',
        'border-width': '1px',
        'border-color': 'rgb(202, 202, 202)',
        'padding':'3px'
    });
    $(this.binding + "> table").css({
        'border': 'solid',
        'border-width': '1px',
        'border-color': 'rgb(202, 202, 202)',
        'border-collapse': 'collapse'
    });
    $(this.binding+" > table > tbody > tr > td").css({
        'padding': '3px',
        'font-size': '20px'
    });
    $(this.binding+" > table > tbody > tr > td:first-child").css({
        'border-right-style': 'solid',
        'border-right-color': 'rgb(202,202,202)',
        'border-right-width': '1px'
    });
    $(this.binding+" > table > tbody > tr:first-child").css({
        'border-bottom-style': 'solid',
        'border-bottom-color': 'rgb(202,202,202)',
        'border-bottom-width': '1px'
    });
};

AccountFlyer.prototype.ToHTML = function() {
    return "<table class='abc'><tr><td><span class='link login'>Bejelentkezés</span></td><td>" +
        "<span class='link signup'>Regisztráció</span></td></tr>" +
        "</table>";
}