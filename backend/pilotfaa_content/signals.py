"""
pilotfaa_content/signals.py
Keeps Course.total_lessons accurate when lessons are published/archived.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Lesson, Course


@receiver(post_save, sender=Lesson)
def update_course_total_lessons(sender, instance, **kwargs):
    """Recount published lessons for the parent course after any lesson save."""
    try:
        course = instance.chapter.module.course
        count  = Lesson.objects.filter(
            chapter__module__course=course, status='published'
        ).count()
        Course.objects.filter(id=course.id).update(total_lessons=count)
    except Exception:
        pass  # Never break saves due to signal errors
