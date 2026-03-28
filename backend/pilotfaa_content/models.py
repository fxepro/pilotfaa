"""
pilotfaa_content/models.py
Course content hierarchy:
  Course → Module → Chapter → Lesson → LessonContent
                                      → VideoAsset
                                      → ACSTaskMapping
"""
from django.db import models
from django.contrib.auth.models import User
from pilotfaa_faa.models import FAASourceDocument


# ─── Enums ────────────────────────────────────────────────────────────────────

class CourseCategory(models.TextChoices):
    FIXED_WING_PPL    = 'fixed_wing_ppl',    'Private Pilot (Fixed-Wing)'
    HELICOPTER_PPL    = 'helicopter_ppl',    'Helicopter Private Pilot'
    INSTRUMENT_RATING = 'instrument_rating', 'Instrument Rating'
    COMMERCIAL_PPL    = 'commercial_ppl',    'Commercial Pilot'
    SPORT_PILOT       = 'sport_pilot',       'Sport Pilot'
    CFI               = 'cfi',               'Certified Flight Instructor'


class ContentStatus(models.TextChoices):
    IMPORTED     = 'imported',     'Imported'
    PARSED       = 'parsed',       'Parsed'
    DRAFTED      = 'drafted',      'Drafted'
    UNDER_REVIEW = 'under_review', 'Under Review'
    APPROVED     = 'approved',     'Approved'
    PUBLISHED    = 'published',    'Published'
    ARCHIVED     = 'archived',     'Archived'


class LessonType(models.TextChoices):
    VIDEO      = 'video',      'Video'
    TEXT       = 'text',       'Text'
    VIDEO_TEXT = 'video_text', 'Video + Text'
    REFERENCE  = 'reference',  'Reference'


class ACSKnowledgeType(models.TextChoices):
    KNOWLEDGE = 'knowledge', 'Knowledge (K)'
    RISK      = 'risk',      'Risk Management (R)'
    SKILL     = 'skill',     'Skill (S)'


class VideoGenerationStatus(models.TextChoices):
    PENDING    = 'pending',    'Pending'
    GENERATING = 'generating', 'Generating'
    GENERATED  = 'generated',  'Generated'
    PUBLISHED  = 'published',  'Published'
    FAILED     = 'failed',     'Failed'


# ─── Course ───────────────────────────────────────────────────────────────────

class Course(models.Model):
    slug              = models.SlugField(max_length=80, unique=True)
    name              = models.CharField(max_length=200)
    short_name        = models.CharField(max_length=80)
    category          = models.CharField(max_length=30, choices=CourseCategory.choices, db_index=True)
    description       = models.TextField(blank=True)
    icon_emoji        = models.CharField(max_length=10, blank=True)
    banner_gradient   = models.CharField(max_length=200, blank=True)
    primary_source    = models.ForeignKey(FAASourceDocument, on_delete=models.PROTECT,
                            related_name='primary_courses')
    acs_code          = models.CharField(max_length=40, blank=True,
                            help_text="e.g. FAA-S-ACS-6C")
    acs_source        = models.ForeignKey(FAASourceDocument, null=True, blank=True,
                            on_delete=models.SET_NULL, related_name='acs_courses')
    total_lessons     = models.PositiveIntegerField(default=0,
                            help_text="Denormalized — updated by signal")
    estimated_hours   = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    sort_order        = models.PositiveIntegerField(default=0)
    status            = models.CharField(max_length=20, choices=ContentStatus.choices,
                            default=ContentStatus.DRAFTED, db_index=True)
    published_at      = models.DateTimeField(null=True, blank=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pilotfaa_course'
        indexes  = [models.Index(fields=['status', 'sort_order'])]
        ordering = ['sort_order']

    def __str__(self):
        return self.name


# ─── Module ───────────────────────────────────────────────────────────────────

class Module(models.Model):
    course      = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='modules')
    title       = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    sort_order  = models.PositiveIntegerField(default=0)
    status      = models.CharField(max_length=20, choices=ContentStatus.choices,
                      default=ContentStatus.DRAFTED, db_index=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pilotfaa_module'
        indexes  = [models.Index(fields=['course', 'sort_order'])]
        ordering = ['sort_order']

    def __str__(self):
        return f"{self.course.short_name} › {self.title}"


# ─── Chapter ──────────────────────────────────────────────────────────────────

class Chapter(models.Model):
    module            = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='chapters')
    source_document   = models.ForeignKey(FAASourceDocument, on_delete=models.PROTECT,
                            related_name='chapters')
    chapter_number    = models.PositiveIntegerField(
                            help_text="Chapter number as printed in the handbook")
    title             = models.CharField(max_length=200)
    source_page_start = models.PositiveIntegerField(null=True, blank=True)
    source_page_end   = models.PositiveIntegerField(null=True, blank=True)
    sort_order        = models.PositiveIntegerField(default=0)
    status            = models.CharField(max_length=20, choices=ContentStatus.choices,
                            default=ContentStatus.DRAFTED, db_index=True)
    created_at        = models.DateTimeField(auto_now_add=True)
    updated_at        = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pilotfaa_chapter'
        indexes  = [
            models.Index(fields=['module', 'sort_order']),
            models.Index(fields=['source_document', 'chapter_number']),
        ]
        ordering = ['sort_order']

    def __str__(self):
        return f"Ch.{self.chapter_number} — {self.title}"


# ─── Lesson ───────────────────────────────────────────────────────────────────

class Lesson(models.Model):
    chapter          = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='lessons')
    lesson_number    = models.CharField(max_length=20, help_text="Display number e.g. 5.2")
    title            = models.CharField(max_length=255)
    type             = models.CharField(max_length=20, choices=LessonType.choices,
                           default=LessonType.VIDEO_TEXT)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    sort_order       = models.PositiveIntegerField(default=0)
    is_preview       = models.BooleanField(default=False,
                           help_text="True = visible to free-tier users", db_index=True)
    status           = models.CharField(max_length=20, choices=ContentStatus.choices,
                           default=ContentStatus.DRAFTED, db_index=True)
    published_at     = models.DateTimeField(null=True, blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)
    updated_at       = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pilotfaa_lesson'
        indexes  = [
            models.Index(fields=['chapter', 'sort_order']),
            models.Index(fields=['status', 'is_preview']),
        ]
        ordering = ['sort_order']

    def __str__(self):
        return f"{self.lesson_number} — {self.title}"


# ─── LessonContent ────────────────────────────────────────────────────────────

class LessonContent(models.Model):
    """
    One-to-one with Lesson. Stores both verbatim FAA source text
    and the derived teaching text separately — never mix them.
    """
    lesson             = models.OneToOneField(Lesson, on_delete=models.CASCADE,
                             related_name='content')
    source_text        = models.TextField(blank=True,
                             help_text="Verbatim FAA source — NEVER modify after import")
    teaching_text      = models.TextField(blank=True,
                             help_text="Editor/AI-derived pedagogical text")
    key_terms          = models.JSONField(default=list,
                             help_text='[{word, definition}, ...]')
    callouts           = models.JSONField(default=list,
                             help_text='[{variant, label, body}, ...]')
    source_page_ref    = models.CharField(max_length=40, blank=True,
                             help_text="e.g. p.5-2")
    source_section_ref = models.CharField(max_length=100, blank=True,
                             help_text="Section heading citation")
    content_status     = models.CharField(max_length=20, choices=ContentStatus.choices,
                             default=ContentStatus.DRAFTED, db_index=True)
    reviewed_by        = models.ForeignKey(User, null=True, blank=True,
                             on_delete=models.SET_NULL, related_name='reviewed_lesson_contents')
    approved_at        = models.DateTimeField(null=True, blank=True)
    created_at         = models.DateTimeField(auto_now_add=True)
    updated_at         = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'pilotfaa_lesson_content'
        indexes  = [models.Index(fields=['content_status'])]

    def __str__(self):
        return f"Content for {self.lesson}"


# ─── VideoAsset ───────────────────────────────────────────────────────────────

class VideoAsset(models.Model):
    lesson            = models.ForeignKey(Lesson, on_delete=models.CASCADE,
                            related_name='video_assets')
    asset_version     = models.PositiveIntegerField(default=1)
    script_text       = models.TextField(blank=True)
    narration_text    = models.TextField(blank=True)
    ai_provider       = models.CharField(max_length=60, blank=True,
                            help_text="e.g. ElevenLabs, HeyGen, OpenAI-TTS")
    ai_model          = models.CharField(max_length=80, blank=True)
    generation_status = models.CharField(max_length=20, choices=VideoGenerationStatus.choices,
                            default=VideoGenerationStatus.PENDING, db_index=True)
    video_url         = models.URLField(blank=True)
    caption_url       = models.URLField(blank=True)
    thumbnail_url     = models.URLField(blank=True)
    duration_seconds  = models.PositiveIntegerField(null=True, blank=True)
    source_refs       = models.JSONField(default=list,
                            help_text='[{document, chapter, page}, ...]')
    is_active         = models.BooleanField(default=False, db_index=True,
                            help_text="Only one VideoAsset per lesson should be active")
    generation_error  = models.TextField(blank=True)
    generated_at      = models.DateTimeField(null=True, blank=True)
    created_at        = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'pilotfaa_video_asset'
        indexes  = [
            models.Index(fields=['lesson', 'is_active']),
            models.Index(fields=['generation_status']),
        ]
        ordering = ['-asset_version']

    def __str__(self):
        return f"{self.lesson} v{self.asset_version} [{self.generation_status}]"


# ─── ACSTaskMapping ───────────────────────────────────────────────────────────

class ACSTaskMapping(models.Model):
    lesson         = models.ForeignKey(Lesson, on_delete=models.CASCADE,
                         related_name='acs_mappings')
    acs_area_code  = models.CharField(max_length=20, db_index=True,
                         help_text="e.g. I, II, IV")
    acs_task_code  = models.CharField(max_length=20, db_index=True,
                         help_text="e.g. PA.I.B, PA.IV.A")
    knowledge_type = models.CharField(max_length=20, choices=ACSKnowledgeType.choices,
                         default=ACSKnowledgeType.KNOWLEDGE)
    knowledge_ref  = models.CharField(max_length=40, blank=True,
                         help_text="Specific item e.g. K1, R2")
    is_primary     = models.BooleanField(default=False, db_index=True,
                         help_text="Primary lesson for this ACS task")
    created_at     = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table        = 'pilotfaa_acs_task_mapping'
        unique_together = [('lesson', 'acs_task_code', 'knowledge_ref')]
        indexes         = [
            models.Index(fields=['acs_task_code']),
            models.Index(fields=['acs_area_code']),
        ]

    def __str__(self):
        return f"{self.lesson} → {self.acs_task_code}"
