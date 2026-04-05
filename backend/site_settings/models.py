from django.db import models
from django.contrib.auth.models import User

SCHEMA = "site_settings"

def schema_table(table):
    return f'{SCHEMA}"."{table}'



class SiteConfig(models.Model):
    """
    Singleton model for site-wide configuration.
    Only one instance should exist.
    """

    THEME_CHOICES = [
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('auto', 'Auto (System)'),
    ]

    LANGUAGE_CHOICES = [
        ('en', 'English'),
        ('es', 'Spanish'),
        ('fr', 'French'),
    ]

    # General Settings
    site_name = models.CharField(
        max_length=100,
        default='PageRodeo',
        help_text='Site name displayed in header and emails'
    )
    site_description = models.TextField(
        default='A comprehensive web performance monitoring and analysis platform',
        help_text='Site description for meta tags'
    )
    default_language = models.CharField(
        max_length=5,
        choices=LANGUAGE_CHOICES,
        default='en',
        help_text='Default language for the application'
    )

    # Theme Settings (light/dark mode only — dynamic palette/typography removed)
    default_theme = models.CharField(
        max_length=10,
        choices=THEME_CHOICES,
        default='light',
        help_text='Default theme mode (light/dark/auto)'
    )

    # Security Settings
    session_timeout_minutes = models.IntegerField(
        default=30,
        help_text='Session timeout in minutes'
    )
    max_login_attempts = models.IntegerField(
        default=5,
        help_text='Maximum failed login attempts before lockout'
    )
    require_strong_passwords = models.BooleanField(
        default=True,
        help_text='Enforce password complexity requirements'
    )
    enable_two_factor = models.BooleanField(
        default=False,
        help_text='Require 2FA for admin accounts'
    )
    enable_email_verification = models.BooleanField(
        default=False,
        help_text='Require email verification on registration'
    )

    # Notification Settings
    enable_email_notifications = models.BooleanField(
        default=True,
        help_text='Send notifications via email'
    )
    enable_push_notifications = models.BooleanField(
        default=True,
        help_text='Send browser push notifications'
    )
    enable_sms_notifications = models.BooleanField(
        default=False,
        help_text='Send notifications via SMS'
    )
    notification_email = models.EmailField(
        default='admin@adminrodeo.com',
        help_text='Email address for system notifications'
    )

    # API Settings
    api_base_url = models.URLField(
        default='http://localhost:8000',
        help_text='Base URL for API endpoints'
    )
    api_rate_limit = models.IntegerField(
        default=1000,
        help_text='API rate limit (requests per minute)'
    )
    enable_cors = models.BooleanField(
        default=True,
        help_text='Allow cross-origin requests'
    )
    enable_api_docs = models.BooleanField(
        default=True,
        help_text='Expose API documentation endpoint'
    )

    # Analytics Settings
    enable_analytics = models.BooleanField(
        default=False,
        help_text='Enable client-side analytics (PostHog) in production'
    )

    # Metadata
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='config_updates'
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = schema_table("site_settings_siteconfig")
        verbose_name = 'Site Configuration'
        verbose_name_plural = 'Site Configuration'

    def __str__(self):
        return f"{self.site_name} Configuration"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_config(cls):
        """Get or create the singleton config instance"""
        config, created = cls.objects.get_or_create(pk=1)
        return config
