from django.contrib import admin
from .models import SiteConfig


@admin.register(SiteConfig)
class SiteConfigAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return not SiteConfig.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False

    fieldsets = (
        ('General Settings', {
            'fields': ('site_name', 'site_description', 'default_language')
        }),
        ('Theme Settings', {
            'fields': ('default_theme',),
            'description': 'Light/dark/auto appearance (brand colors are fixed in the frontend).'
        }),
        ('Security Settings', {
            'fields': (
                'session_timeout_minutes',
                'max_login_attempts',
                'require_strong_passwords',
                'enable_two_factor',
                'enable_email_verification'
            )
        }),
        ('Notification Settings', {
            'fields': (
                'enable_email_notifications',
                'enable_push_notifications',
                'enable_sms_notifications',
                'notification_email'
            )
        }),
        ('API Settings', {
            'fields': (
                'api_base_url',
                'api_rate_limit',
                'enable_cors',
                'enable_api_docs'
            )
        }),
        ('Metadata', {
            'fields': ('updated_by', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ['updated_by', 'updated_at']

    def save_model(self, request, obj, form, change):
        obj.updated_by = request.user
        super().save_model(request, obj, form, change)
