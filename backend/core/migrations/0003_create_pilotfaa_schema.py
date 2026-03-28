from django.db import migrations


FORWARD_SQL = """
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Create the pilotfaa schema
  CREATE SCHEMA IF NOT EXISTS pilotfaa;

  -- Move all pilotfaa_* tables from public into the pilotfaa schema.
  -- This runs AFTER the pilotfaa app migrations have created the tables in public,
  -- so it will only move tables that actually exist.
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename LIKE 'pilotfaa_%'
  LOOP
    EXECUTE format('ALTER TABLE public.%I SET SCHEMA pilotfaa', r.tablename);
  END LOOP;
END $$;
"""

REVERSE_SQL = """
DO $$
DECLARE
  r RECORD;
BEGIN
  -- Move pilotfaa_* tables back to public
  FOR r IN
    SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'pilotfaa'
      AND tablename LIKE 'pilotfaa_%'
  LOOP
    EXECUTE format('ALTER TABLE pilotfaa.%I SET SCHEMA public', r.tablename);
  END LOOP;

  DROP SCHEMA IF EXISTS pilotfaa;
END $$;
"""


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0002_create_commerce_schemas"),
        # Ensure all pilotfaa_* tables exist in public before moving them
        ("pilotfaa_assessments", "0001_initial"),
        ("pilotfaa_tutor", "0001_initial"),
    ]

    operations = [
        migrations.RunSQL(FORWARD_SQL, REVERSE_SQL),
    ]
