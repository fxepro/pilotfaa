"""
seed_faa_sources.py — Create FAASourceDocument rows for all FAA publications.

Safe to re-run — uses get_or_create. Run BEFORE upload_pdf.py.

    DATABASE_URL="postgresql://..." python seed_faa_sources.py
    railway run python seed_faa_sources.py
"""
import os, sys, django, datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from pilotfaa_faa.models import FAASourceDocument

DOCS = [
    {
        'short_code': 'PHAK', 'version': 'Rev C 2023',
        'full_title': "Pilot's Handbook of Aeronautical Knowledge",
        'publication_ref': 'FAA-H-8083-25C',
        'effective_date': datetime.date(2023, 9, 1),
        'chapter_count': 17,
        'source_url': 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak',
    },
    {
        'short_code': 'IFH', 'version': 'Rev B 2012',
        'full_title': 'Instrument Flying Handbook',
        'publication_ref': 'FAA-H-8083-15B',
        'effective_date': datetime.date(2012, 8, 1),
        'chapter_count': 10,
        'source_url': 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/instrument_flying_handbook',
    },
    {
        'short_code': 'RFH', 'version': 'Rev B 2019',
        'full_title': 'Rotorcraft Flying Handbook',
        'publication_ref': 'FAA-H-8083-21B',
        'effective_date': datetime.date(2019, 1, 1),
        'chapter_count': 12,
        'source_url': 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/helicopter_flying_handbook',
    },
    {
        'short_code': 'AIM', 'version': 'Feb 2025',
        'full_title': 'Aeronautical Information Manual',
        'publication_ref': 'AIM',
        'effective_date': datetime.date(2025, 2, 20),
        'chapter_count': 9,
        'source_url': 'https://www.faa.gov/air_traffic/publications/atpubs/aim_html',
    },
    {
        'short_code': 'ACS_PPL', 'version': 'Rev C 2023',
        'full_title': 'Private Pilot Airman Certification Standards — Airplane',
        'publication_ref': 'FAA-S-ACS-6C',
        'effective_date': datetime.date(2023, 6, 1),
        'chapter_count': 9,
        'source_url': 'https://www.faa.gov/training_testing/testing/acs',
    },
    {
        'short_code': 'ACS_COM', 'version': 'Rev B 2023',
        'full_title': 'Commercial Pilot Airman Certification Standards — Airplane',
        'publication_ref': 'FAA-S-ACS-7B',
        'effective_date': datetime.date(2023, 6, 1),
        'chapter_count': 8,
        'source_url': 'https://www.faa.gov/training_testing/testing/acs',
    },
    {
        'short_code': 'ACS_IFR', 'version': 'Rev C 2023',
        'full_title': 'Instrument Rating Airman Certification Standards — Airplane',
        'publication_ref': 'FAA-S-ACS-8C',
        'effective_date': datetime.date(2023, 6, 1),
        'chapter_count': 8,
        'source_url': 'https://www.faa.gov/training_testing/testing/acs',
    },
    {
        'short_code': 'PTS_CFI_IFR', 'version': 'Nov 2023',
        'full_title': 'Flight Instructor Instrument Practical Test Standards — Airplane and Helicopter',
        'publication_ref': 'FAA-S-ACS-9',
        'effective_date': datetime.date(2023, 11, 1),
        'chapter_count': 6,
        'source_url': 'https://www.faa.gov/training_testing/testing/test_standards',
    },
    {
        'short_code': 'ACS_HELI_COM', 'version': '2019',
        'full_title': 'Commercial Pilot Airman Certification Standards — Helicopter',
        'publication_ref': 'FAA-S-ACS-16',
        'effective_date': datetime.date(2019, 1, 1),
        'chapter_count': 7,
        'source_url': 'https://www.faa.gov/training_testing/testing/acs',
    },
    {
        'short_code': 'PTS_CFI', 'version': 'Rev D 2012',
        'full_title': 'Flight Instructor Practical Test Standards — Airplane',
        'publication_ref': 'FAA-S-8081-6D',
        'effective_date': datetime.date(2012, 6, 1),
        'chapter_count': 7,
        'source_url': 'https://www.faa.gov/training_testing/testing/test_standards',
    },
    {
        'short_code': 'PTS_GYRO', 'version': '2015',
        'full_title': 'Private Pilot Practical Test Standards — Gyroplane',
        'publication_ref': 'FAA-S-8081-15',
        'effective_date': datetime.date(2015, 1, 1),
        'chapter_count': 5,
        'source_url': 'https://www.faa.gov/training_testing/testing/test_standards',
    },
]

print("\n=== FAA Source Document Seed ===\n")

for doc in DOCS:
    obj, created = FAASourceDocument.objects.get_or_create(
        short_code=doc['short_code'],
        version=doc['version'],
        defaults={k: v for k, v in doc.items() if k not in ('short_code', 'version')} | {'is_current': True}
    )
    print(f"  {'✓ Created' if created else '→ Exists'}: [{obj.short_code}] {obj.publication_ref}")

print("\n=== All current rows ===\n")
for doc in FAASourceDocument.objects.filter(is_current=True).order_by('short_code'):
    pdf_status = '✓ PDF loaded' if doc.pdf_file else '✗ no PDF'
    print(f"  [{doc.short_code:<14}] {doc.publication_ref:<22} {pdf_status}")

print("\nNext: python upload_pdf.py <SHORT_CODE>\n")
