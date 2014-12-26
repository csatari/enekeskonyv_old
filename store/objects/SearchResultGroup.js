/**
 * Created by Albert on 2014.12.26..
 */
function SearchResultGroup(binding) {
    this.binding = binding;
    AbstractElement.apply(this,arguments);

    SearchResultGroup.prototype.groupArray = [];
    SearchResultGroup.prototype.groupTitle = new GroupTitle(".groupTitle","Teszt");
}
SearchResultGroup.prototype = Object.create(AbstractElement.prototype);
SearchResultGroup.prototype.constructor = SearchResultGroup;

SearchResultGroup.prototype.CssStructure = function() {
    $(this.binding).css({
        'z-index':2
    });
};

SearchResultGroup.prototype.CssVisual = function() {
    $(this.binding).css({
        'font-size':'20px',
        'background-color':'white'
    });
};

SearchResultGroup.prototype.ToHTML = function() {
    var htmlStr = "<div class='groupTitle'></div>" +
        "<div class='group'>";

    for(var i=0; i<this.groupArray.length;i++) {
        htmlStr = htmlStr.concat(this.groupArray[i].ToHTML());
    }

    htmlStr = htmlStr.concat("</div>");
    //htmlStr = htmlStr.concat("<div>Összes</div>");
    return htmlStr;
}

SearchResultGroup.prototype.Update = function() {
    $(this.binding).html(this.ToHTML());
    this.CssStructure();
    this.CssVisual();
    if(this.groupTitle!= null) {
        this.groupTitle.Update();
    }

    this.groupArray.forEach(function(element, index, array) {
        element.Update();
    });
    $(".group").masonry();
}

SearchResultGroup.prototype.Append = function(title) {
    var groupSong = new SearchElement(".groupSong"+(this.groupArray.length+1));
    groupSong.SetName(title);
    this.groupArray.push(groupSong);
}