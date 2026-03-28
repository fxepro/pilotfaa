"""
App configuration for Database Management
"""

from django.apps import AppConfig


class DbManagementConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'db_management'
    verbose_name = 'Database Management'
