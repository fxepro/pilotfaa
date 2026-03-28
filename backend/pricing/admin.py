from django.contrib import admin

from .models import Price, PriceBook


admin.site.register(PriceBook)
admin.site.register(Price)
