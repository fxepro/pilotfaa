"""
pilotfaa_progress/models.py
Tracks every student's learning activity.
FK to Django's auth.User (integer PK) — matches the admin platform.
"""
from django.db import models
from django.contrib.auth.models import User
from pilotfaa_content.models import Course, Lesson


class EnrollmentStatus(models.TextChoices):
    ACTIVE    = 'active',    'Active'
    PAUSED    = 'paused',    'Paused'
    COMPLETED = 'completed', 'Completed'
    EXPIRED   = 'expired',   'Expired'


# ─── Enrollment ───────────────────────────────────────────────────────────────

class Enrollment(models.Model):
    """
    Anchor table — one row per user per course.
    All progress tables cascade from here.
    """
    user            = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='pilotfaa_enrollments')
    course          = models.ForeignKey(Course, on_delete=models.RESTRICT,
                          related_name='enrollments')
    status          = models.CharField(max_length=20, choices=EnrollmentStatus.choices,
                          default=EnrollmentStatus.ACTIVE, db_index=True)
    progress_pct    = models.PositiveIntegerField(default=0,
                          help_text="0-100, denormalized — updated by signal")
    last_lesson     = models.ForeignKey(Lesson, null=True, blank=True,
                          on_delete=models.SET_NULL, related_name='+')
    total_time_seconds = models.BigIntegerField(default=0,
                          help_text="Accumulated study time — updated by signal")
    enrolled_at     = models.DateTimeField(auto_now_add=True)
    trial_ends_at   = models.DateTimeField(null=True, blank=True)
    completed_at    = models.DateTimeField(null=True, blank=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        db_table        = 'pilotfaa_enrollment'
        unique_together = [('user', 'course')]
        indexes         = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['course', 'status']),
        ]

    def __str__(self):
        return f"{self.user.username} → {self.course.short_name}"


# ─── LessonCompletion ─────────────────────────────────────────────────────────

class LessonCompletion(models.Model):
    """
    Per-lesson progress. Tracks video watch % and text read % separately.
    completed=True when both thresholds are met (app-layer configurable).
    """
    user               = models.ForeignKey(User, on_delete=models.CASCADE,
                             related_name='pilotfaa_lesson_completions')
    lesson             = models.ForeignKey(Lesson, on_delete=models.CASCADE,
                             related_name='completions')
    enrollment         = models.ForeignKey(Enrollment, on_delete=models.CASCADE,
                             related_name='lesson_completions')
    watch_pct          = models.PositiveIntegerField(default=0)  # 0-100
    read_pct           = models.PositiveIntegerField(default=0)  # 0-100
    completed          = models.BooleanField(default=False, db_index=True)
    time_spent_seconds = models.PositiveIntegerField(default=0)
    first_accessed_at  = models.DateTimeField(null=True, blank=True)
    completed_at       = models.DateTimeField(null=True, blank=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table        = 'pilotfaa_lesson_completion'
        unique_together = [('user', 'lesson')]
        indexes         = [
            models.Index(fields=['enrollment', 'completed']),
            models.Index(fields=['user', 'completed']),
        ]

    def __str__(self):
        return f"{self.user.username} › {self.lesson} {'✓' if self.completed else '…'}"


# ─── StudySession ─────────────────────────────────────────────────────────────

class StudySession(models.Model):
    """
    Time-bounded study event. Created on lesson open, closed on navigate-away.
    Source of hours_studied stat and study heatmap.
    """
    ACTIVITY_CHOICES = [
        ('lesson',    'Lesson'),
        ('quiz',      'Quiz'),
        ('tutor',     'AI Tutor'),
        ('reference', 'Reference'),
    ]
    DEVICE_CHOICES = [
        ('desktop', 'Desktop'),
        ('tablet',  'Tablet'),
        ('mobile',  'Mobile'),
    ]

    user            = models.ForeignKey(User, on_delete=models.CASCADE,
                          related_name='pilotfaa_study_sessions')
    enrollment      = models.ForeignKey(Enrollment, on_delete=models.CASCADE,
                          related_name='study_sessions')
    lesson          = models.ForeignKey(Lesson, null=True, blank=True,
                          on_delete=models.SET_NULL, related_name='study_sessions')
    duration_seconds = models.PositiveIntegerField(null=True, blank=True,
                           help_text="NULL until session closes")
    activity_type   = models.CharField(max_length=20, choices=ACTIVITY_CHOICES,
                          default='lesson', db_index=True)
    device_type     = models.CharField(max_length=10, choices=DEVICE_CHOICES,
                          blank=True)
    started_at      = models.DateTimeField(auto_now_add=True, db_index=True)
    ended_at        = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'pilotfaa_study_session'
        indexes  = [
            models.Index(fields=['user', 'started_at']),
            models.Index(fields=['enrollment', 'started_at']),
        ]
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.user.username} session @ {self.started_at:%Y-%m-%d %H:%M}"


# ─── Bookmark ─────────────────────────────────────────────────────────────────

class Bookmark(models.Model):
    CATEGORY_CHOICES = [
        ('lesson', 'Lesson'),
        ('phak',   'PHAK'),
        ('faraim', 'FAR/AIM'),
        ('acs',    'ACS'),
        ('quiz',   'Quiz'),
    ]

    user       = models.ForeignKey(User, on_delete=models.CASCADE,
                     related_name='pilotfaa_bookmarks')
    lesson     = models.ForeignKey(Lesson, null=True, blank=True,
                     on_delete=models.SET_NULL, related_name='bookmarks')
    title      = models.CharField(max_length=300)
    source_ref = models.CharField(max_length=200, blank=True)
    excerpt    = models.TextField(blank=True)
    category   = models.CharField(max_length=20, choices=CATEGORY_CHOICES,
                     default='lesson', db_index=True)
    tag_label  = models.CharField(max_length=60, blank=True)
    tag_variant = models.CharField(max_length=20, blank=True,
                     help_text="blue | gold | green | red | amber")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pilotfaa_bookmark'
        indexes  = [
            models.Index(fields=['user', 'category']),
            models.Index(fields=['user', '-created_at']),
        ]
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} ↗ {self.title[:50]}"


# ─── Note ─────────────────────────────────────────────────────────────────────

class Note(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE,
                     related_name='pilotfaa_notes')
    lesson     = models.ForeignKey(Lesson, null=True, blank=True,
                     on_delete=models.SET_NULL, related_name='notes')
    title      = models.CharField(max_length=300, default='New Note')
    source_ref = models.CharField(max_length=200, blank=True)
    body       = models.TextField(default='')
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_at = models.DateTimeField(null=True, blank=True,
                     help_text="Soft delete — filter WHERE deleted_at IS NULL")

    class Meta:
        db_table = 'pilotfaa_note'
        indexes  = [
            models.Index(fields=['user', '-updated_at']),
            models.Index(fields=['user', 'deleted_at']),
        ]
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username} › {self.title[:50]}"
