"""
pilotfaa_progress/views.py
All progress data is scoped to request.user — students only see their own data.
"""
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from pilotfaa_content.models import Course, Lesson
from .models import Enrollment, LessonCompletion, StudySession, Bookmark, Note
from .serializers import (
    EnrollmentSerializer, LessonCompletionSerializer,
    StudySessionSerializer, BookmarkSerializer, NoteSerializer,
)


# ── Enrollments ───────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_enrollments(request):
    """GET /api/pilotfaa/progress/enrollments/"""
    qs = Enrollment.objects.filter(
        user=request.user, status__in=['active', 'completed']
    ).select_related('course', 'last_lesson').order_by('-enrolled_at')
    return Response(EnrollmentSerializer(qs, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enroll(request):
    """
    POST /api/pilotfaa/progress/enroll/
    Body: { course_id: <int> }
    Creates enrollment if not already enrolled.
    """
    course_id = request.data.get('course_id')
    if not course_id:
        return Response({'detail': 'course_id is required.'}, status=400)

    course = get_object_or_404(Course, id=course_id, status='published')
    enrollment, created = Enrollment.objects.get_or_create(
        user=request.user, course=course,
        defaults={'status': 'active'}
    )
    code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
    return Response(EnrollmentSerializer(enrollment).data, status=code)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def enrollment_detail(request, course_slug):
    """GET /api/pilotfaa/progress/enrollments/<course_slug>/"""
    from pilotfaa_content.models import Course
    course = get_object_or_404(Course, slug=course_slug)
    enrollment = get_object_or_404(Enrollment, user=request.user, course=course)
    return Response(EnrollmentSerializer(enrollment).data)


# ── Lesson Completions ────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def lesson_completions(request, enrollment_id):
    """
    GET  /api/pilotfaa/progress/enrollments/<id>/completions/
    POST /api/pilotfaa/progress/enrollments/<id>/completions/
         Body: { lesson_id, watch_pct, read_pct, time_spent_seconds }
    """
    enrollment = get_object_or_404(Enrollment, id=enrollment_id, user=request.user)

    if request.method == 'GET':
        qs = LessonCompletion.objects.filter(enrollment=enrollment)
        return Response(LessonCompletionSerializer(qs, many=True).data)

    lesson = get_object_or_404(Lesson, id=request.data.get('lesson_id'))
    completion, _ = LessonCompletion.objects.get_or_create(
        user=request.user, lesson=lesson, enrollment=enrollment,
        defaults={'first_accessed_at': timezone.now()}
    )

    watch_pct = int(request.data.get('watch_pct', completion.watch_pct))
    read_pct  = int(request.data.get('read_pct',  completion.read_pct))
    time_s    = int(request.data.get('time_spent_seconds', 0))

    completion.watch_pct = max(completion.watch_pct, watch_pct)
    completion.read_pct  = max(completion.read_pct,  read_pct)
    completion.time_spent_seconds += time_s

    # Mark complete when both thresholds met (80% watch, 70% read)
    if not completion.completed and completion.watch_pct >= 80 and completion.read_pct >= 70:
        completion.completed    = True
        completion.completed_at = timezone.now()

    completion.save()

    # Update enrollment last_lesson
    enrollment.last_lesson = lesson
    enrollment.save(update_fields=['last_lesson', 'updated_at'])

    return Response(LessonCompletionSerializer(completion).data)


# ── Study Sessions ────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_session(request):
    """
    POST /api/pilotfaa/progress/sessions/start/
    Body: { enrollment_id, lesson_id?, activity_type?, device_type? }
    Returns the new session id.
    """
    enrollment = get_object_or_404(
        Enrollment, id=request.data.get('enrollment_id'), user=request.user
    )
    lesson = None
    if lid := request.data.get('lesson_id'):
        lesson = get_object_or_404(Lesson, id=lid)

    session = StudySession.objects.create(
        user          = request.user,
        enrollment    = enrollment,
        lesson        = lesson,
        activity_type = request.data.get('activity_type', 'lesson'),
        device_type   = request.data.get('device_type', ''),
    )
    return Response({'session_id': session.id}, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def end_session(request, session_id):
    """
    PATCH /api/pilotfaa/progress/sessions/<id>/end/
    Closes the session and records duration.
    """
    session = get_object_or_404(StudySession, id=session_id, user=request.user)
    if session.ended_at:
        return Response({'detail': 'Session already closed.'}, status=400)

    session.ended_at = timezone.now()
    delta = session.ended_at - session.started_at
    session.duration_seconds = int(delta.total_seconds())
    session.save(update_fields=['ended_at', 'duration_seconds'])

    # Accumulate on enrollment
    session.enrollment.total_time_seconds += session.duration_seconds
    session.enrollment.save(update_fields=['total_time_seconds', 'updated_at'])

    return Response(StudySessionSerializer(session).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def heatmap(request):
    """
    GET /api/pilotfaa/progress/heatmap/?weeks=17
    Returns daily study totals for the activity heatmap.
    """
    from django.db.models import Sum
    from django.db.models.functions import TruncDate
    weeks = int(request.query_params.get('weeks', 17))
    since = timezone.now() - timezone.timedelta(weeks=weeks)

    rows = (
        StudySession.objects
        .filter(user=request.user, started_at__gte=since, ended_at__isnull=False)
        .annotate(day=TruncDate('started_at'))
        .values('day')
        .annotate(total_seconds=Sum('duration_seconds'))
        .order_by('day')
    )
    return Response(list(rows))


# ── Bookmarks ─────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def bookmarks(request):
    """GET/POST /api/pilotfaa/progress/bookmarks/"""
    if request.method == 'GET':
        category = request.query_params.get('category')
        qs = Bookmark.objects.filter(user=request.user)
        if category and category != 'all':
            qs = qs.filter(category=category)
        return Response(BookmarkSerializer(qs, many=True).data)

    serializer = BookmarkSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=400)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def bookmark_detail(request, bookmark_id):
    """DELETE /api/pilotfaa/progress/bookmarks/<id>/"""
    bookmark = get_object_or_404(Bookmark, id=bookmark_id, user=request.user)
    bookmark.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── Notes ─────────────────────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def notes(request):
    """GET/POST /api/pilotfaa/progress/notes/"""
    if request.method == 'GET':
        qs = Note.objects.filter(user=request.user, deleted_at__isnull=True)
        return Response(NoteSerializer(qs, many=True).data)

    serializer = NoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=400)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def note_detail(request, note_id):
    """GET/PATCH/DELETE /api/pilotfaa/progress/notes/<id>/"""
    note = get_object_or_404(Note, id=note_id, user=request.user, deleted_at__isnull=True)

    if request.method == 'GET':
        return Response(NoteSerializer(note).data)

    if request.method == 'PATCH':
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    # Soft delete
    note.deleted_at = timezone.now()
    note.save(update_fields=['deleted_at'])
    return Response(status=status.HTTP_204_NO_CONTENT)


# ── Dashboard Stats ───────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    """
    GET /api/pilotfaa/progress/stats/
    Returns the four stat cards for the dashboard hero.
    """
    from pilotfaa_assessments.models import QuizAttempt, TopicMastery
    from django.db.models import Avg

    enrollments = Enrollment.objects.filter(user=request.user, status='active')

    # Hours studied
    total_seconds = sum(e.total_time_seconds for e in enrollments)
    hours_studied = round(total_seconds / 3600, 1)

    # Lessons done (across all enrollments)
    lessons_done = LessonCompletion.objects.filter(
        user=request.user, completed=True
    ).count()

    # Quiz average
    avg = QuizAttempt.objects.filter(
        user=request.user, completed=True
    ).aggregate(avg=Avg('score_pct'))['avg']
    quiz_avg = round(avg, 0) if avg else 0

    # Weak topics
    weak_count = TopicMastery.objects.filter(
        user=request.user, is_weak=True
    ).count()

    return Response({
        'hours_studied': hours_studied,
        'lessons_done':  lessons_done,
        'quiz_avg_pct':  quiz_avg,
        'weak_topics':   weak_count,
    })
