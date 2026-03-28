from django.db import migrations


FORWARD_SQL = """
DO $$
DECLARE
  mapping RECORD;
BEGIN
  FOR mapping IN SELECT * FROM (VALUES
    ('products'),
    ('inventory'),
    ('pricing'),
    ('purchasing'),
    ('invoicing')
  ) AS s(schema_name)
  LOOP
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', mapping.schema_name);
  END LOOP;
END $$;
"""

REVERSE_SQL = """
DO $$
DECLARE
  mapping RECORD;
BEGIN
  FOR mapping IN SELECT * FROM (VALUES
    ('products'),
    ('inventory'),
    ('pricing'),
    ('purchasing'),
    ('invoicing')
  ) AS s(schema_name)
  LOOP
    EXECUTE format('DROP SCHEMA IF EXISTS %I CASCADE', mapping.schema_name);
  END LOOP;
END $$;
"""


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0001_create_app_schemas"),
    ]

    operations = [
        migrations.RunSQL(FORWARD_SQL, REVERSE_SQL),
    ]
