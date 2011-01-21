from piston.handler import BaseHandler

from list.models import List

class ListHandler(BaseHandler):
    model = List
    allowed_methods = ('GET',)
    fields = ('date', 'is_active', 'name', 'items')
    
    @classmethod
    def items(cls, list):
        return list.items.all()
