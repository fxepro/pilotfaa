from django.core.management.base import BaseCommand, CommandError
from django.db import connection


class Command(BaseCommand):
    help = "Fail if any non-system tables exist in the public schema."

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT tablename
                FROM pg_tables
                WHERE schemaname = 'public'
                ORDER BY tablename
                """
            )
            rows = cursor.fetchall()

        public_tables = [row[0] for row in rows]

        if public_tables:
            table_list = ", ".join(public_tables)
            raise CommandError(
                f"Public schema contains tables: {table_list}. "
                "Move them into app-owned schemas."
            )

        self.stdout.write(self.style.SUCCESS("Public schema is empty."))
