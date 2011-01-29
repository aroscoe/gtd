/* SYSTEM **************************************************/

goog.provide('gtd.settings');
goog.provide('gtd.Item');
goog.provide('gtd.createItems');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.ui.Dialog');
goog.require('goog.net.XhrIo');

gtd.settings = {
    'listId': '1'
}

gtd.createItems = function(data, itemContainer){
    var items = [];
    for(var i=0; i<data.length; i++){
        var item = new gtd.Item(data[i], itemContainer);
        items.push(item);
        item.makeItemDom();
    }
    return items;
};

gtd.Item = function(data, itemContainer){
    this.id = data.id;
    this.content = data.content;
    this.date = data.date;
    this.parent = itemContainer;
};

gtd.Item.prototype.makeItemDom = function(){
    // Create DOM structure
    this.contentElement = goog.dom.createDom('p', null, this.content);
    var optionCheckBox = goog.dom.createDom('a', {'href': '#', 'class': 'btn-checkbox'}, 'Check');
    var optionDelete = goog.dom.createDom('a', {'href': '#', 'class': 'btn-delete'}, 'Delete');
    var itemWrapper = goog.dom.createDom('div', 'cf wrapper', optionCheckBox, this.contentElement, optionDelete);
    this.itemElement = goog.dom.createDom('li', null, itemWrapper);
    
    // Add Item to document
    this.parent.appendChild(this.itemElement);
    
    // Listener - Delete item
    goog.events.listen(optionDelete, goog.events.EventType.CLICK, this.deleteItem, false, this);
    
    // Listener - Edit item
    goog.events.listen(this.contentElement, goog.events.EventType.DBLCLICK, this.editItem, false, this);
};

// Event Handler - Delete item
gtd.Item.prototype.deleteItem = function(e){
    e.preventDefault();
    
    // Create dialog
    var dialog = new goog.ui.Dialog();
    dialog.setContent('<p>Are you sure you want to delete this item?</p>');
    dialog.setTitle('Warning');
    dialog.setBackgroundElementOpacity(0.4);
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
            var itemElement = this.itemElement;
            var url = '/api/item/'+this.id+'/?action=delete';
            goog.net.XhrIo.send(url, function(e){
                if (e.target.getStatus() == 204) {
                    goog.dom.removeNode(itemElement);
                }
            }, 'POST');
        }
        // Remove dialog from DOM
        dialog.disposeInternal();
    }, false, this);
};

gtd.Item.prototype.updateItem = function(text){
    var content = this.content;
    var contentElement = this.contentElement;
    var url = '/api/item/'+this.id+'/?action=update';
    
    goog.net.XhrIo.send(url, function(e){ 
        if (e.target.getStatus() == 200) {
            content = text;
            contentElement.innerText = content;
        }
    }, 'POST', 'content='+text);
    
};

gtd.Item.prototype._removeEditItemDOM = function(){
    // Remove edit components
    goog.dom.removeNode(goog.dom.getElementByClass('edit-item', this.itemElement));
    goog.dom.removeNode(goog.dom.getElementByClass('menu-edit', this.itemElement));
    
    // Return item contents to DOM
    goog.style.showElement(this.contentElement, true);
    goog.style.showElement(this.contentElement.nextSibling, true);
};

// Event Handler - Edit item
gtd.Item.prototype.editItem = function(){
    goog.style.showElement(this.contentElement, false);
    goog.style.showElement(this.contentElement.nextSibling, false);
    
    // Create edit input
    var editInput = goog.dom.createDom('input', {'type': 'text', 'class': 'edit-item'}, this.content);
    goog.dom.insertSiblingBefore(editInput, this.contentElement);
    editInput.focus();
    
    // Change menu items
    var optionSave = goog.dom.createDom('a', {'href': '#'}, 'Save');
    var menuItemSave = goog.dom.createDom('li', {'class': 'btn-save'}, optionSave);
    var optionCancel = goog.dom.createDom('a', {'href': '#'}, 'Cancel')
    var menuItemCancel = goog.dom.createDom('li', {'class': 'btn-cancel'}, optionCancel);
    var editMenu = goog.dom.createDom('ul', {'class': 'menu-edit'}, menuItemSave, menuItemCancel);
    this.contentElement.parentNode.appendChild(editMenu);
    
    // Listener - Cancel
    goog.events.listen(optionCancel, goog.events.EventType.CLICK, function(e){
        e.preventDefault();
        this._removeEditItemDOM();
    }, false, this);
    
    // Listener - Save
    goog.events.listen(optionSave, goog.events.EventType.CLICK, function(e){
        e.preventDefault();
        
        var editInput = goog.dom.getElementByClass('edit-item', this.itemElement);
        
        this.updateItem(editInput.value);
        this._removeEditItemDOM();
    }, false, this);
};