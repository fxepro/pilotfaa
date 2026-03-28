from django.apps import AppConfig

class PilotfaaProgressConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pilotfaa_progress'
    verbose_name = 'PilotFAA — Learning Progress'

    def ready(self):
        import pilotfaa_progress.signals  # noqa
