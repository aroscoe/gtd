from django.conf.urls.defaults import *

from piston.resource import Resource

from api.handlers import ListHandler, ItemHandler

list = Resource(handler=ListHandler)
item = Resource(handler=ItemHandler)

urlpatterns = patterns('',
    url(r'^list/(?P<id>[^/]+)/', list, name="api_list"),
    url(r'^item/?$', item, name="api_item_create"),
    url(r'^item/(?P<id>[^/]+)/', item, name="api_item"),
)