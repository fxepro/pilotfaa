from django.test import TestCase


class SiteSettingsSmokeTest(TestCase):
    def test_imports(self):
        from site_settings.models import SiteConfig
        self.assertTrue(SiteConfig)
