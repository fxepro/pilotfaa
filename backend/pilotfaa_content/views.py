"""
pilotfaa_content/views.py
All endpoints follow the existing admin platform pattern:
  @api_view + IsAuthenticated permission + axiosInstance Bearer token.
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Course, Module, Chapter, Lesson, LessonContent, VideoAsset
from .serializers import (
    CourseSerializer, CourseListSerializer,
    ChapterSerializer, LessonSerializer,
)


# ── Courses ───────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_list(request):
    """GET /api/pilotfaa/courses/ — catalog visible to the student."""
    qs = Course.objects.filter(status='published').order_by('sort_order')
    serializer = CourseListSerializer(qs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def course_detail(request, slug):
    """GET /api/pilotfaa/courses/<slug>/ — full hierarchy for one course."""
    course = get_object_or_404(Course, slug=slug, status='published')
    serializer = CourseSerializer(course)
    return Response(serializer.data)


# ── Chapters ──────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def chapter_detail(request, chapter_id):
    """GET /api/pilotfaa/chapters/<id>/ — chapter with its lessons."""
    chapter = get_object_or_404(Chapter, id=chapter_id, status='published')
    serializer = ChapterSerializer(chapter)
    return Response(serializer.data)


# ── Lessons ───────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def lesson_detail(request, lesson_id):
    """
    GET /api/pilotfaa/lessons/<id>/
    Checks: lesson must be published OR is_preview (free tier).
    Full content, active video, ACS mappings.
    """
    lesson = get_object_or_404(Lesson, id=lesson_id)

    # Enforce access: published or preview
    if lesson.status != 'published' and not lesson.is_preview:
        return Response(
            {'detail': 'This lesson is not available.'},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = LessonSerializer(lesson)
    return Response(serializer.data)


# ── Admin-only endpoints ──────────────────────────────────────────────────────

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def admin_course_list(request):
    """GET/POST /api/pilotfaa/admin/courses/ — full CRUD for editors."""
    if request.method == 'GET':
        qs = Course.objects.all().order_by('sort_order')
        return Response(CourseListSerializer(qs, many=True).data)

    serializer = CourseSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAdminUser])
def admin_course_detail(request, slug):
    """GET/PATCH/DELETE /api/pilotfaa/admin/courses/<slug>/"""
    course = get_object_or_404(Course, slug=slug)

    if request.method == 'GET':
        return Response(CourseSerializer(course).data)

    if request.method == 'PATCH':
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    course.status = 'archived'
    course.save(update_fields=['status'])
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def publish_lesson(request, lesson_id):
    """PATCH /api/pilotfaa/admin/lessons/<id>/publish/"""
    lesson = get_object_or_404(Lesson, id=lesson_id)
    from django.utils import timezone
    lesson.status = 'published'
    lesson.published_at = timezone.now()
    lesson.save(update_fields=['status', 'published_at'])
    return Response({'status': 'published'})
