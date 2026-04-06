# Move blog tables into PostgreSQL schema `blog`.
# Do NOT use top-level AlterModelTable with schema-qualified names — Django emits
# invalid SQL: RENAME TO "blog"."tablename" (PostgreSQL rejects that).
# RunSQL carries state via state_operations so only SET SCHEMA runs on the DB.

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0001_initial'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                CREATE SCHEMA IF NOT EXISTS blog;
                ALTER TABLE public.blog_category SET SCHEMA blog;
                ALTER TABLE public.blog_tag SET SCHEMA blog;
                ALTER TABLE public.blog_blogauthor SET SCHEMA blog;
                ALTER TABLE public.blog_blogpost SET SCHEMA blog;
                ALTER TABLE public.blog_blogpost_tags SET SCHEMA blog;
            """,
            reverse_sql="""
                ALTER TABLE blog.blog_blogpost_tags SET SCHEMA public;
                ALTER TABLE blog.blog_blogpost SET SCHEMA public;
                ALTER TABLE blog.blog_blogauthor SET SCHEMA public;
                ALTER TABLE blog.blog_tag SET SCHEMA public;
                ALTER TABLE blog.blog_category SET SCHEMA public;
                DROP SCHEMA IF EXISTS blog;
            """,
            state_operations=[
                migrations.AlterModelTable(name='category', table='blog.blog_category'),
                migrations.AlterModelTable(name='tag', table='blog.blog_tag'),
                migrations.AlterModelTable(name='blogauthor', table='blog.blog_blogauthor'),
                migrations.AlterModelTable(name='blogpost', table='blog.blog_blogpost'),
            ],
        ),
    ]
