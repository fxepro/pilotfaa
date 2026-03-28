from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('site_settings', '0002_add_enable_analytics'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='siteconfig',
            name='active_palette',
        ),
        migrations.RemoveField(
            model_name='siteconfig',
            name='active_typography',
        ),
        migrations.DeleteModel(
            name='TypographyPreset',
        ),
        migrations.DeleteModel(
            name='ThemePalette',
        ),
    ]
