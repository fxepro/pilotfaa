from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0023_userprofile_requested_demo'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='role',
            field=models.CharField(
                choices=[
                    ('admin', 'Admin'),
                    ('agency', 'Agency'),
                    ('executive', 'Executive'),
                    ('director', 'Director'),
                    ('manager', 'Manager'),
                    ('analyst', 'Analyst'),
                    ('auditor', 'Auditor'),
                    ('viewer', 'Viewer'),
                    ('student', 'Student'),
                ],
                default='viewer',
                max_length=20,
            ),
        ),
    ]
