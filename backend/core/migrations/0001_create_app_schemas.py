from django.db import migrations

FORWARD_SQL = """
CREATE SCHEMA IF NOT EXISTS core;
CREATE SCHEMA IF NOT EXISTS users;
CREATE SCHEMA IF NOT EXISTS financials;
CREATE SCHEMA IF NOT EXISTS emails;
CREATE SCHEMA IF NOT EXISTS multilocation;
CREATE SCHEMA IF NOT EXISTS multilanguage;
CREATE SCHEMA IF NOT EXISTS site_settings;
CREATE SCHEMA IF NOT EXISTS db_management;
CREATE SCHEMA IF NOT EXISTS blog;
CREATE SCHEMA IF NOT EXISTS audit_reports;
CREATE SCHEMA IF NOT EXISTS api_monitoring;
"""

REVERSE_SQL = """
-- Intentionally left empty — schemas are not dropped on reverse
-- to avoid accidental data loss. Drop manually if needed.
SELECT 1;
"""


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.RunSQL(FORWARD_SQL, REVERSE_SQL),
    ]
