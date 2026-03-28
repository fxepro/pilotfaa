from django.apps import AppConfig

class PilotfaaAssessmentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pilotfaa_assessments'
    verbose_name = 'PilotFAA — Assessments'

    def ready(self):
        import pilotfaa_assessments.signals  # noqa
