from django.apps import AppConfig

class PilotfaaTutorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pilotfaa_tutor'
    verbose_name = 'PilotFAA — AI Tutor'

    def ready(self):
        import pilotfaa_tutor.signals  # noqa
