from piston.handler import BaseHandler
from piston.utils import rc

from list.models import List, Item

class ListHandler(BaseHandler):
    model = List
    allowed_methods = ('GET',)
    fields = ('date', 'is_active', 'name', ('items', ('content', 'date', 'id',)))

class ItemHandler(BaseHandler):
    model = Item
    allowed_methods = ('GET', 'POST', 'DELETE',)
    
    def read(self, request, id):
        if request.GET.get('action', 'void') == 'delete':
            return super(ItemHandler, self).delete(request, id=id)
        return super(ItemHandler, self).read(request, id=id)
    
    def create(self, request):
        list_id = request.POST.get('list_id', False)
        if list_id:
            try:
                list = List.objects.get(pk=list_id)
            except List.DoesNotExist:
                return rc.NOT_FOUND
        else:
            return rc.BAD_REQUEST
        
        new_item = list.items.create()
        
        return {'id': new_item.id, 'date': new_item.date}
