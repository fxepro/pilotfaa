"""
pilotfaa_progress/signals.py
Keeps Enrollment.progress_pct in sync after lesson completions.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import LessonCompletion, Enrollment
from pilotfaa_content.models import Lesson


@receiver(post_save, sender=LessonCompletion)
def update_enrollment_progress(sender, instance, **kwargs):
    """Recalculate progress_pct on the parent enrollment."""
    try:
        enrollment = instance.enrollment
        course     = enrollment.course

        total_lessons = Lesson.objects.filter(
            chapter__module__course=course, status='published'
        ).count()

        if total_lessons == 0:
            return

        done = LessonCompletion.objects.filter(
            enrollment=enrollment, completed=True
        ).count()

        pct = round((done / total_lessons) * 100)
        Enrollment.objects.filter(id=enrollment.id).update(progress_pct=pct)

    except Exception:
        pass
