from rest_framework import serializers
from .models import SiteConfig


class SiteConfigSerializer(serializers.ModelSerializer):
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True)

    class Meta:
        model = SiteConfig
        fields = [
            'id',
            'site_name',
            'site_description',
            'default_language',
            'default_theme',
            'session_timeout_minutes',
            'max_login_attempts',
            'require_strong_passwords',
            'enable_two_factor',
            'enable_email_verification',
            'enable_analytics',
            'enable_email_notifications',
            'enable_push_notifications',
            'enable_sms_notifications',
            'notification_email',
            'api_base_url',
            'api_rate_limit',
            'enable_cors',
            'enable_api_docs',
            'updated_by',
            'updated_by_username',
            'updated_at',
        ]
        read_only_fields = ['id', 'updated_by', 'updated_by_username', 'updated_at']
