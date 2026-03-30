"""
upload_pdf.py — Upload a PDF file into the FAASourceDocument database record.

Usage:
    python upload_pdf.py PHAK phak.pdf
    python upload_pdf.py RFH  rfh.pdf
    python upload_pdf.py IFH  ifh.pdf

The short_code must match an existing FAASourceDocument record.
The pdf_file argument is the path to the PDF on disk.
"""
import os, sys, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from pilotfaa_faa.models import FAASourceDocument


def upload(short_code: str, pdf_path: str):
    if not os.path.exists(pdf_path):
        print(f"ERROR: File not found: {pdf_path}")
        sys.exit(1)

    try:
        doc = FAASourceDocument.objects.get(short_code=short_code.upper(), is_current=True)
    except FAASourceDocument.DoesNotExist:
        print(f"ERROR: No current FAASourceDocument with short_code='{short_code}'")
        print("Available codes:", list(FAASourceDocument.objects.filter(is_current=True).values_list('short_code', flat=True)))
        sys.exit(1)

    file_size = os.path.getsize(pdf_path)
    print(f"Uploading {pdf_path} ({file_size:,} bytes) → {doc.publication_ref}...")

    with open(pdf_path, 'rb') as f:
        doc.pdf_file = f.read()
    doc.save(update_fields=['pdf_file'])

    print(f"✓ Done. {doc.short_code} ({doc.publication_ref}) PDF stored in database.")
    print(f"  Serve URL: GET /api/pilotfaa/faa/pdf/{doc.short_code}/")


if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python upload_pdf.py <SHORT_CODE> <pdf_file>")
        print("Example: python upload_pdf.py PHAK phak.pdf")
        sys.exit(1)
    upload(sys.argv[1], sys.argv[2])
