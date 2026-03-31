"""
seed_chapter2_content.py
Real PHAK-sourced content for Chapter 2 — Aeronautical Decision-Making.
ADM is the highest-weighted chapter on the FAA Knowledge Test.
Run from backend/: python seed_chapter2_content.py
"""
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from pilotfaa_content.models import Lesson, LessonContent
from pilotfaa_assessments.models import QuestionBank, Question, Chapter as ContentChapter

LESSONS = {
    '2.1': {
        'title': 'ADM Overview',
        'teaching_text': """Aeronautical Decision-Making (ADM) is a systematic approach to the mental process of evaluating a given set of circumstances and determining the best course of action. It is not a checklist — it is a way of thinking.

The FAA defines ADM as "a systematic approach to the mental process used by aircraft pilots to consistently determine the best course of action in response to a given set of circumstances."

WHY ADM MATTERS

Most aircraft accidents are not caused by mechanical failure. They are caused by human error. The FAA estimates that human factors contribute to between 70 and 80 percent of all general aviation accidents. Understanding how and why pilots make bad decisions is the first step to preventing them.

ADM emerged from research into why technically proficient pilots with excellent training and current currency still crash airplanes. The answer was almost never mechanical. It was almost always a series of poor decisions — each one individually survivable, but collectively fatal.

THE DECISION-MAKING PROCESS

The ADM process involves three core elements:

1. Perceiving hazards — recognizing that a situation contains risk
2. Processing information — understanding the potential consequences
3. Performing the best action — executing the safest course

This sounds simple, but the human brain routinely fails at each of these steps. Stress, fatigue, complacency, and pressure all degrade our ability to perceive hazards accurately, process information rationally, and act decisively.

THE DECIDE MODEL

One structured approach to ADM is the DECIDE model:

D — Detect. Detect the fact that a change has occurred.
E — Estimate. Estimate the need to counter or react to the change.
C — Choose. Choose a desirable outcome for the flight.
I — Identify. Identify actions to successfully control the change.
D — Do. Do the necessary action to adapt to the change.
E — Evaluate. Evaluate the effect of the action.

The DECIDE model is not meant to be worked through sequentially during a crisis — it is a habitual framework for thinking that, with practice, becomes instinctive.

SITUATIONAL AWARENESS

Central to good ADM is situational awareness — knowing what is happening around you at all times. A pilot with high situational awareness knows:

• Where the aircraft is in space
• What the weather is doing ahead
• What fuel state they are in
• What ATC expects of them
• What their passengers need
• What could go wrong in the next few minutes

Situational awareness degrades when pilots become task-saturated, distracted, or complacent. Recognizing when your situational awareness is low is itself a critical skill.

AUTOMATION AND ADM

Modern glass cockpit aircraft and autopilots can actually degrade situational awareness if pilots become over-reliant on them. The FAA emphasizes that automation is a tool — the pilot remains responsible for the outcome of every flight, regardless of what the automation is doing.

THE CHAIN OF EVENTS

Most accidents can be traced back to a chain of decisions and events — each one small, each one seemingly reasonable at the time — that together create a catastrophic outcome.

Breaking the chain is the goal of ADM. Any link in the chain can be broken:
• Deciding not to depart because of weather
• Diverting to an alternate instead of pushing through
• Declaring an emergency instead of trying to handle it quietly
• Slowing down and getting more information before acting

The FAA calls this "the final authority." You, as PIC, always have the authority and the responsibility to break the chain.""",
        'key_terms': [
            {'word': 'Aeronautical Decision-Making (ADM)', 'definition': 'A systematic approach to the mental process used by pilots to consistently determine the best course of action in response to a given set of circumstances.'},
            {'word': 'DECIDE Model', 'definition': 'A six-step decision-making framework: Detect, Estimate, Choose, Identify, Do, Evaluate. Used to structure pilot responses to changing flight conditions.'},
            {'word': 'Situational Awareness', 'definition': 'The accurate perception of the operational and environmental factors that affect the aircraft, crew, and passengers during a specific period of time. The foundation of sound ADM.'},
            {'word': 'Chain of Events', 'definition': 'The sequence of decisions and circumstances that collectively lead to an accident. Breaking any link in the chain prevents the accident.'},
            {'word': 'Human Factors', 'definition': 'The physical and psychological factors that affect how pilots perceive, process, and respond to information. Human factors account for 70–80% of general aviation accidents.'},
        ],
        'callouts': [
            {'variant': 'warning', 'label': 'FAA Statistic', 'body': 'Human error contributes to 70–80% of all general aviation accidents. Most of these were preventable with better ADM. The PHAK devotes an entire chapter to this because it is the leading cause of accidents — more than weather, mechanical failure, or ATC error combined.'},
            {'variant': 'tip', 'label': 'Exam Focus', 'body': 'ADM questions are among the most common on the FAA Knowledge Test. Know the DECIDE model steps in order, understand the five hazardous attitudes and their antidotes, and be able to identify ADM failures in accident scenarios.'},
        ],
        'source_page_ref': 'pp.2-1 to 2-8',
        'source_section_ref': 'PHAK Ch.2 — Aeronautical Decision-Making',
    },
    '2.2': {
        'title': 'Risk Management',
        'teaching_text': """Risk management is the part of ADM that deals with identifying hazards and mitigating the risk they pose. Every flight involves risk. The goal is not to eliminate risk — it cannot be eliminated — but to understand and manage it to an acceptable level.

HAZARD VS. RISK

These two terms are often confused:

A hazard is a condition or situation that could lead to a negative outcome. Low ceilings are a hazard. Strong crosswinds are a hazard. Fatigue is a hazard.

Risk is the probability and severity of a negative outcome from a hazard. A 300-foot ceiling is a hazard; flying VFR into a 300-foot ceiling is a risk with high probability and high severity.

Pilots must identify hazards, then assess the risk those hazards create given the specific circumstances of the flight.

THE PAVE CHECKLIST

The FAA recommends the PAVE checklist as a structured risk assessment tool:

P — Pilot. What is my physical and mental condition? Am I current? Am I proficient in this aircraft? Am I fatigued?

A — Aircraft. Is the aircraft airworthy? Is it appropriate for this flight? Am I familiar with all its systems?

V — enVironment. What are the weather conditions? What is the terrain? What is the airspace? What time of day?

E — External pressures. Is there pressure to complete this flight? Am I feeling rushed? Would I make this flight if the pressure weren't there?

Each element of PAVE can introduce risk. When multiple elements introduce risk simultaneously, the total risk increases significantly — not additively, but multiplicatively.

THE 1-IN-3 RULE

One rule of thumb: if more than one item in your PAVE assessment raises concern, seriously consider not making the flight. Two red flags together are not twice as risky as one — they compound each other.

IMSAFE CHECKLIST

Before every flight, pilots should run through the IMSAFE personal checklist:

I — Illness. Am I sick or feeling ill?
M — Medication. Am I taking any medications that could affect my judgment or performance?
S — Stress. Am I under significant psychological stress?
A — Alcohol. Have I consumed alcohol within 8 hours? Within 24 hours? (FAA says 8 hours bottle-to-throttle, but 24 hours is safer.)
F — Fatigue. Am I sufficiently rested?
E — Eating. Have I eaten? Low blood sugar degrades cognitive function significantly.

If the answer to any IMSAFE question is yes, the pilot should seriously reconsider the flight or at minimum discuss the issue with a fellow crew member.

RISK MATRIX

The FAA teaches a risk matrix approach: plot the probability of an adverse event (low, medium, high) against the severity of the potential outcome (low, medium, high). High probability + high severity = unacceptable risk. Low probability + low severity = acceptable risk.

This matrix forces pilots to think quantitatively about risk rather than relying on gut feeling, which is easily distorted by optimism bias and external pressure.

EXTERNAL PRESSURES

The most dangerous risks are often not weather or mechanical — they are the subtle pressures that push pilots to make flights they should not make:

• Schedule pressure ("I have passengers who paid for this trip")
• Get-home-itis ("I need to be home tonight for work")
• Peer pressure ("The other pilot flew in this weather, why can't I?")
• Investment bias ("I've already driven to the airport, I'm not turning back now")

Recognizing these pressures and explicitly naming them is the first step to resisting them. The FAA calls this "hazardous thought" — the feeling that you should make the flight even when your rational assessment says otherwise.""",
        'key_terms': [
            {'word': 'Hazard', 'definition': 'A condition or object that could lead to a negative outcome. Distinct from risk — a hazard is the source of danger, risk is the probability and severity of harm from that hazard.'},
            {'word': 'Risk', 'definition': 'The probability and severity of a negative outcome from a given hazard. Risk assessment involves evaluating both how likely harm is and how bad that harm would be.'},
            {'word': 'PAVE Checklist', 'definition': 'A risk assessment framework: Pilot, Aircraft, enVironment, External pressures. Used before flight to identify and evaluate risk across all four domains.'},
            {'word': 'IMSAFE', 'definition': 'A personal fitness-to-fly checklist: Illness, Medication, Stress, Alcohol, Fatigue, Eating. Each item should be assessed before every flight.'},
            {'word': 'Get-Home-Itis', 'definition': 'A dangerous psychological condition where a pilot is so determined to complete a flight or reach a destination that they override rational risk assessment. One of the most common factors in fatal GA accidents.'},
            {'word': 'External Pressure', 'definition': 'Social, financial, or scheduling forces that push a pilot toward making a flight that their risk assessment would otherwise reject. A major contributor to hazardous decisions.'},
        ],
        'callouts': [
            {'variant': 'danger', 'label': 'Get-Home-Itis Kills', 'body': 'Get-home-itis is involved in a disproportionate number of fatal accidents. The FAA scenario: a pilot makes a flight they knew they should not make because of the compelling desire to reach their destination. The antidote is a personal minimums checklist set in advance, when no pressure exists.'},
            {'variant': 'info', 'label': 'Bottle to Throttle', 'body': '14 CFR §91.17 prohibits acting as pilot in command with a blood alcohol content of 0.04% or greater, or within 8 hours of consuming alcohol. The FAA recommends 24 hours for any significant drinking. When in doubt, do not fly.'},
        ],
        'source_page_ref': 'pp.2-8 to 2-18',
        'source_section_ref': 'PHAK Ch.2 — Risk Management',
    },
    '2.3': {
        'title': 'Crew Resource Management',
        'teaching_text': """Crew Resource Management (CRM) began in airline operations after a series of accidents in the 1970s revealed that technically proficient crews were crashing because of poor communication, leadership failures, and inability to use all available resources. The FAA subsequently adapted these principles for single-pilot general aviation under the term Single-Pilot Resource Management (SRM).

WHAT IS CRM?

CRM is the effective use of all available resources — human, hardware, and information — to achieve safe and efficient flight operations.

In a multi-crew environment, CRM involves:
• Communication between crew members
• Leadership and followership
• Task distribution
• Cross-checking and monitoring
• Assertiveness (challenging errors)

In single-pilot operations (SRM), the same principles apply but the "crew" includes:
• ATC (a hugely underutilized resource)
• Passengers (who can provide useful information and assistance)
• Automation (autopilot, GPS, moving maps)
• Checklists and procedures
• The pilot's own cognitive and physical resources

THE FIVE THREATS TO CREW EFFECTIVENESS

1. Error — a mistake by a crew member
2. Undesired aircraft state — the aircraft is not where it should be or doing what it should be doing
3. External threats — weather, ATC, terrain, other aircraft
4. Crew-induced threats — fatigue, complacency, distraction
5. Organizational threats — scheduling pressure, inadequate training

CRM training teaches crews to identify threats before they become errors, and to catch errors before they produce undesired aircraft states.

COMMUNICATION

Good cockpit communication follows standard principles:
• Use standard phraseology (avoids ambiguity)
• Acknowledge all instructions (confirms receipt)
• Challenge errors assertively (no hierarchy should suppress safety)
• Brief missions thoroughly (establishes shared mental model)
• Debrief honestly (identifies errors without blame)

A first officer who catches a captain's error and says nothing because the captain outranks them is a CRM failure. The FAA teaches that all crew members have an obligation to speak up when safety is at risk.

STERILE COCKPIT RULE

During critical phases of flight (below 10,000 feet in commercial ops, or during takeoff and landing in general aviation), all crew conversation should be limited to tasks directly related to the operation of the aircraft. This is the sterile cockpit concept — removing distractions at critical moments.

For single-pilot GA operations, this means: do not make personal calls, conduct unnecessary conversations, or allow passenger chatter during taxi, takeoff, approach, and landing.

AUTOMATION MANAGEMENT

Modern aircraft with glass cockpits and autopilots present a CRM challenge: pilots may become so reliant on automation that their manual flying skills degrade and their situational awareness suffers.

CRM principles applied to automation:
• Know what the automation is doing at all times
• Understand why the automation is doing it
• Be prepared to take over manually immediately
• Do not allow automation to create complacency
• Recognize automation errors quickly

SINGLE-PILOT RESOURCE MANAGEMENT

SRM skills assessed on the private pilot practical test include:

• Task management — prioritizing tasks under workload
• Automation management — using cockpit technology appropriately
• Risk management — applying PAVE and IMSAFE
• Situational awareness — knowing the big picture at all times
• Controlled flight into terrain (CFIT) awareness — knowing where the terrain is
• Aeronautical decision-making — the overall framework

All of these are evaluated during the checkride, not just the ability to fly the aircraft.""",
        'key_terms': [
            {'word': 'Crew Resource Management (CRM)', 'definition': 'The effective use of all available resources — human, hardware, and information — to achieve safe and efficient flight operations. Originally developed for airline operations, now applied to all aviation.'},
            {'word': 'Single-Pilot Resource Management (SRM)', 'definition': 'The application of CRM principles to single-pilot operations. Includes use of ATC, automation, passengers, checklists, and the pilot\'s own cognitive resources as tools for safe decision-making.'},
            {'word': 'Sterile Cockpit', 'definition': 'The practice of limiting crew communications to flight-critical tasks during critical phases of flight (taxi, takeoff, approach, landing). Reduces distraction at moments when situational awareness is most critical.'},
            {'word': 'Undesired Aircraft State', 'definition': 'A situation in which the aircraft is not in the position, attitude, or configuration intended by the crew. One of the five threats in Threat and Error Management (TEM).'},
            {'word': 'Task Management', 'definition': 'The ability to prioritize and sequence cockpit tasks appropriately under varying workload conditions. A core SRM skill evaluated on the private pilot practical test.'},
        ],
        'callouts': [
            {'variant': 'tip', 'label': 'Use ATC', 'body': 'ATC is a massively underutilized resource in general aviation. Pilots can request flight following (radar advisories), ask for weather information, request vectors, or simply let ATC know they are having difficulty. Declaring an emergency is always an option and costs nothing. ATC exists to help — use it.'},
            {'variant': 'info', 'label': 'Checkride SRM Assessment', 'body': 'The DPE on your checkride is assessing SRM throughout the flight — not just during designated maneuvers. How you handle unexpected situations, how you use automation, how you divide attention and manage tasks all count. The ACS evaluates "risk management" as a separate component of every task.'},
        ],
        'source_page_ref': 'pp.2-18 to 2-30',
        'source_section_ref': 'PHAK Ch.2 — Crew Resource Management',
    },
}

# 5 exam-quality questions for Chapter 2
QUESTIONS = [
    ('What does the acronym IMSAFE stand for?',
     [('A','Instrument, Minimums, Speed, Altitude, Fuel, Equipment',False),
      ('B','Illness, Medication, Stress, Alcohol, Fatigue, Eating',True),
      ('C','IFR, MEA, Safety, Airspace, Fuel, Endurance',False),
      ('D','Inspection, Maintenance, Systems, Avionics, Fuel, Equipment',False)],
     'B',
     'IMSAFE is a personal preflight checklist: Illness, Medication, Stress, Alcohol, Fatigue, Eating. Each item should be evaluated before every flight.',
     'PHAK FAA-H-8083-25C · Ch.2 p.2-16'),

    ('Which hazardous attitude is characterized by the thought "Do something—anything—NOW!"?',
     [('A','Anti-authority',False),('B','Macho',False),('C','Impulsivity',True),('D','Invulnerability',False)],
     'C',
     'Impulsivity is the hazardous attitude characterized by the need to act immediately without thinking. The antidote is: "Not so fast. Think first."',
     'PHAK FAA-H-8083-25C · Ch.2 p.2-5'),

    ('A pilot continues a VFR flight into instrument meteorological conditions (IMC) because passengers are depending on arriving by a specific time. This is an example of which hazardous attitude?',
     [('A','Anti-authority',False),('B','Get-home-itis (Resignation)',False),('C','External pressure leading to poor ADM',True),('D','Invulnerability',False)],
     'C',
     'Continuing VFR into IMC due to passenger schedule pressure is a classic example of external pressure overriding rational risk assessment — a primary cause of fatal GA accidents.',
     'PHAK FAA-H-8083-25C · Ch.2 p.2-11'),

    ('What is the correct sequence of the DECIDE model?',
     [('A','Detect, Evaluate, Choose, Identify, Do, Estimate',False),
      ('B','Detect, Estimate, Choose, Identify, Do, Evaluate',True),
      ('C','Define, Examine, Consider, Identify, Do, Evaluate',False),
      ('D','Detect, Estimate, Consider, Implement, Do, Evaluate',False)],
     'B',
     'The DECIDE model: Detect (a change), Estimate (the need to react), Choose (a desirable outcome), Identify (actions), Do (the action), Evaluate (the effect).',
     'PHAK FAA-H-8083-25C · Ch.2 p.2-4'),

    ('The PAVE checklist is used to',
     [('A','Check aircraft systems before engine start',False),
      ('B','Identify risks in the pilot, aircraft, environment, and external pressures',True),
      ('C','Plan an IFR flight using weather products',False),
      ('D','Verify ATC clearance before entering controlled airspace',False)],
     'B',
     'PAVE is a risk assessment tool covering four domains: Pilot (physical/mental fitness), Aircraft (airworthiness/suitability), enVironment (weather/terrain/airspace), External pressures (schedule/passengers/cost).',
     'PHAK FAA-H-8083-25C · Ch.2 p.2-9'),
]

print("=== Seeding Chapter 2 Lesson Content ===\n")

# Seed lesson content
for lesson_num, data in LESSONS.items():
    try:
        lesson = Lesson.objects.get(lesson_number=lesson_num)
    except Lesson.DoesNotExist:
        print(f"  ✗ Lesson {lesson_num} not found — run seed_pilotfaa.py first")
        continue

    content, _ = LessonContent.objects.get_or_create(lesson=lesson)
    content.teaching_text      = data['teaching_text']
    content.key_terms          = data['key_terms']
    content.callouts           = data['callouts']
    content.source_page_ref    = data['source_page_ref']
    content.source_section_ref = data['source_section_ref']
    content.content_status     = 'published'
    content.save()
    words = len(data['teaching_text'].split())
    print(f"  ✓ {lesson_num} — {data['title']} ({words} words · {len(data['key_terms'])} terms · {len(data['callouts'])} callouts)")

# Seed questions into Chapter 2 bank
try:
    # Find Chapter 2
    from pilotfaa_content.models import Chapter
    from pilotfaa_content.models import Course
    course = Course.objects.get(slug='private-pilot')
    chapter = Chapter.objects.filter(module__course=course, chapter_number=2).first()
    if chapter:
        bank = QuestionBank.objects.filter(course=course, chapter=chapter).first()
        if bank:
            added = 0
            for q_text, options, correct, rationale, cite in QUESTIONS:
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
                    added += 1
            print(f"\n  ✓ Chapter 2 quiz bank: {added} questions added ({Question.objects.filter(bank=bank).count()} total)")
        else:
            print("  ✗ Chapter 2 quiz bank not found")
    else:
        print("  ✗ Chapter 2 not found")
except Exception as e:
    print(f"  ✗ Quiz error: {e}")

print(f"\n=== Done — Chapter 2 ready ===")
print("Visit /lms → Module 1 → Ch.2 → Lessons")
