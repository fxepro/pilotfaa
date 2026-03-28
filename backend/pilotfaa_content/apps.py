from django.apps import AppConfig

class PilotfaaContentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pilotfaa_content'
    verbose_name = 'PilotFAA — Course Content'

    def ready(self):
        import pilotfaa_content.signals  # noqa
