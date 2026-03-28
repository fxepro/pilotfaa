from django.contrib import admin
from .models import FAASourceDocument

@admin.register(FAASourceDocument)
class FAASourceDocumentAdmin(admin.ModelAdmin):
    list_display  = ['short_code', 'publication_ref', 'version', 'effective_date', 'is_current']
    list_filter   = ['is_current', 'short_code']
    search_fields = ['short_code', 'publication_ref', 'full_title']
    ordering      = ['short_code', '-effective_date']