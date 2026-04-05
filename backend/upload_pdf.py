"""
upload_pdf.py — Upload a FAA PDF into the database.

PDFs live in backend/FAA/. Run from backend/ directory.

Usage:
    # Use default filename from FAA/ folder:
    python upload_pdf.py PHAK
    python upload_pdf.py IFH

    # Or specify file explicitly (original behaviour):
    python upload_pdf.py PHAK FAA/phak.pdf

SHORT_CODE to filename (backend/FAA/):
    PHAK         → FAA/phak.pdf
    IFH          → FAA/FAA-H-8083-15B.pdf
    RFH          → FAA/FAA-H-8083-21B_helicopter_flying_handbook.pdf
    AIM          → FAA/AIM_Basic_dtd_2-20-25_post.pdf
    ACS_PPL      → FAA/FAA-S-ACS-6C_private_airplane_acs_6.pdf
    ACS_COM      → FAA/FAA-S-ACS-7B_commercial_airplane_acs_7.pdf
    ACS_IFR      → FAA/FAA-S-ACS-8C_instrument_rating_airplane_acs_8.pdf
    PTS_CFI_IFR  → FAA/FAA-S-ACS-9_cfi_instrument_pts_9.pdf
    ACS_HELI_COM → FAA/FAA-S-ACS-16_commercial_helicopter_acs_16.pdf
    PTS_CFI      → FAA/FAA-S-8081-6D.pdf
    PTS_GYRO     → FAA/private_gyroplane_pts_15.pdf
"""
import os, sys, django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from pilotfaa_faa.models import FAASourceDocument

DEFAULT_FILES = {
    'PHAK':         'FAA/phak.pdf',
    'IFH':          'FAA/FAA-H-8083-15B.pdf',
    'RFH':          'FAA/FAA-H-8083-21B_helicopter_flying_handbook.pdf',
    'AIM':          'FAA/AIM_Basic_dtd_2-20-25_post.pdf',
    'ACS_PPL':      'FAA/FAA-S-ACS-6C_private_airplane_acs_6.pdf',
    'ACS_COM':      'FAA/FAA-S-ACS-7B_commercial_airplane_acs_7.pdf',
    'ACS_IFR':      'FAA/FAA-S-ACS-8C_instrument_rating_airplane_acs_8.pdf',
    'PTS_CFI_IFR':  'FAA/FAA-S-ACS-9_cfi_instrument_pts_9.pdf',
    'ACS_HELI_COM': 'FAA/FAA-S-ACS-16_commercial_helicopter_acs_16.pdf',
    'PTS_CFI':      'FAA/FAA-S-8081-6D.pdf',
    'PTS_GYRO':     'FAA/private_gyroplane_pts_15.pdf',
}


def upload(short_code: str, pdf_path: str):
    short_code = short_code.upper()

    if not os.path.exists(pdf_path):
        print(f"ERROR: File not found: {pdf_path}")
        print(f"  Checked: {os.path.abspath(pdf_path)}")
        sys.exit(1)

    try:
        doc = FAASourceDocument.objects.get(short_code=short_code, is_current=True)
    except FAASourceDocument.DoesNotExist:
        print(f"ERROR: No DB row for short_code='{short_code}'")
        print("  Run seed_faa_sources.py first.")
        print("  Available:", list(
            FAASourceDocument.objects.filter(is_current=True).values_list('short_code', flat=True)
        ))
        sys.exit(1)

    file_size = os.path.getsize(pdf_path)
    if doc.pdf_file:
        print(f"  Note: overwriting existing PDF for {short_code}")

    print(f"Uploading [{short_code}] {doc.publication_ref}")
    print(f"  File : {pdf_path}")
    print(f"  Size : {file_size:,} bytes ({file_size / 1_048_576:.1f} MB)")
    print(f"  Table: pilotfaa.pilotfaa_faa_source_document")

    with open(pdf_path, 'rb') as f:
        doc.pdf_file = f.read()
    doc.save(update_fields=['pdf_file'])

    print(f"  ✓ Done — serve URL: GET /api/pilotfaa/faa/pdf/{doc.short_code}/")


if __name__ == '__main__':
    if len(sys.argv) == 2:
        # python upload_pdf.py PHAK  (use default FAA/ filename)
        code = sys.argv[1].upper()
        if code not in DEFAULT_FILES:
            print(f"ERROR: No default file for '{code}'")
            print(f"  Known codes: {', '.join(sorted(DEFAULT_FILES.keys()))}")
            print(f"  Or: python upload_pdf.py {code} FAA/yourfile.pdf")
            sys.exit(1)
        upload(code, DEFAULT_FILES[code])
    elif len(sys.argv) == 3:
        # python upload_pdf.py PHAK FAA/phak.pdf  (explicit path)
        upload(sys.argv[1], sys.argv[2])
    else:
        print("Usage:")
        print("  python upload_pdf.py PHAK")
        print("  python upload_pdf.py PHAK FAA/phak.pdf")
        sys.exit(1)
