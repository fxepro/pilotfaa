"""
pilotfaa_assessments/models.py
Quiz engine: QuestionBank → Question → QuizAttempt → QuestionResponse
TopicMastery is a computed rollup — updated by signal, never aggregated at query time.
"""
from django.db import models
from django.contrib.auth.models import User
from pilotfaa_content.models import Course, Chapter
from pilotfaa_progress.models import Enrollment


# ─── Enums ────────────────────────────────────────────────────────────────────

class BankType(models.TextChoices):
    CHAPTER     = 'chapter',     'Chapter Quiz'
    MOCK_EXAM   = 'mock_exam',   'Mock Exam'
    REMEDIATION = 'remediation', 'Remediation'
    CUSTOM      = 'custom',      'Custom'


class QuestionType(models.TextChoices):
    SINGLE_CHOICE   = 'single_choice',   'Single Choice'
    MULTIPLE_CHOICE = 'multiple_choice', 'Multiple Choice'
    TRUE_FALSE      = 'true_false',      'True / False'
    MATCHING        = 'matching',        'Matching'
    SCENARIO        = 'scenario',        'Scenario'
    ORAL_PREP       = 'oral_prep',       'Oral Prep'


class QuestionDifficulty(models.TextChoices):
    EASY   = 'easy',   'Easy'
    MEDIUM = 'medium', 'Medium'
    HARD   = 'hard',   'Hard'


class QuestionStatus(models.TextChoices):
    DRAFT   = 'draft',   'Draft'
    REVIEW  = 'review',  'Review'
    ACTIVE  = 'active',  'Active'
    RETIRED = 'retired', 'Retired'


class AttemptType(models.TextChoices):
    CHAPTER_QUIZ = 'chapter_quiz', 'Chapter Quiz'
    MOCK_EXAM    = 'mock_exam',    'Mock Exam'
    REMEDIATION  = 'remediation',  'Remediation'
    CUSTOM       = 'custom',       'Custom'


# ─── QuestionBank ─────────────────────────────────────────────────────────────

class QuestionBank(models.Model):
    course               = models.ForeignKey(Course, on_delete=models.CASCADE,
                               related_name='question_banks')
    chapter              = models.ForeignKey(Chapter, null=True, blank=True,
                               on_delete=models.SET_NULL, related_name='question_banks')
    name                 = models.CharField(max_length=200)
    bank_type            = models.CharField(max_length=20, choices=BankType.choices,
                               default=BankType.CHAPTER, db_index=True)
    question_count       = models.PositiveIntegerField(default=0,
                               help_text="Denormalized — updated by signal")
    time_limit_seconds   = models.PositiveIntegerField(null=True, blank=True,
                               help_text="NULL = untimed")
    pass_threshold_pct   = models.PositiveIntegerField(default=70)
    is_active            = models.BooleanField(default=True, db_index=True)
    created_at           = models.DateTimeField(auto_now_add=True)
    updated_at           = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pilotfaa_question_bank'
        indexes  = [models.Index(fields=['course', 'bank_type', 'is_active'])]

    def __str__(self):
        return self.name


# ─── Question ─────────────────────────────────────────────────────────────────

class Question(models.Model):
    """
    options: [{letter, text, is_correct}, ...]
    rationale_source_ref is NOT NULL — a question without citation cannot go active.
    """
    bank                  = models.ForeignKey(QuestionBank, on_delete=models.CASCADE,
                                related_name='questions')
    chapter               = models.ForeignKey(Chapter, null=True, blank=True,
                                on_delete=models.SET_NULL, related_name='questions')
    question_text         = models.TextField()
    question_type         = models.CharField(max_length=20, choices=QuestionType.choices,
                                default=QuestionType.SINGLE_CHOICE, db_index=True)
    options               = models.JSONField(default=list,
                                help_text='[{letter, text, is_correct}, ...]')
    correct_letter        = models.CharField(max_length=4, blank=True,
                                help_text="Single-choice correct answer. Blank for other types.")
    rationale             = models.TextField()
    rationale_source_ref  = models.CharField(max_length=200,
                                help_text="Full citation e.g. PHAK FAA-H-8083-25C · Ch.5 p.5-12")
    phak_page             = models.CharField(max_length=20, blank=True)
    acs_task_code         = models.CharField(max_length=20, blank=True, db_index=True,
                                help_text="Primary ACS task e.g. PA.I.B.K1")
    difficulty            = models.CharField(max_length=10, choices=QuestionDifficulty.choices,
                                default=QuestionDifficulty.MEDIUM, db_index=True)
    exam_relevant         = models.BooleanField(default=True, db_index=True)
    status                = models.CharField(max_length=10, choices=QuestionStatus.choices,
                                default=QuestionStatus.DRAFT, db_index=True)
    times_answered        = models.BigIntegerField(default=0,
                                help_text="Denormalized — updated by signal")
    times_correct         = models.BigIntegerField(default=0,
                                help_text="Denormalized — updated by signal")
    created_by            = models.ForeignKey(User, null=True, blank=True,
                                on_delete=models.SET_NULL, related_name='created_questions')
    created_at            = models.DateTimeField(auto_now_add=True)
    updated_at            = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pilotfaa_question'
        indexes  = [
            models.Index(fields=['bank', 'status']),
            models.Index(fields=['chapter', 'difficulty']),
        ]

    def __str__(self):
        return self.question_text[:80]


# ─── QuizAttempt ──────────────────────────────────────────────────────────────

class QuizAttempt(models.Model):
    user             = models.ForeignKey(User, on_delete=models.CASCADE,
                           related_name='pilotfaa_quiz_attempts')
    bank             = models.ForeignKey(QuestionBank, on_delete=models.RESTRICT,
                           related_name='attempts')
    enrollment       = models.ForeignKey(Enrollment, on_delete=models.CASCADE,
                           related_name='quiz_attempts')
    attempt_type     = models.CharField(max_length=20, choices=AttemptType.choices,
                           default=AttemptType.CHAPTER_QUIZ, db_index=True)
    score_pct        = models.PositiveIntegerField(null=True, blank=True,
                           help_text="NULL until completed")
    correct_count    = models.PositiveIntegerField(default=0)
    total_questions  = models.PositiveIntegerField(default=0)
    time_seconds     = models.PositiveIntegerField(null=True, blank=True)
    passed           = models.BooleanField(null=True, blank=True, db_index=True,
                           help_text="NULL until completed")
    completed        = models.BooleanField(default=False, db_index=True)
    started_at       = models.DateTimeField(auto_now_add=True)
    completed_at     = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'pilotfaa_quiz_attempt'
        indexes  = [
            models.Index(fields=['user', '-completed_at']),
            models.Index(fields=['enrollment', 'attempt_type']),
        ]
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user.username} attempt {self.id} — {self.score_pct or '?'}%"


# ─── QuestionResponse ─────────────────────────────────────────────────────────

class QuestionResponse(models.Model):
    """
    Immutable once written. Insert a new QuizAttempt for retakes.
    Post-save signal: update Question counters + upsert TopicMastery.
    """
    attempt          = models.ForeignKey(QuizAttempt, on_delete=models.CASCADE,
                           related_name='responses')
    question         = models.ForeignKey(Question, on_delete=models.RESTRICT,
                           related_name='responses')
    selected_letter  = models.CharField(max_length=4, blank=True,
                           help_text="NULL/blank if skipped")
    selected_letters = models.JSONField(null=True, blank=True,
                           help_text="Array for multiple_choice")
    is_correct       = models.BooleanField(default=False, db_index=True)
    time_seconds     = models.PositiveIntegerField(null=True, blank=True)
    answered_at      = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pilotfaa_question_response'
        indexes  = [
            models.Index(fields=['attempt']),
            models.Index(fields=['question', 'is_correct']),
        ]

    def __str__(self):
        return f"Response {self.id} — {'✓' if self.is_correct else '✗'}"


# ─── TopicMastery ─────────────────────────────────────────────────────────────

class TopicMastery(models.Model):
    """
    Materialized mastery per user per chapter (+ACS task).
    Updated by signal after every QuestionResponse save.
    NEVER aggregate from QuestionResponse at query time — always read here.
    is_weak = mastery_pct < 70 AND attempts_count >= 3 (app-layer threshold).
    """
    user               = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='pilotfaa_topic_mastery')
    chapter            = models.ForeignKey(Chapter, on_delete=models.CASCADE,
                             related_name='topic_mastery')
    acs_task_code      = models.CharField(max_length=20, blank=True, db_index=True,
                             help_text="Blank = chapter-level rollup row")
    attempts_count     = models.PositiveIntegerField(default=0)
    correct_count      = models.PositiveIntegerField(default=0)
    mastery_pct        = models.DecimalField(max_digits=5, decimal_places=2,
                             default=0.00, db_index=True)
    is_weak            = models.BooleanField(default=False, db_index=True)
    last_attempted_at  = models.DateTimeField(null=True, blank=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table        = 'pilotfaa_topic_mastery'
        unique_together = [('user', 'chapter', 'acs_task_code')]
        indexes         = [
            models.Index(fields=['user', 'is_weak']),
            models.Index(fields=['user', 'mastery_pct']),
        ]

    def __str__(self):
        label = self.acs_task_code or 'chapter'
        return f"{self.user.username} › {self.chapter} › {label} — {self.mastery_pct}%"
