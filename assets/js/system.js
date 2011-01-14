/* SYSTEM **************************************************/

goog.provide('gtd.Item');
goog.provide('gtd.createItems');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.Dialog');


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
    var optionDelete = goog.dom.createDom('a', {'href': '#'}, 'Delete');
    var menuItemDelete = goog.dom.createDom('li', 'btn-edit', optionDelete);
    var menu = goog.dom.createDom('ul', null, menuItemDelete);
    
    // Create Item
    var newItem = goog.dom.createDom('li', null, this.contentElement, menu);
    
    // Add Item to document
    this.parent.appendChild(newItem);
    
    // Listener - Delete item
    goog.events.listen(optionDelete, goog.events.EventType.CLICK, this.deleteItem, false, newItem);
};

// Event Handler - Delete item
gtd.Item.prototype.deleteItem = function(e){
    e.preventDefault();
    
    // Create dialog
    var dialog = new goog.ui.Dialog();
    dialog.setContent('<p>Are you sure you want to delete this item?</p>');
    dialog.setTitle('Warning');
    dialog.setBackgroundElementOpacity(0.1);
    dialog.setHasTitleCloseButton(false);
    
    // Configure dialog button set
    var buttonSet = new goog.ui.Dialog.ButtonSet();
    buttonSet.set('delete', 'Delete item');
    buttonSet.set('cancel', 'Cancel', true, true);
    dialog.setButtonSet(buttonSet);
    
    // Display dialog
    dialog.setVisible(true);
    
    // Listener - dialog
    goog.events.listen(dialog, goog.ui.Dialog.EventType.SELECT, function(e) {
        if (e.key == 'delete') {
            console.log(this);
            goog.dom.removeNode(this);
        }
    }, false, this);
};