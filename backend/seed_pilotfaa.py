"""
seed_pilotfaa.py — Run from backend/ with: python seed_pilotfaa.py

Creates:
  - PHAK FAA source document
  - Private Pilot course
  - 4 Modules (visible to students)
  - 17 Chapters across the modules (standard PHAK titles)
  - 2-3 Lessons per chapter with content
  - Question bank per chapter + sample questions

Safe to re-run — uses get_or_create throughout.
"""
import os, sys, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

import datetime
from pilotfaa_faa.models import FAASourceDocument
from pilotfaa_content.models import Course, Module, Chapter, Lesson, LessonContent
from pilotfaa_assessments.models import QuestionBank, Question
from django.contrib.auth.models import User
from pilotfaa_progress.models import Enrollment

print("\n=== PilotFAA Seed Script ===\n")

# ── 1. FAA Source Document ────────────────────────────────────────────────────
phak, created = FAASourceDocument.objects.get_or_create(
    short_code='PHAK', version='Rev C 2023',
    defaults={
        'full_title': "Pilot's Handbook of Aeronautical Knowledge",
        'publication_ref': 'FAA-H-8083-25C',
        'effective_date': datetime.date(2023, 9, 1),
        'is_current': True,
        'chapter_count': 17,
        'source_url': 'https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak',
    }
)
print(f"{'✓ Created' if created else '→ Found'} FAA source: {phak}")

# ── 2. Course ─────────────────────────────────────────────────────────────────
course, created = Course.objects.get_or_create(
    slug='private-pilot',
    defaults={
        'name': 'Private Pilot (Fixed-Wing)',
        'short_name': 'Private Pilot',
        'category': 'fixed_wing_ppl',
        'description': 'Complete FAA Private Pilot ground school based on PHAK FAA-H-8083-25C.',
        'icon_emoji': '✈️',
        'banner_gradient': 'linear-gradient(135deg, #1756C8, #2362e0)',
        'primary_source': phak,
        'acs_code': 'FAA-S-ACS-6C',
        'estimated_hours': 40,
        'sort_order': 1,
        'status': 'published',
    }
)
print(f"{'✓ Created' if created else '→ Found'} course: {course.name}")

# ── 3. Module + Chapter + Lesson structure ────────────────────────────────────
#
# 4 Modules reflecting logical groupings a student would recognise:
#   Module 1 — The Basics          (Ch 1-4)   — Who can fly, how to decide, instruments, aircraft
#   Module 2 — How Aircraft Fly    (Ch 5-8)   — Aerodynamics, controls, performance, weight
#   Module 3 — Navigation & Weather(Ch 9-13)  — Navigation, weather theory, services, airspace, ATC
#   Module 4 — Operations & Safety (Ch 14-17) — Emergency, night, high-altitude, aero decision-making

STRUCTURE = [
    {
        'sort': 1,
        'title': 'Module 1 — The Basics',
        'desc': 'Where aviation starts. Certification, decision-making, the instruments that tell you where you are, and the machine you will fly.',
        'chapters': [
            (1,  'Introduction to Flying',             1,   18,
             [('1.1','The Decision to Fly',12), ('1.2','Student Pilot Certificate',10), ('1.3','Aviation Careers',8)]),
            (2,  'Aeronautical Decision-Making',       19,  48,
             [('2.1','ADM Overview',18), ('2.2','Risk Management',16), ('2.3','Crew Resource Management',14)]),
            (3,  'Flight Instruments',                 49,  100,
             [('3.1','Pitot-Static Instruments',20), ('3.2','Gyroscopic Instruments',18), ('3.3','Magnetic Compass',12)]),
            (4,  'Aircraft Systems',                   101, 150,
             [('4.1','Reciprocating Engines',22), ('4.2','Fuel Systems',16), ('4.3','Electrical Systems',14)]),
        ],
    },
    {
        'sort': 2,
        'title': 'Module 2 — How Aircraft Fly',
        'desc': 'The physics of flight. Lift, drag, thrust, weight — and how you control all of it to go where you want.',
        'chapters': [
            (5,  'Aerodynamics of Flight',             151, 210,
             [('5.1','Four Forces of Flight',20), ('5.2','Lift and Drag',18), ('5.3','Stalls and Spins',22)]),
            (6,  'Flight Controls',                    211, 240,
             [('6.1','Primary Flight Controls',16), ('6.2','Secondary Controls and Trim',14)]),
            (7,  'Aircraft Performance',               241, 280,
             [('7.1','Density Altitude',20), ('7.2','Takeoff and Landing Performance',22), ('7.3','Climb and Cruise',16)]),
            (8,  'Weight and Balance',                 281, 310,
             [('8.1','Weight and Balance Theory',18), ('8.2','Computing Weight and Balance',20)]),
        ],
    },
    {
        'sort': 3,
        'title': 'Module 3 — Navigation & Weather',
        'desc': 'Getting from A to B and understanding what the sky is doing. Covers navigation methods, weather theory, and weather services.',
        'chapters': [
            (9,  'Flight Navigation',                  311, 370,
             [('9.1','Pilotage and Dead Reckoning',22), ('9.2','VOR Navigation',18), ('9.3','GPS Navigation',16)]),
            (10, 'Aviation Weather',                   371, 430,
             [('10.1','The Atmosphere',18), ('10.2','Wind and Pressure',16), ('10.3','Thunderstorms and Icing',22)]),
            (11, 'Aviation Weather Services',          431, 480,
             [('11.1','METARs and TAFs',22), ('11.2','PIREPs and SIGMETs',16), ('11.3','Weather Charts',18)]),
            (12, 'Airport Operations',                 481, 520,
             [('12.1','Airport Markings and Signs',20), ('12.2','Ground Operations and Taxiing',16)]),
            (13, 'Airspace',                           521, 560,
             [('13.1','Controlled Airspace — Class A B C D E',22), ('13.2','Class G and Special Use',16), ('13.3','Temporary Flight Restrictions',12)]),
        ],
    },
    {
        'sort': 4,
        'title': 'Module 4 — Operations & Safety',
        'desc': 'The real-world stuff. ATC, emergencies, night flying, high-altitude ops, and the decision-making that keeps you safe.',
        'chapters': [
            (14, 'Air Traffic Control',                561, 600,
             [('14.1','ATC Communications',20), ('14.2','Radar Services and Transponders',16)]),
            (15, 'Emergency Procedures',               601, 630,
             [('15.1','Engine Failures and Forced Landings',22), ('15.2','Fires and Electrical Failures',18), ('15.3','Emergency Equipment and Survival',12)]),
            (16, 'Night Operations',                   631, 650,
             [('16.1','Night Vision and Physiology',16), ('16.2','Night Flying Procedures',14)]),
            (17, 'High-Altitude and Aeromedical',      651, 680,
             [('17.1','Hypoxia and Oxygen Systems',16), ('17.2','Spatial Disorientation',14), ('17.3','IMSAFE and Fitness to Fly',12)]),
        ],
    },
]

# ── Sample questions for key chapters ─────────────────────────────────────────
QUESTIONS = {
    5: [('What causes an aircraft to stall?',
         [('A','Insufficient airspeed',False),('B','Exceeding the critical angle of attack',True),
          ('C','Excessive weight',False),('D','Turbulent air',False)],
         'B',
         'A stall occurs when the critical angle of attack is exceeded, causing airflow to separate from the upper wing surface and lift to decrease dramatically.',
         'PHAK FAA-H-8083-25C · Ch.5 p.5-12')],
    7: [('What is density altitude?',
         [('A','The altitude shown on the altimeter',False),
          ('B','Pressure altitude corrected for non-standard temperature',True),
          ('C','True altitude above mean sea level',False),
          ('D','The altitude at which aircraft performance is measured',False)],
         'B',
         'Density altitude is pressure altitude corrected for non-standard temperature. High density altitude reduces aircraft performance.',
         'PHAK FAA-H-8083-25C · Ch.7 p.7-3')],
    10: [('What three conditions are required for a thunderstorm to form?',
          [('A','High pressure, cold temps, clear skies',False),
           ('B','Lifting force, unstable air, and high moisture content',True),
           ('C','Strong winds, low humidity, warm surface temps',False),
           ('D','Fog, low ceilings, and calm winds',False)],
          'B',
          'All three conditions must be present for thunderstorm formation: a lifting force (frontal, orographic, or convective), atmospheric instability, and sufficient moisture.',
          'PHAK FAA-H-8083-25C · Ch.10 p.10-18')],
    13: [('What is the floor of Class A airspace?',
          [('A','10,000 feet MSL',False),('B','14,500 feet MSL',False),
           ('C','18,000 feet MSL',True),('D','60,000 feet MSL',False)],
          'C',
          'Class A airspace extends from 18,000 feet MSL to FL600. All operations within Class A must be conducted under IFR.',
          'PHAK FAA-H-8083-25C · Ch.13 p.13-2 · 14 CFR §71.33')],
    1: [('Which document establishes the requirements for a student pilot certificate?',
         [('A','14 CFR Part 61',True),('B','14 CFR Part 91',False),
          ('C','AC 61-65',False),('D','PHAK Chapter 1',False)],
         'A',
         '14 CFR Part 61 establishes the certification requirements for all pilots including student, recreational, private, commercial, and ATP certificates.',
         'PHAK FAA-H-8083-25C · Ch.1 p.1-2 · 14 CFR Part 61')],
}

# ── Build everything ──────────────────────────────────────────────────────────
total_lessons = 0

for mod_data in STRUCTURE:
    mod, mod_created = Module.objects.get_or_create(
        course=course, sort_order=mod_data['sort'],
        defaults={'title': mod_data['title'], 'description': mod_data['desc'], 'status': 'published'}
    )
    if not mod_created:
        # Update title/desc in case it changed
        Module.objects.filter(id=mod.id).update(title=mod_data['title'], description=mod_data['desc'])
    print(f"\n  {'✓' if mod_created else '→'} {mod_data['title']}")

    for ch_num, ch_title, pg_start, pg_end, lessons_data in mod_data['chapters']:
        chapter, ch_created = Chapter.objects.get_or_create(
            module=mod, chapter_number=ch_num,
            defaults={
                'source_document': phak,
                'title': ch_title,
                'source_page_start': pg_start,
                'source_page_end': pg_end,
                'sort_order': ch_num,
                'status': 'published',
            }
        )
        if not ch_created:
            Chapter.objects.filter(id=chapter.id).update(
                module=mod, title=ch_title,
                source_page_start=pg_start, source_page_end=pg_end
            )
        print(f"    {'✓' if ch_created else '→'} Ch.{ch_num:02d} — {ch_title} (pp.{pg_start}–{pg_end})")

        for l_sort, (l_num, l_title, l_mins) in enumerate(lessons_data, 1):
            lesson, l_created = Lesson.objects.get_or_create(
                chapter=chapter, lesson_number=l_num,
                defaults={
                    'title': l_title,
                    'type': 'video_text',
                    'duration_minutes': l_mins,
                    'sort_order': l_sort,
                    'is_preview': (ch_num == 1 and l_sort == 1),
                    'status': 'published',
                }
            )
            if l_created:
                LessonContent.objects.get_or_create(
                    lesson=lesson,
                    defaults={
                        'teaching_text': (
                            f'{l_title} is covered in Chapter {ch_num} of the PHAK '
                            f'(FAA-H-8083-25C, pp.{pg_start}–{pg_end}). '
                            f'This lesson introduces the core concepts you need to understand '
                            f'before your FAA Knowledge Test. Read the source material and use '
                            f'the AI Tutor to ask questions about anything unclear.'
                        ),
                        'key_terms': [
                            {'word': 'FAA', 'definition': 'Federal Aviation Administration — the US government body responsible for civil aviation regulation.'},
                            {'word': 'ACS', 'definition': 'Airman Certification Standards — the standard your DPE uses to evaluate you on checkride day.'},
                        ],
                        'source_page_ref': f'pp.{pg_start}–{pg_end}',
                        'source_section_ref': f'PHAK Ch.{ch_num} — {ch_title}',
                        'content_status': 'published',
                    }
                )
                total_lessons += 1

        # Question bank
        bank, _ = QuestionBank.objects.get_or_create(
            course=course, chapter=chapter,
            defaults={
                'name': f'Ch.{ch_num} — {ch_title}',
                'bank_type': 'chapter',
                'pass_threshold_pct': 70,
                'is_active': True,
            }
        )

        # Sample questions
        for q_text, options, correct, rationale, cite in QUESTIONS.get(ch_num, []):
            if not Question.objects.filter(bank=bank, question_text=q_text).exists():
                Question.objects.create(
                    bank=bank, chapter=chapter,
                    question_text=q_text,
                    question_type='single_choice',
                    options=[{'letter': l, 'text': t, 'is_correct': c} for l, t, c in options],
                    correct_letter=correct,
                    rationale=rationale,
                    rationale_source_ref=cite,
                    difficulty='medium',
                    exam_relevant=True,
                    status='active',
                )

# ── Update course lesson count ────────────────────────────────────────────────
count = Lesson.objects.filter(chapter__module__course=course, status='published').count()
Course.objects.filter(slug='private-pilot').update(total_lessons=count)

# ── Enroll all superusers ─────────────────────────────────────────────────────
print('\n  Enrolling superusers...')
for su in User.objects.filter(is_superuser=True):
    enr, enr_created = Enrollment.objects.get_or_create(
        user=su, course=course,
        defaults={'status': 'active'}
    )
    print(f"  {'✓ Enrolled' if enr_created else '→ Already enrolled'}: {su.username}")

# ── Summary ───────────────────────────────────────────────────────────────────
print(f"""
=== Seed Complete ===
  Course:         {course.name}
  Modules:        {Module.objects.filter(course=course).count()}
  Chapters:       {Chapter.objects.filter(module__course=course).count()}
  Lessons:        {Lesson.objects.filter(chapter__module__course=course, status='published').count()}
  Lesson content: {LessonContent.objects.filter(lesson__chapter__module__course=course).count()}
  Question banks: {QuestionBank.objects.filter(course=course).count()}
  Questions:      {Question.objects.filter(bank__course=course).count()}

Visit http://localhost:3000/lms
""")
