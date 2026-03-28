"""
pilotfaa_assessments/views.py
Quiz flow:
  1. GET  /banks/<bank_id>/questions/  → get question list
  2. POST /attempts/                   → start attempt
  3. POST /attempts/<id>/respond/      → submit one answer
  4. POST /attempts/<id>/complete/     → finalize attempt
  5. GET  /mastery/                    → topic mastery for current user
"""
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import random

from pilotfaa_progress.models import Enrollment
from .models import (
    QuestionBank, Question, QuizAttempt,
    QuestionResponse, TopicMastery
)
from .serializers import (
    QuestionBankSerializer, QuestionSerializer,
    QuestionWithAnswerSerializer, QuizAttemptSerializer,
    QuestionResponseSerializer, TopicMasterySerializer,
)

WEAK_THRESHOLD_PCT    = 70   # mastery_pct below this = weak
WEAK_MIN_ATTEMPTS     = 3    # must have ≥ this many attempts to flag weak


# ── Banks ─────────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bank_list(request, course_id):
    """GET /api/pilotfaa/quiz/banks/?course_id=<id>"""
    qs = QuestionBank.objects.filter(
        course_id=course_id, is_active=True
    ).order_by('bank_type', 'name')
    return Response(QuestionBankSerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bank_questions(request, bank_id):
    """GET /api/pilotfaa/quiz/banks/<id>/questions/ — question list (no answers)."""
    bank = get_object_or_404(QuestionBank, id=bank_id, is_active=True)
    qs   = Question.objects.filter(bank=bank, status='active')
    # Shuffle for mock exam / remediation
    if bank.bank_type in ('mock_exam', 'remediation'):
        qs = list(qs.order_by('?'))
    return Response(QuestionSerializer(qs, many=True).data)


# ── Attempts ──────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_attempt(request):
    """
    POST /api/pilotfaa/quiz/attempts/
    Body: { bank_id, enrollment_id, attempt_type? }
    """
    bank = get_object_or_404(
        QuestionBank, id=request.data.get('bank_id'), is_active=True
    )
    enrollment = get_object_or_404(
        Enrollment, id=request.data.get('enrollment_id'), user=request.user
    )
    attempt = QuizAttempt.objects.create(
        user           = request.user,
        bank           = bank,
        enrollment     = enrollment,
        attempt_type   = request.data.get('attempt_type', 'chapter_quiz'),
        total_questions = bank.question_count,
    )
    return Response(QuizAttemptSerializer(attempt).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_response(request, attempt_id):
    """
    POST /api/pilotfaa/quiz/attempts/<id>/respond/
    Body: { question_id, selected_letter, time_seconds? }
    Returns: { is_correct, correct_letter, rationale, rationale_source_ref }
    """
    attempt  = get_object_or_404(QuizAttempt, id=attempt_id,
                                 user=request.user, completed=False)
    question = get_object_or_404(Question, id=request.data.get('question_id'))
    selected = request.data.get('selected_letter', '')

    is_correct = (selected == question.correct_letter)

    response = QuestionResponse.objects.create(
        attempt         = attempt,
        question        = question,
        selected_letter = selected,
        is_correct      = is_correct,
        time_seconds    = request.data.get('time_seconds'),
    )

    # Update running totals on attempt
    if is_correct:
        attempt.correct_count += 1
    attempt.save(update_fields=['correct_count'])

    # Update question counters
    Question.objects.filter(id=question.id).update(
        times_answered = question.times_answered + 1,
        times_correct  = question.times_correct + (1 if is_correct else 0),
    )

    # Upsert TopicMastery
    if question.acs_task_code:
        _upsert_mastery(request.user, question, is_correct)

    return Response({
        'is_correct':           is_correct,
        'correct_letter':       question.correct_letter,
        'rationale':            question.rationale,
        'rationale_source_ref': question.rationale_source_ref,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def complete_attempt(request, attempt_id):
    """
    POST /api/pilotfaa/quiz/attempts/<id>/complete/
    Body: { time_seconds? }
    Finalizes score, marks passed/failed.
    """
    attempt = get_object_or_404(QuizAttempt, id=attempt_id,
                                user=request.user, completed=False)
    total = attempt.total_questions or 1
    attempt.score_pct     = round((attempt.correct_count / total) * 100)
    attempt.passed        = attempt.score_pct >= attempt.bank.pass_threshold_pct
    attempt.completed     = True
    attempt.completed_at  = timezone.now()
    attempt.time_seconds  = request.data.get('time_seconds')
    attempt.save()
    return Response(QuizAttemptSerializer(attempt).data)


# ── Mastery ───────────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def topic_mastery(request):
    """
    GET /api/pilotfaa/quiz/mastery/
    Returns all mastery rows for the current user.
    Query params: ?weak_only=true
    """
    qs = TopicMastery.objects.filter(user=request.user).select_related('chapter')
    if request.query_params.get('weak_only') == 'true':
        qs = qs.filter(is_weak=True)
    return Response(TopicMasterySerializer(qs.order_by('mastery_pct'), many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def attempt_history(request):
    """GET /api/pilotfaa/quiz/attempts/history/ — past attempts for current user."""
    qs = QuizAttempt.objects.filter(
        user=request.user, completed=True
    ).select_related('bank').order_by('-completed_at')[:50]
    return Response(QuizAttemptSerializer(qs, many=True).data)


# ── Helper ────────────────────────────────────────────────────────────────────

def _upsert_mastery(user, question, is_correct: bool):
    """Update TopicMastery after a question response."""
    from pilotfaa_content.models import Chapter
    chapter = question.chapter
    if not chapter:
        return

    mastery, _ = TopicMastery.objects.get_or_create(
        user=user, chapter=chapter,
        acs_task_code=question.acs_task_code,
    )
    mastery.attempts_count    += 1
    mastery.correct_count     += 1 if is_correct else 0
    mastery.mastery_pct        = round(
        (mastery.correct_count / mastery.attempts_count) * 100, 2
    )
    mastery.is_weak = (
        mastery.mastery_pct < WEAK_THRESHOLD_PCT
        and mastery.attempts_count >= WEAK_MIN_ATTEMPTS
    )
    mastery.last_attempted_at = timezone.now()
    mastery.save()
