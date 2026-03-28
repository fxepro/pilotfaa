from django.db import migrations


FORWARD_SQL = """
DO $$
DECLARE
  mapping RECORD;
  r RECORD;
BEGIN
  -- Create schemas for existing apps
  FOR mapping IN SELECT * FROM (VALUES
    ('core'),
    ('users'),
    ('financials'),
    ('multilocation'),
    ('multilanguage'),
    ('emails'),
    ('site_settings'),
    ('audit_reports'),
    ('api_monitoring'),
    ('blog'),
    ('db_management')
  ) AS s(schema_name)
  LOOP
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', mapping.schema_name);
  END LOOP;

  -- Move app tables by prefix into their schemas
  FOR mapping IN SELECT * FROM (VALUES
    ('users','users_%'),
    ('financials','financials_%'),
    ('multilocation','multilocation_%'),
    ('multilanguage','multilanguage_%'),
    ('emails','emails_%'),
    ('site_settings','site_settings_%'),
    ('audit_reports','audit_reports_%'),
    ('api_monitoring','api_monitoring_%'),
    ('blog','blog_%'),
    ('db_management','db_management_%')
  ) AS m(schema_name, prefix)
  LOOP
    FOR r IN
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename LIKE mapping.prefix
    LOOP
      EXECUTE format('ALTER TABLE public.%I SET SCHEMA %I', r.tablename, mapping.schema_name);
    END LOOP;
  END LOOP;

  -- Move core/system tables into core schema
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND (
        tablename LIKE 'auth_%'
        OR tablename LIKE 'django_%'
        OR tablename LIKE 'admin_%'
        OR tablename LIKE 'core_%'
        OR tablename LIKE 'auditlog_%'
        OR tablename LIKE 'actstream_%'
        OR tablename LIKE 'drf_spectacular_%'
      )
  LOOP
    EXECUTE format('ALTER TABLE public.%I SET SCHEMA core', r.tablename);
  END LOOP;
END $$;
"""

REVERSE_SQL = """
DO $$
DECLARE
  mapping RECORD;
  r RECORD;
BEGIN
  -- Move app tables back to public
  FOR mapping IN SELECT * FROM (VALUES
    ('users','users_%'),
    ('financials','financials_%'),
    ('multilocation','multilocation_%'),
    ('multilanguage','multilanguage_%'),
    ('emails','emails_%'),
    ('site_settings','site_settings_%'),
    ('audit_reports','audit_reports_%'),
    ('api_monitoring','api_monitoring_%'),
    ('blog','blog_%'),
    ('db_management','db_management_%')
  ) AS m(schema_name, prefix)
  LOOP
    FOR r IN
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = mapping.schema_name
        AND tablename LIKE mapping.prefix
    LOOP
      EXECUTE format('ALTER TABLE %I.%I SET SCHEMA public', mapping.schema_name, r.tablename);
    END LOOP;
  END LOOP;

  -- Move core/system tables back to public
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'core'
      AND (
        tablename LIKE 'auth_%'
        OR tablename LIKE 'django_%'
        OR tablename LIKE 'admin_%'
        OR tablename LIKE 'core_%'
        OR tablename LIKE 'auditlog_%'
        OR tablename LIKE 'actstream_%'
        OR tablename LIKE 'drf_spectacular_%'
      )
  LOOP
    EXECUTE format('ALTER TABLE core.%I SET SCHEMA public', r.tablename);
  END LOOP;
END $$;
"""


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.RunSQL(FORWARD_SQL, REVERSE_SQL),
    ]
