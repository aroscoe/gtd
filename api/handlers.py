from piston.handler import BaseHandler
from piston.utils import rc

from list.models import List, Item

class ListHandler(BaseHandler):
    model = List
    allowed_methods = ('GET',)
    fields = ('date', 'is_active', 'name', ('items', ('content', 'date', 'id',)))

class ItemHandler(BaseHandler):
    model = Item
    allowed_methods = ('GET', 'POST', 'PUT', 'DELETE',)
    
    def create(self, request, id=None):
        if not id:
            list_id = request.POST.get('list_id', False)
            if list_id:
                try:
                    list = List.objects.get(pk=list_id)
                except List.DoesNotExist:
                    return rc.NOT_FOUND
            else:
                return rc.BAD_REQUEST
            
            content = request.POST.get('content', '')
            
            new_item = list.items.create(content=content)
            return {'id': new_item.id, 'date': new_item.date, 'content': new_item.content}
        else:
            action = request.GET.get('action', 'void')
            if action == 'update':
                self.update(request, id)
            elif action == 'delete':
                return super(ItemHandler, self).delete(request, id=id)
    
    def update(self, request, id):
        item = Item.objects.get(pk=id)
        if request.method == 'POST':
            item.content = request.POST.get('content')
        else:
            item.content = request.PUT.get('content')
        item.save()
        return item