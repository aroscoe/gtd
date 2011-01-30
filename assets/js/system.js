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

gtd.addItem = function(itemListElement){
    goog.net.XhrIo.send('/api/item/', function(e){
        var status = e.target.getStatus();
        if (status == 200) {
            var data = e.target.getResponseJson();
            var item = gtd.createItems([{'id': data.id, 'date': data.date}], itemListElement)[0];
            item.editItem();
        }
    }, 'POST', 'list_id='+gtd.settings.listId);
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
    goog.dom.removeNode(goog.dom.getElementByClass('txtbox-edit', this.itemElement));
    
    // Return item contents to DOM
    goog.style.showElement(this.contentElement, true);
    goog.dom.setProperties(this.itemElement, {'class': ''});
};

// Event Handler - Edit item
gtd.Item.prototype.editItem = function(){
    goog.style.showElement(this.contentElement, false);
    goog.dom.setProperties(this.itemElement, {'class': 'editing'});
    
    // Create edit input
    var content = this.content || '';
    var editInput = goog.dom.createDom('input', {'type': 'text', 'class': 'txtbox-edit', 'value': content});
    goog.dom.insertSiblingBefore(editInput, this.contentElement);
    editInput.focus();
    
    goog.events.listen(editInput, goog.events.EventType.KEYDOWN, function(e){
        
        // Save - 'Enter' key
        if (e.keyCode == 13) {
            var editInput = goog.dom.getElementByClass('txtbox-edit', this.itemElement);
            
            this.updateItem(editInput.value);
            this._removeEditItemDOM();
            
        // Cancel - 'Esc' key
        } else if (e.keyCode == 27) {
            this._removeEditItemDOM();
        }
        
    }, false, this);
};