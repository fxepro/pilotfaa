"""
pilotfaa_tutor/views.py

The /ask/ endpoint calls the Anthropic API (claude-opus-4-5) with a
strict system prompt that grounds responses in FAA materials.
Set ANTHROPIC_API_KEY in backend/.env to activate; falls back to
pattern-matched mock responses when the key is absent.
"""
import os
import re
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from pilotfaa_content.models import Course, Lesson
from pilotfaa_progress.models import Enrollment
from .models import TutorSession, TutorMessage, MessageCitation, MessageFeedback
from .serializers import (
    TutorSessionSerializer, TutorMessageSerializer, MessageFeedbackSerializer
)

SYSTEM_PROMPT = """You are Captain FAA, an AI ground instructor for PilotFAA.com.

RULES (non-negotiable):
1. Answer ONLY from these official FAA sources:
   - PHAK FAA-H-8083-25C (Pilot's Handbook of Aeronautical Knowledge)
   - Private Pilot ACS FAA-S-ACS-6C
   - 14 CFR Parts 61 and 91
   - Aeronautical Information Manual (AIM)
   - Rotorcraft Flying Handbook FAA-H-8083-21B (helicopter questions)
2. Every answer MUST end with a citation: "📄 [Document] · [Chapter/Section] · [Page]"
3. If you cannot ground the answer in the above sources, say so clearly.
4. Never speculate beyond official FAA guidance.
5. Keep answers concise and exam-focused unless the student asks to elaborate."""

# Pattern-matched fallback (used when ANTHROPIC_API_KEY not set)
MOCK_PATTERNS = [
    (r'stall|critical angle|aoa',
     "A stall occurs when the critical angle of attack is exceeded — typically 15–20° for most light aircraft airfoils. Airflow separates from the upper wing surface, causing a sudden loss of lift. A stall is AOA-dependent, not airspeed-dependent — you can stall at any airspeed.",
     "📄 PHAK FAA-H-8083-25C · Ch.5 p.5-12 · ACS PA.I.B.K3"),
    (r'weather|vfr|visibility|ceiling|metar|taf',
     "VFR weather minimums vary by airspace. Class B: 3 SM, clear of clouds. Class C/D/E: 3 SM, 500' below, 1,000' above, 2,000' horizontal. Class G below 1,200' AGL (day): 1 SM, clear of clouds.",
     "📄 14 CFR §91.155 · PHAK Ch.12 · AIM 3-1-4"),
    (r'drag|parasite|induced|ld max|best glide',
     "Two main drag types: Induced drag — byproduct of lift, decreases with airspeed. Parasite drag — form, skin friction, interference — increases with the square of airspeed. L/D max (best glide speed) is where they balance.",
     "📄 PHAK FAA-H-8083-25C · Ch.5 pp.5-7 to 5-10"),
    (r'fuel|30 min|45 min|vfr fuel',
     "VFR fuel requirements (§91.151): Day VFR — fuel to first intended landing plus 30 minutes at normal cruise. Night VFR — plus 45 minutes.",
     "📄 14 CFR §91.151 · PHAK Ch.11"),
]

FALLBACK_RESPONSE = (
    "That's a great question. My answers are grounded in the official FAA materials "
    "listed in my knowledge base. Could you provide more context so I can give the most "
    "accurate, citation-backed answer?",
    "📄 PHAK FAA-H-8083-25C · Private Pilot ACS-6C"
)


def _call_anthropic(message: str, history: list) -> tuple[str, str]:
    """Call Anthropic API. Returns (answer_text, citation_string)."""
    api_key = os.getenv('ANTHROPIC_API_KEY', '')
    if not api_key:
        return _mock_response(message)

    try:
        import anthropic
        client = anthropic.Anthropic(api_key=api_key)

        messages = []
        for h in history[-10:]:  # last 10 messages for context
            if h['role'] in ('user', 'assistant'):
                messages.append({'role': h['role'], 'content': h['content']})
        messages.append({'role': 'user', 'content': message})

        response = client.messages.create(
            model      = 'claude-opus-4-5',
            max_tokens = 1024,
            system     = SYSTEM_PROMPT,
            messages   = messages,
        )
        full_text = response.content[0].text

        # Extract citation from end of response (📄 ... pattern)
        citation_match = re.search(r'📄[^\n]+', full_text)
        citation = citation_match.group(0) if citation_match else ''
        answer   = full_text.replace(citation, '').strip() if citation else full_text

        return answer, citation

    except Exception as exc:
        return f"I encountered an error: {str(exc)}", ""


def _mock_response(message: str) -> tuple[str, str]:
    for pattern, answer, citation in MOCK_PATTERNS:
        if re.search(pattern, message, re.I):
            return answer, citation
    return FALLBACK_RESPONSE


# ── Session management ────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def start_session(request):
    """
    POST /api/pilotfaa/tutor/sessions/
    Body: { course_id, enrollment_id, lesson_id?, study_mode? }
    """
    course = get_object_or_404(Course, id=request.data.get('course_id'))
    enrollment = get_object_or_404(
        Enrollment, id=request.data.get('enrollment_id'), user=request.user
    )
    lesson = None
    if lid := request.data.get('lesson_id'):
        lesson = get_object_or_404(Lesson, id=lid)

    session = TutorSession.objects.create(
        user       = request.user,
        course     = course,
        enrollment = enrollment,
        lesson     = lesson,
        study_mode = request.data.get('study_mode', 'learn'),
    )

    # Store system prompt as first message (not shown to student)
    TutorMessage.objects.create(
        session = session,
        role    = 'system',
        content = SYSTEM_PROMPT,
    )

    return Response(TutorSessionSerializer(session).data, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def end_session(request, session_id):
    """PATCH /api/pilotfaa/tutor/sessions/<id>/end/"""
    session = get_object_or_404(TutorSession, id=session_id, user=request.user)
    session.ended_at = timezone.now()
    session.save(update_fields=['ended_at'])
    return Response({'status': 'closed'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session_messages(request, session_id):
    """GET /api/pilotfaa/tutor/sessions/<id>/messages/ — exclude system messages."""
    session = get_object_or_404(TutorSession, id=session_id, user=request.user)
    msgs = session.messages.exclude(role='system').order_by('created_at')
    return Response(TutorMessageSerializer(msgs, many=True).data)


# ── Ask ───────────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ask(request, session_id):
    """
    POST /api/pilotfaa/tutor/sessions/<id>/ask/
    Body: { message: string }
    Calls Anthropic API (or mock) and stores both user + assistant messages.
    """
    session = get_object_or_404(TutorSession, id=session_id, user=request.user)
    user_text = request.data.get('message', '').strip()
    if not user_text:
        return Response({'detail': 'message is required.'}, status=400)

    # Store user message
    user_msg = TutorMessage.objects.create(
        session = session,
        role    = 'user',
        content = user_text,
    )

    # Build history for context window
    history = list(
        session.messages
        .exclude(role='system')
        .order_by('created_at')
        .values('role', 'content')
    )

    # Call AI
    answer, citation = _call_anthropic(user_text, history)
    grounded = bool(citation)

    # Store AI message
    ai_msg = TutorMessage.objects.create(
        session          = session,
        role             = 'assistant',
        content          = answer,
        grounded         = grounded,
        confidence_score = 0.95 if grounded else 0.40,
        ai_model         = 'claude-opus-4-5' if os.getenv('ANTHROPIC_API_KEY') else 'mock',
    )

    # Store citations
    if citation:
        MessageCitation.objects.create(
            message      = ai_msg,
            source_doc_ref = citation,
        )

    # Increment session message count
    TutorSession.objects.filter(id=session_id).update(
        message_count=session.message_count + 2  # user + assistant
    )

    return Response({
        'user_message': TutorMessageSerializer(user_msg).data,
        'ai_message':   TutorMessageSerializer(ai_msg).data,
    })


# ── Feedback ──────────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_feedback(request, message_id):
    """
    POST /api/pilotfaa/tutor/messages/<id>/feedback/
    Body: { rating, comment? }
    """
    msg = get_object_or_404(TutorMessage, id=message_id)

    # Verify the message belongs to this user's session
    if msg.session.user != request.user:
        return Response({'detail': 'Not found.'}, status=404)

    feedback, created = MessageFeedback.objects.get_or_create(
        message = msg,
        user    = request.user,
        defaults = {
            'rating':  request.data.get('rating', 'helpful'),
            'comment': request.data.get('comment', ''),
        }
    )
    if not created:
        feedback.rating  = request.data.get('rating', feedback.rating)
        feedback.comment = request.data.get('comment', feedback.comment)
        feedback.save()

    return Response(MessageFeedbackSerializer(feedback).data)
