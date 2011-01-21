from django.conf.urls.defaults import *

from piston.resource import Resource

from api.handlers import ListHandler

list = Resource(handler=ListHandler)

urlpatterns = patterns('',
    url(r'^list/(?P<id>[^/]+)/', list, name="api_list"),
)