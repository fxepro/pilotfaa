import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

import datetime
from pilotfaa_faa.models import FAASourceDocument
from pilotfaa_content.models import Course, Module, Chapter, Lesson, LessonContent

# 1. FAA Source Document
phak, _ = FAASourceDocument.objects.get_or_create(
    short_code='PHAK',
    version='Rev C 2023',
    defaults={
        'full_title': "Pilot's Handbook of Aeronautical Knowledge",
        'publication_ref': 'FAA-H-8083-25C',
        'effective_date': datetime.date(2023, 9, 1),
        'is_current': True,
    }
)
print(f'FAA Source: {phak}')

# 2. Course
course, _ = Course.objects.get_or_create(
    slug='private-pilot',
    defaults={
        'name': 'Private Pilot (Fixed-Wing)',
        'short_name': 'Private Pilot',
        'category': 'fixed_wing_ppl',
        'description': 'Complete FAA Private Pilot ground school based on PHAK FAA-H-8083-25C',
        'icon_emoji': '✈️',
        'primary_source': phak,
        'acs_code': 'FAA-S-ACS-6C',
        'estimated_hours': 40,
        'sort_order': 1,
        'status': 'published',
    }
)
print(f'Course: {course}')

# 3. Module
module, _ = Module.objects.get_or_create(
    course=course,
    sort_order=1,
    defaults={
        'title': 'Module 1 — Foundations of Flight',
        'status': 'published',
    }
)
print(f'Module: {module}')

# 4. Chapter
chapter, _ = Chapter.objects.get_or_create(
    module=module,
    chapter_number=1,
    defaults={
        'source_document': phak,
        'title': 'Introduction to Flying',
        'source_page_start': 1,
        'source_page_end': 20,
        'sort_order': 1,
        'status': 'published',
    }
)
print(f'Chapter: {chapter}')

# 5. Lesson
lesson, _ = Lesson.objects.get_or_create(
    chapter=chapter,
    lesson_number='1.1',
    defaults={
        'title': 'The Decision to Fly',
        'type': 'video_text',
        'duration_minutes': 15,
        'sort_order': 1,
        'is_preview': True,
        'status': 'published',
    }
)
print(f'Lesson: {lesson}')

# 6. Lesson Content
content, _ = LessonContent.objects.get_or_create(
    lesson=lesson,
    defaults={
        'teaching_text': 'Aviation offers a unique perspective on the world. This lesson introduces the fundamental concepts every student pilot needs before their first flight.',
        'key_terms': [
            {'word': 'Pilot in Command (PIC)', 'definition': 'The pilot responsible for the operation and safety of an aircraft during flight.'},
            {'word': 'Student Pilot Certificate', 'definition': 'Required to fly solo, issued by an Aviation Medical Examiner.'},
        ],
        'source_page_ref': 'p.1-1',
        'source_section_ref': 'Introduction to Flying',
        'content_status': 'published',
    }
)
print(f'Content: {content}')
print('All done!')