from django.db import migrations

FORWARD_SQL = """
CREATE SCHEMA IF NOT EXISTS products;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS pricing;
CREATE SCHEMA IF NOT EXISTS purchasing;
CREATE SCHEMA IF NOT EXISTS invoicing;
"""

REVERSE_SQL = """
-- Intentionally left empty — schemas are not dropped on reverse.
SELECT 1;
"""


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_create_app_schemas"),
    ]
    operations = [
        migrations.RunSQL(FORWARD_SQL, REVERSE_SQL),
    ]
