from piston.handler import BaseHandler
from piston.utils import rc

from list.models import List, Item

class ListHandler(BaseHandler):
    model = List
    allowed_methods = ('GET',)
    fields = ('date', 'is_active', 'name', ('items', ('content', 'date', 'id',)))

class ItemHandler(BaseHandler):
    model = Item
    allowed_methods = ('GET', 'DELETE',)
    
    def read(self, request, id):
        if request.GET.get('action', 'void') == 'delete':
            return super(ItemHandler, self).delete(request, id=id)
        return super(ItemHandler, self).read(request, id=id)
