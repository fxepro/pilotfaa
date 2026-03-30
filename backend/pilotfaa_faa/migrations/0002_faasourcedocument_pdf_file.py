from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pilotfaa_faa', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='faasourcedocument',
            name='pdf_file',
            field=models.BinaryField(
                blank=True,
                null=True,
                help_text='PDF binary stored in database — upload via upload_pdf.py'
            ),
        ),
    ]
