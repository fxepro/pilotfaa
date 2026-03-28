from django.contrib import admin

from .models import InventoryLevel, InventoryLocation, InventoryMovement


admin.site.register(InventoryLocation)
admin.site.register(InventoryLevel)
admin.site.register(InventoryMovement)
