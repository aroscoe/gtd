from django.contrib import admin

from list.models import *

class ItemAdmin(admin.ModelAdmin):
    list_display = ('content', 'date', 'is_active')
    ordering = ('-date', 'is_active')

admin.site.register(List)
admin.site.register(Item, ItemAdmin)