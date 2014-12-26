/**
 * Created by Albert on 2014.12.26..
 */

/**
 * A keresőben egy megjelenő ének
 * @param binding
 * @constructor
 */
function SearchElement(binding) {
    this.binding = binding;
    this.Name = "";
    AbstractEmbeddedElement.apply(this,arguments);
    this.Update();
}
SearchElement.prototype = Object.create(AbstractEmbeddedElement.prototype);
SearchElement.prototype.constructor = SearchElement;

SearchElement.prototype.CssStructure = function() {
    $(this.binding).css({
        'position':'absolute',
        'margin-right':'50px',
        'padding':'10px',
        'border-style':'solid',
        'border-width':'1px',
        'min-width':'100px',
        'min-height':'60px'
    });
    $(this.binding + " > span.songButton").css({
        'position':'absolute',
        'bottom':'0%',
        'right':'0%',
        'border-style':'solid',
        'border-width':'1px',
        'border-color':'gray',
        'padding':'3px',
        'margin-right':'2px',
        'margin-bottom':'2px'
    });
};

SearchElement.prototype.CssVisual = function() {
    $(this.binding).css({
        'border-color':'lightgray',
        'font-size':'20px',
        'background-color':'white',
        '-webkit-border-radius':'5px',
        '-moz-border-radius':'5px',
        'border-width':'2px'
    });

    CssStateSetter(this.binding + " > span.songButton",
        {
            'font-size':'16px',
            'text-decoration':'none',
            'cursor':'none'
        },
        {
            'text-decoration':'underline',
            'cursor':'pointer'
        }
    );
};

SearchElement.prototype.ToHTML = function() {
    return "<div class='"+this.BindingName()+"'><div>"+this.Name+"</div>" +
        "<span class='songButton'>Megnéz</span>" +
        "</div>";
    /*return "<div>Ének</div>" +
        "<span class='songButton'>Megnéz</span>";*/
}


SearchElement.prototype.SetName = function(name) {
    this.Name = name;
}