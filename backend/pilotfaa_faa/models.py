"""
pilotfaa_faa/models.py
FAA Source Document registry — the single source of truth for all
content citations. Every lesson, question, and AI response traces
back to a row in this table.
"""
from django.db import models


class FAASourceDocument(models.Model):
    """
    Registry of FAA publications used as source material.
    Insert new rows for new editions — never overwrite existing rows.
    This preserves citation integrity for historical content.
    """
    short_code       = models.CharField(max_length=40, help_text="e.g. PHAK, RFH, IFH, ACS_PPL")
    full_title       = models.TextField(help_text="Full official title")
    publication_ref  = models.CharField(max_length=80, help_text="e.g. FAA-H-8083-25C")
    version          = models.CharField(max_length=40, help_text="e.g. 2023-09, Rev C")
    effective_date   = models.DateField()
    source_url       = models.URLField(blank=True, help_text="Canonical FAA.gov or eCFR.gov URL")
    pdf_s3_key       = models.TextField(blank=True, help_text="S3 key for cached PDF copy")
    pdf_file         = models.BinaryField(
                           blank=True, null=True,
                           help_text="PDF binary stored in database — upload via upload_pdf.py")
    chapter_count    = models.PositiveIntegerField(null=True, blank=True)
    is_current       = models.BooleanField(default=True, db_index=True,
                           help_text="False once superseded by a newer version")
    superseded_by    = models.ForeignKey(
        'self', null=True, blank=True,
        on_delete=models.SET_NULL, related_name='supersedes'
    )
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table            = 'pilotfaa_faa_source_document'
        unique_together     = [('short_code', 'version')]
        indexes             = [
            models.Index(fields=['is_current', 'short_code']),
        ]
        ordering            = ['short_code', '-effective_date']

    def __str__(self):
        return f"{self.publication_ref} ({self.version})"
