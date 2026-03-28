"""
pilotfaa_assessments/signals.py
Keeps QuestionBank.question_count accurate when questions change status.
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Question, QuestionBank


@receiver(post_save, sender=Question)
def update_bank_question_count(sender, instance, **kwargs):
    try:
        count = Question.objects.filter(
            bank=instance.bank, status='active'
        ).count()
        QuestionBank.objects.filter(id=instance.bank_id).update(question_count=count)
    except Exception:
        pass
