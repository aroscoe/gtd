from django.db import models

class List(models.Model):
    name = models.CharField(max_length=150, blank=True)
    date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=1)
    items = models.ManyToManyField('Item')
    
    def __unicode__(self):
        return self.name if (self.name != '') else 'Unnamed'
    
    class Admin:
        pass

class Item(models.Model):
    content = models.TextField(blank=True)
    date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=1)
    
    def __unicode__(self):
        return self.content[0:25] if (self.content != '') else 'Blank'
    
    class Admin:
        pass