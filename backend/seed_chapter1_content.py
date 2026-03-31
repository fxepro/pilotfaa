"""
seed_chapter1_content.py
Populates real PHAK-sourced lesson content for Chapter 1 — Introduction to Flying.
Run from backend/: python seed_chapter1_content.py
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from pilotfaa_content.models import Lesson, LessonContent

LESSONS = {
    '1.1': {
        'title': 'The Decision to Fly',
        'teaching_text': """Aviation is unique among human endeavors. The moment you take the controls of an aircraft, you become the pilot in command — responsible for the safety of every person aboard and the aircraft itself.

The FAA defines the Pilot in Command (PIC) as "the person who has final authority and responsibility for the operation and safety of a flight." This isn't a formality. It means that regardless of who owns the aircraft, who is sitting next to you, or what anyone else says — when you are PIC, the final decision is yours.

WHY PEOPLE FLY

People fly for many reasons: transportation, recreation, career, and the simple joy of seeing the world from above. Each reason is valid, but all pilots share one thing — the acceptance of responsibility.

Aviation offers freedom unavailable by any other means. A journey that takes hours by car takes minutes by air. Weather patterns become visible from above. Geography that seems impassable on the ground becomes navigable with the right training and aircraft.

THE STUDENT PILOT'S PATH

Every certificated pilot began as a student. The path from first flight lesson to private pilot certificate typically involves:

• 40 hours minimum flight time (FAA requirement), though the national average is closer to 60-70 hours
• Ground school — the study of aeronautics, regulations, weather, and navigation
• A written knowledge test (the FAA Knowledge Test) — 60 questions, 70% passing score required
• A practical test (checkride) with a Designated Pilot Examiner (DPE)

The FAA Knowledge Test covers everything in this course. Pass it, and you have demonstrated to the FAA that you understand the principles of flight, regulations, weather, and navigation at a level required of a private pilot.

WHAT MAKES A GOOD PILOT

Technical skill matters, but attitude matters more. The FAA identifies five hazardous attitudes that kill pilots:

1. Anti-authority ("Don't tell me what to do") — dismissing rules and regulations
2. Impulsivity ("Do something — NOW!") — acting without thinking
3. Invulnerability ("It won't happen to me") — dismissing risk
4. Macho ("I can do it") — overconfidence
5. Resignation ("What's the use?") — giving up

Recognizing these attitudes in yourself is the first step toward correcting them. We will return to this throughout the course in the Aeronautical Decision-Making chapters.

THE FAA AND CIVIL AVIATION

The Federal Aviation Administration (FAA) is the regulatory body for civil aviation in the United States. It publishes:

• 14 CFR (Code of Federal Regulations) — the rules pilots must follow
• Handbooks like this one (PHAK) — educational publications
• Advisory Circulars (ACs) — guidance documents
• Aeronautical Information Manual (AIM) — operational procedures

The PHAK (this handbook) is not a regulation — it's an educational tool. The regulations are in 14 CFR. When this course references a rule, it will cite the specific regulation.

As you study, remember: you are learning to exercise a privilege, not just pass a test. The standards exist because aviation, done carelessly, is unforgiving.""",
        'key_terms': [
            {'word': 'Pilot in Command (PIC)', 'definition': 'The pilot responsible for the operation and safety of an aircraft. Has final authority on all decisions during flight. Defined in 14 CFR §91.3.'},
            {'word': 'FAA', 'definition': 'Federal Aviation Administration — the U.S. government agency responsible for regulating civil aviation, including pilot certification, aircraft airworthiness, and airspace management.'},
            {'word': '14 CFR', 'definition': 'Title 14 of the Code of Federal Regulations — the body of law governing aviation in the United States. Parts 61 and 91 are most relevant to private pilots.'},
            {'word': 'Practical Test (Checkride)', 'definition': 'The final examination for a pilot certificate. Conducted by a Designated Pilot Examiner (DPE) and includes both an oral examination and a flight test.'},
            {'word': 'PHAK', 'definition': "Pilot's Handbook of Aeronautical Knowledge (FAA-H-8083-25C) — the FAA's primary educational handbook for student pilots covering aerodynamics, systems, weather, navigation, and regulations."},
        ],
        'callouts': [
            {'variant': 'info', 'label': 'FAA Regulation', 'body': '14 CFR §91.3 states: "The pilot in command of an aircraft is directly responsible for, and is the final authority as to, the operation of that aircraft." This is the foundation of all pilot authority and responsibility.'},
            {'variant': 'tip', 'label': 'Study Tip', 'body': 'The FAA Knowledge Test has 60 questions drawn from a bank of hundreds. As you study each chapter, focus on understanding concepts — not memorizing answers. Understanding why something is true makes every question answerable.'},
        ],
        'source_page_ref': 'pp.1-1 to 1-6',
        'source_section_ref': 'PHAK Ch.1 — Introduction to Flying',
    },
    '1.2': {
        'title': 'Student Pilot Certificate',
        'teaching_text': """Before you can fly solo — fly without an instructor on board — you need a student pilot certificate. This is your first official FAA credential.

ELIGIBILITY REQUIREMENTS

To be eligible for a student pilot certificate (14 CFR Part 61, Subpart C):

• Minimum age: 16 years old for powered aircraft (14 for gliders and balloons)
• English language proficiency: You must be able to read, speak, write, and understand English
• Medical certificate: You must hold a valid medical certificate (for powered aircraft)

MEDICAL CERTIFICATES

The FAA requires pilots to meet medical standards. A medical certificate is issued by an Aviation Medical Examiner (AME) — a physician authorized by the FAA.

There are three classes of medical certificates:

First Class — Required for Airline Transport Pilots (ATP). Involves the most thorough examination. Valid for 12 months (under age 40) or 6 months (40 and over) for ATP privileges.

Second Class — Required for commercial pilots exercising commercial privileges. Valid for 12 months for commercial privileges.

Third Class — Sufficient for student pilots and private pilots. Involves a basic health examination. Valid for 60 months (under age 40) or 24 months (40 and over).

For your private pilot certificate, you need at least a third-class medical certificate.

BasicMed is an alternative to a traditional medical for pilots who previously held an FAA medical. Under BasicMed (14 CFR Part 68), a pilot can fly with a driver's license as medical evidence, subject to limitations (no more than 6 passengers, not for compensation, not above FL180, not faster than 250 knots). Consult your flight instructor about whether BasicMed is appropriate for you.

GETTING YOUR STUDENT CERTIFICATE

The student pilot certificate is issued by a Flight Standards District Office (FSDO) or through a DPE or an authorized flight instructor. The process is straightforward — complete FAA Form 8710-1 (Airman Certificate Application), provide identification, and show your medical certificate.

Your student pilot certificate never expires, but the medical certificate it relies upon does.

SOLO FLIGHT REQUIREMENTS

Before your instructor allows you to fly solo, you must:

1. Have a student pilot certificate
2. Have a current medical certificate
3. Have received and logged ground and flight training in the aircraft to be flown
4. Have a solo endorsement from your flight instructor (valid for 90 days)
5. Demonstrate proficiency to your instructor's satisfaction

The solo endorsement is your instructor's signature in your logbook stating that you are ready and authorized to fly alone. It is one of the most significant moments in a pilot's training.

LOGGING FLIGHT TIME

You must log all flight time required for a certificate or rating. A pilot logbook records:

• Date and aircraft registration
• Aircraft make, model, and category
• Points of departure and arrival
• Type of pilot experience (solo, PIC, dual received)
• Conditions of flight (day, night, actual IMC, simulated IMC)
• Takeoffs and landings (day and night)
• Total flight duration

Your logbook is a legal document. Keep it accurate and retain it permanently.

AIRMAN CERTIFICATION STANDARDS (ACS)

The FAA has published the Airman Certification Standards (ACS) for the private pilot certificate. The ACS defines exactly what you must know, consider, and do to pass the checkride. Every element of your training maps to a specific ACS task code.

This course aligns every lesson with the relevant ACS task codes. When you see a tag like PA.I.A.K1, it means Private Pilot, Area I, Task A, Knowledge item 1. Your DPE will evaluate you against these exact standards on your checkride day.""",
        'key_terms': [
            {'word': 'Student Pilot Certificate', 'definition': 'FAA certificate required to fly solo. Issued to pilots aged 16+ (14+ for gliders). No expiration date, but requires a current medical and flight instructor endorsements.'},
            {'word': 'Aviation Medical Examiner (AME)', 'definition': 'An FAA-authorized physician who conducts aviation medical examinations and issues medical certificates.'},
            {'word': 'Third-Class Medical', 'definition': 'The minimum medical certificate required for private pilot privileges. Valid 60 months (under age 40) or 24 months (age 40 and over). Issued after a basic health examination.'},
            {'word': 'Solo Endorsement', 'definition': 'A flight instructor signature in a student\'s logbook authorizing solo flight. Valid for 90 days. Required before a student may fly without an instructor aboard.'},
            {'word': 'Airman Certification Standards (ACS)', 'definition': 'FAA document defining the knowledge, risk management, and skill standards for each pilot certificate and rating. Replaced the Practical Test Standards (PTS). Designation: FAA-S-ACS-6C for private pilot.'},
            {'word': 'BasicMed', 'definition': 'An alternative to traditional FAA medical certificates (14 CFR Part 68) allowing pilots who previously held an FAA medical to fly under certain limitations using a driver\'s license and a completed medical checklist reviewed by any physician.'},
        ],
        'callouts': [
            {'variant': 'info', 'label': 'Regulatory Reference', 'body': 'Student pilot certificate requirements are found in 14 CFR Part 61, Subpart C (§§61.81–61.95). Solo flight requirements are in §61.87. Review these sections — they are frequently tested on the FAA Knowledge Test.'},
            {'variant': 'warning', 'label': 'Medical Certificate Timing', 'body': 'Your medical certificate must be valid on the day you fly solo or take your checkride. A lapsed medical means you are not legal to fly as PIC. Schedule your medical early and track its expiration date.'},
        ],
        'source_page_ref': 'pp.1-6 to 1-12',
        'source_section_ref': 'PHAK Ch.1 — Student Pilot Certificate',
    },
    '1.3': {
        'title': 'Aviation Careers',
        'teaching_text': """For many pilots, the private certificate is the beginning — not the end. Aviation offers career paths that range from charter and corporate flying to airline operations, flight instruction, agricultural aviation, and beyond.

THE CERTIFICATE LADDER

FAA pilot certificates are structured in a progression of privileges and requirements:

Student Pilot → Private Pilot → Commercial Pilot → Airline Transport Pilot (ATP)

Each step adds privileges and requires additional training and experience.

Private Pilot Certificate
• Minimum 40 flight hours (national average: 60-70)
• Can fly for personal and recreational purposes
• Can carry passengers
• Cannot be compensated for flying (with limited exceptions)
• 60-question FAA Knowledge Test

Commercial Pilot Certificate
• Requires private certificate + instrument rating
• Minimum 250 total flight hours
• Can be compensated for certain flying activities
• Higher aeronautical knowledge and flight proficiency standards

Airline Transport Pilot (ATP)
• Highest FAA certificate
• Required to act as Captain of an airliner
• Minimum 1,500 total flight hours (1,000 for certain graduates of aviation programs)
• Rigorous written and practical tests
• Must hold a first-class medical

RATINGS AND ENDORSEMENTS

In addition to certificates, pilots can earn ratings that authorize additional operations:

Instrument Rating (IR) — Required to fly in clouds (IMC — Instrument Meteorological Conditions). Adds significant capability and safety margin. Required before earning a commercial certificate.

Multi-Engine Rating — Authorizes flight in aircraft with more than one engine.

Type Ratings — Required to fly specific large aircraft or turbojet aircraft.

Flight Instructor Certificate (CFI) — Authorizes teaching student pilots. A common stepping stone for pilots building hours toward airline careers.

CAREER PATHS

Regional Airlines operate turboprop and regional jet aircraft (CRJ, ERJ, ATR). Entry-level positions typically require 1,500 hours and an ATP certificate. First officers earn $50,000-$90,000; captains significantly more.

Major Airlines (United, Delta, American, Southwest) require thousands of hours and years of experience. Senior captains earn $200,000-$400,000+.

Corporate/Charter Aviation offers more varied schedules and aircraft types. Pay varies widely by company and aircraft type.

Flight Instruction is how most professional pilots build their initial hours. CFIs earn $30,000-$60,000 typically, though demand fluctuates.

Agricultural Aviation (crop dusting) is a specialized field requiring precise low-level flying skills. Experienced agricultural pilots are in high demand.

THE AVIATION INDUSTRY

Aviation is a resilient industry despite cyclical downturns. The FAA projects a significant shortage of pilots over the next 20 years as the large cohort of pilots hired in the 1980s reaches mandatory retirement age (65 for airline captains).

For pilots earning their private certificate today with professional aspirations, the timing is favorable.

BEYOND FLYING

Aviation careers extend beyond the cockpit. Air traffic controllers, aviation mechanics (A&P), aircraft dispatchers, and aviation management all require FAA certification and offer strong career prospects.

Whatever your path, the private pilot certificate you are working toward is the first and most important step. Every airline captain, every test pilot, every charter pilot started exactly where you are now — learning the fundamentals from the PHAK.""",
        'key_terms': [
            {'word': 'Commercial Pilot Certificate', 'definition': 'FAA certificate allowing pilots to be compensated for certain flight operations. Requires 250 total flight hours, private certificate, and instrument rating. Tested against higher standards than private pilot.'},
            {'word': 'Airline Transport Pilot (ATP)', 'definition': 'Highest FAA pilot certificate. Required to act as Captain (PIC) of an airliner. Requires minimum 1,500 hours total flight time and a first-class medical certificate.'},
            {'word': 'Instrument Rating (IR)', 'definition': 'FAA rating added to a pilot certificate authorizing flight in instrument meteorological conditions (IMC — inside clouds). Requires dedicated training in navigation, approaches, and flying by instruments alone.'},
            {'word': 'Certified Flight Instructor (CFI)', 'definition': 'FAA certificate authorizing the holder to provide flight training to student pilots. Most professional pilots earn a CFI certificate to build flight hours toward airline minimums.'},
            {'word': 'IMC', 'definition': 'Instrument Meteorological Conditions — weather conditions below VFR (Visual Flight Rules) minimums, typically involving clouds, fog, or low visibility. Requires an instrument rating to fly legally in IMC.'},
        ],
        'callouts': [
            {'variant': 'tip', 'label': 'Career Planning', 'body': 'If you have professional aviation aspirations, pursue your instrument rating immediately after your private certificate. The instrument rating dramatically increases your utility as a pilot and is required for all professional certificates.'},
            {'variant': 'info', 'label': 'ATP Minimum Hours', 'body': 'The FAA increased ATP minimums from 250 hours to 1,500 hours following the 2009 Colgan Air accident. Graduates of certain four-year aviation programs may qualify at 1,000 hours with an ATP Restricted (ATP-R) certificate.'},
        ],
        'source_page_ref': 'pp.1-12 to 1-18',
        'source_section_ref': 'PHAK Ch.1 — Aviation Careers',
    },
}

print("=== Seeding Chapter 1 Lesson Content ===\n")

for lesson_num, data in LESSONS.items():
    try:
        lesson = Lesson.objects.get(lesson_number=lesson_num)
    except Lesson.DoesNotExist:
        print(f"  ✗ Lesson {lesson_num} not found — run seed_pilotfaa.py first")
        continue

    content, created = LessonContent.objects.get_or_create(lesson=lesson)

    content.teaching_text      = data['teaching_text']
    content.key_terms          = data['key_terms']
    content.callouts           = data['callouts']
    content.source_page_ref    = data['source_page_ref']
    content.source_section_ref = data['source_section_ref']
    content.content_status     = 'published'
    content.save()

    words = len(data['teaching_text'].split())
    print(f"  ✓ {lesson_num} — {data['title']}")
    print(f"      {words} words · {len(data['key_terms'])} terms · {len(data['callouts'])} callouts")

print(f"\n=== Done — Chapter 1 ready in the LMS ===")
print("Visit http://localhost:3000/lms → Module 1 → Ch.1 → any lesson")


# ── Chapter 1 Quiz — 5 questions ─────────────────────────────────────────────
from pilotfaa_content.models import Chapter
from pilotfaa_assessments.models import QuestionBank, Question
from pilotfaa_content.models import Course

print("\n=== Seeding Chapter 1 Quiz Questions ===\n")

course  = Course.objects.get(slug='private-pilot')
chapter = Chapter.objects.get(chapter_number=1, module__course=course)
bank, _ = QuestionBank.objects.get_or_create(
    course=course, chapter=chapter,
    defaults={
        'name': 'Q1 — Introduction to Flying',
        'bank_type': 'chapter',
        'pass_threshold_pct': 70,
        'is_active': True,
    }
)

QUESTIONS = [
    {
        'question_text': 'Who has final authority and responsibility for the operation and safety of a flight?',
        'options': [
            {'letter': 'A', 'text': 'The aircraft owner',                          'is_correct': False},
            {'letter': 'B', 'text': 'The Pilot in Command (PIC)',                  'is_correct': True},
            {'letter': 'C', 'text': 'The FAA Flight Standards District Office',    'is_correct': False},
            {'letter': 'D', 'text': 'The highest-rated pilot aboard',              'is_correct': False},
        ],
        'correct_letter': 'B',
        'rationale': 'Under 14 CFR §91.3, the Pilot in Command is directly responsible for, and the final authority as to, the operation of the aircraft. This authority cannot be delegated.',
        'rationale_source_ref': 'PHAK FAA-H-8083-25C · Ch.1 p.1-2 · 14 CFR §91.3',
    },
    {
        'question_text': 'What is the minimum age to apply for a student pilot certificate to fly powered aircraft?',
        'options': [
            {'letter': 'A', 'text': '14 years old', 'is_correct': False},
            {'letter': 'B', 'text': '15 years old', 'is_correct': False},
            {'letter': 'C', 'text': '16 years old', 'is_correct': True},
            {'letter': 'D', 'text': '17 years old', 'is_correct': False},
        ],
        'correct_letter': 'C',
        'rationale': 'Per 14 CFR §61.83, an applicant for a student pilot certificate must be at least 16 years of age for powered aircraft. The minimum age is 14 for gliders and balloons.',
        'rationale_source_ref': 'PHAK FAA-H-8083-25C · Ch.1 p.1-6 · 14 CFR §61.83',
    },
    {
        'question_text': 'Which class of medical certificate is required for a student pilot exercising solo flight privileges?',
        'options': [
            {'letter': 'A', 'text': 'First class',  'is_correct': False},
            {'letter': 'B', 'text': 'Second class', 'is_correct': False},
            {'letter': 'C', 'text': 'Third class',  'is_correct': True},
            {'letter': 'D', 'text': 'No medical certificate is required', 'is_correct': False},
        ],
        'correct_letter': 'C',
        'rationale': 'A third-class medical certificate is the minimum required for student pilots and private pilot privileges. It is valid for 60 months for applicants under age 40, and 24 months for those 40 and older.',
        'rationale_source_ref': 'PHAK FAA-H-8083-25C · Ch.1 p.1-7 · 14 CFR §61.23',
    },
    {
        'question_text': 'Which of the following is a hazardous attitude identified by the FAA that can lead to accidents?',
        'options': [
            {'letter': 'A', 'text': 'Caution',        'is_correct': False},
            {'letter': 'B', 'text': 'Invulnerability', 'is_correct': True},
            {'letter': 'C', 'text': 'Conservatism',   'is_correct': False},
            {'letter': 'D', 'text': 'Patience',        'is_correct': False},
        ],
        'correct_letter': 'B',
        'rationale': 'The FAA identifies five hazardous attitudes: Anti-authority, Impulsivity, Invulnerability, Macho, and Resignation. Invulnerability ("It won\'t happen to me") causes pilots to dismiss risk and take unnecessary chances.',
        'rationale_source_ref': 'PHAK FAA-H-8083-25C · Ch.1 p.1-4 · Ch.2 ADM',
    },
    {
        'question_text': 'How long is a flight instructor solo endorsement valid for a student pilot?',
        'options': [
            {'letter': 'A', 'text': '30 days',  'is_correct': False},
            {'letter': 'B', 'text': '60 days',  'is_correct': False},
            {'letter': 'C', 'text': '90 days',  'is_correct': True},
            {'letter': 'D', 'text': '180 days', 'is_correct': False},
        ],
        'correct_letter': 'C',
        'rationale': 'Per 14 CFR §61.87(n), a solo flight endorsement for a student pilot is valid for 90 days. After 90 days, the student must receive additional training and a new endorsement from a flight instructor.',
        'rationale_source_ref': 'PHAK FAA-H-8083-25C · Ch.1 p.1-9 · 14 CFR §61.87(n)',
    },
]

added = 0
for q in QUESTIONS:
    if not Question.objects.filter(bank=bank, question_text=q['question_text']).exists():
        Question.objects.create(
            bank=bank,
            chapter=chapter,
            question_text=q['question_text'],
            question_type='single_choice',
            options=q['options'],
            correct_letter=q['correct_letter'],
            rationale=q['rationale'],
            rationale_source_ref=q['rationale_source_ref'],
            difficulty='medium',
            exam_relevant=True,
            status='active',
        )
        added += 1
        print(f"  ✓ Added: {q['question_text'][:60]}...")

# Update question count on bank
from django.db.models import Count
count = Question.objects.filter(bank=bank, status='active').count()
QuestionBank.objects.filter(id=bank.id).update(question_count=count)

print(f"\n  Q1 bank now has {count} questions ({added} new)")
print(f"\n=== Done — Ch.1 quiz ready ===")
