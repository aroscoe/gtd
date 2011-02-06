# encoding: utf-8
import datetime
from south.db import db
from south.v2 import DataMigration
from django.db import models

class Migration(DataMigration):

    def forwards(self, orm):
        import os.path
        from django.conf import settings
        from django.core.management import call_command
        fixture = os.path.join(settings.PROJECT_ROOT, 'list/fixtures/test_list.json')
        call_command("loaddata", fixture)
    
    
    def backwards(self, orm):
        "Write your backwards methods here."
    
    complete_apps = ['list']
