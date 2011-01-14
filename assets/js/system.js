/* SYSTEM **************************************************/

goog.provide('gtd.Item');
goog.provide('gtd.createItems');

goog.require('goog.dom');


gtd.createItems = function(data, itemContainer){
    var items = [];
    for(var i=0; i<data.length; i++){
        var item = new gtd.Item(data[i], itemContainer);
        items.push(item)
        item.makeItemDom();
    }
    return items;
};

gtd.Item = function(data, itemContainer){
    this.content = data.content;
    this.date = data.date;
    this.parent = itemContainer;
};

gtd.Item.prototype.makeItemDom = function(){
    // Create DOM structure
    this.contentElement = goog.dom.createDom('p', null, this.content);
    
    // Build menu
    var menuItemDelete = goog.dom.createDom('li', 'btn-edit', goog.dom.createDom('a', {'href': '#'}, 'Delete'));
    var menu = goog.dom.createDom('ul', null, menuItemDelete);
    
    // Create Item
    var newItem = goog.dom.createDom('li', null, this.contentElement, menu);
    
    // Add Item to document
    this.parent.appendChild(newItem);
};
