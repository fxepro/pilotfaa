"""
pilotfaa_tutor/models.py
Full audit trail for every AI ground instructor interaction.
Every AI response has child MessageCitation rows — one per FAA source referenced.
"""
from django.db import models
from django.contrib.auth.models import User
from pilotfaa_content.models import Course, Lesson
from pilotfaa_progress.models import Enrollment
from pilotfaa_faa.models import FAASourceDocument


# ─── Enums ────────────────────────────────────────────────────────────────────

class MessageRole(models.TextChoices):
    SYSTEM    = 'system',    'System'
    USER      = 'user',      'User'
    ASSISTANT = 'assistant', 'Assistant'


class IntentType(models.TextChoices):
    CONCEPT_EXPLANATION = 'concept_explanation', 'Concept Explanation'
    REGULATION          = 'regulation',          'Regulation'
    EXAM_PREP           = 'exam_prep',           'Exam Prep'
    ORAL_PREP           = 'oral_prep',           'Oral Prep'
    COMPARISON          = 'comparison',          'Comparison'
    SUMMARY             = 'summary',             'Summary'
    QUIZ_REQUEST        = 'quiz_request',        'Quiz Request'
    NAVIGATION          = 'navigation',          'Navigation'
    OTHER               = 'other',               'Other'


class FeedbackRating(models.TextChoices):
    HELPFUL          = 'helpful',          'Helpful'
    NOT_HELPFUL      = 'not_helpful',      'Not Helpful'
    INCORRECT        = 'incorrect',        'Incorrect'
    MISSING_CITATION = 'missing_citation', 'Missing Citation'


class StudyMode(models.TextChoices):
    LEARN     = 'learn',     'Learn'
    REVIEW    = 'review',    'Review'
    CRAM      = 'cram',      'Cram'
    ORAL_PREP = 'oral_prep', 'Oral Prep'
    MOCK_EXAM = 'mock_exam', 'Mock Exam'


# ─── TutorSession ─────────────────────────────────────────────────────────────

class TutorSession(models.Model):
    user          = models.ForeignKey(User, on_delete=models.CASCADE,
                        related_name='pilotfaa_tutor_sessions')
    course        = models.ForeignKey(Course, on_delete=models.RESTRICT,
                        related_name='tutor_sessions')
    lesson        = models.ForeignKey(Lesson, null=True, blank=True,
                        on_delete=models.SET_NULL, related_name='tutor_sessions')
    enrollment    = models.ForeignKey(Enrollment, on_delete=models.CASCADE,
                        related_name='tutor_sessions')
    study_mode    = models.CharField(max_length=20, choices=StudyMode.choices,
                        default=StudyMode.LEARN, db_index=True)
    message_count = models.PositiveIntegerField(default=0)
    started_at    = models.DateTimeField(auto_now_add=True, db_index=True)
    ended_at      = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'pilotfaa_tutor_session'
        indexes  = [
            models.Index(fields=['user', '-started_at']),
            models.Index(fields=['enrollment']),
        ]
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user.username} tutor session {self.id}"


# ─── TutorMessage ─────────────────────────────────────────────────────────────

class TutorMessage(models.Model):
    """
    grounded=False AND role=assistant → admin review queue alert.
    system messages stored for audit, hidden from student UI.
    """
    session          = models.ForeignKey(TutorSession, on_delete=models.CASCADE,
                           related_name='messages')
    role             = models.CharField(max_length=20, choices=MessageRole.choices,
                           db_index=True)
    content          = models.TextField()
    intent_type      = models.CharField(max_length=30, choices=IntentType.choices,
                           blank=True, db_index=True)
    confidence_score = models.DecimalField(max_digits=4, decimal_places=3,
                           null=True, blank=True,
                           help_text="0.000–1.000. NULL for user messages.")
    grounded         = models.BooleanField(null=True, blank=True, db_index=True,
                           help_text="True = grounded in approved FAA sources. NULL for user msgs.")
    prompt_tokens    = models.PositiveIntegerField(null=True, blank=True)
    completion_tokens = models.PositiveIntegerField(null=True, blank=True)
    ai_model         = models.CharField(max_length=80, blank=True,
                           help_text="e.g. claude-opus-4-5")
    created_at       = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = 'pilotfaa_tutor_message'
        indexes  = [
            models.Index(fields=['session', 'created_at']),
            models.Index(fields=['intent_type']),
        ]
        ordering = ['created_at']

    def __str__(self):
        return f"[{self.role}] {self.content[:60]}"


# ─── MessageCitation ──────────────────────────────────────────────────────────

class MessageCitation(models.Model):
    """
    One row per FAA source referenced in an AI response.
    extracted_span = actual FAA text that grounded the answer.
    Store for compliance audit — do not display verbatim to students.
    """
    message          = models.ForeignKey(TutorMessage, on_delete=models.CASCADE,
                           related_name='citations')
    source_document  = models.ForeignKey(FAASourceDocument, null=True, blank=True,
                           on_delete=models.SET_NULL, related_name='citations')
    source_doc_ref   = models.CharField(max_length=100,
                           help_text="Short ref e.g. PHAK FAA-H-8083-25C")
    chapter_ref      = models.CharField(max_length=40, blank=True,
                           help_text="e.g. Ch.5, Part 61")
    section_ref      = models.CharField(max_length=100, blank=True)
    page_ref         = models.CharField(max_length=20, blank=True,
                           help_text="e.g. p.5-12, §91.155")
    extracted_span   = models.TextField(blank=True,
                           help_text="Exact FAA text passage that grounded this citation")
    sort_order       = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'pilotfaa_message_citation'
        indexes  = [
            models.Index(fields=['message', 'sort_order']),
            models.Index(fields=['source_document']),
        ]
        ordering = ['sort_order']

    def __str__(self):
        return f"{self.source_doc_ref} {self.page_ref}"


# ─── MessageFeedback ──────────────────────────────────────────────────────────

class MessageFeedback(models.Model):
    """
    Student thumbs-up/down on AI responses.
    incorrect / missing_citation → admin review task.
    """
    message    = models.ForeignKey(TutorMessage, on_delete=models.CASCADE,
                     related_name='feedback')
    user       = models.ForeignKey(User, on_delete=models.CASCADE,
                     related_name='pilotfaa_message_feedback')
    rating     = models.CharField(max_length=20, choices=FeedbackRating.choices,
                     db_index=True)
    comment    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table        = 'pilotfaa_message_feedback'
        unique_together = [('message', 'user')]
        indexes         = [models.Index(fields=['rating'])]

    def __str__(self):
        return f"{self.user.username} → {self.rating} on msg {self.message_id}"
