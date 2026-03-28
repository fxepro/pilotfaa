"""
pilotfaa_assessments/serializers.py
"""
from rest_framework import serializers
from .models import QuestionBank, Question, QuizAttempt, QuestionResponse, TopicMastery


class QuestionBankSerializer(serializers.ModelSerializer):
    chapter_title = serializers.CharField(source='chapter.title', read_only=True, default=None)

    class Meta:
        model  = QuestionBank
        fields = ['id', 'name', 'bank_type', 'question_count',
                  'time_limit_seconds', 'pass_threshold_pct',
                  'chapter', 'chapter_title', 'is_active']


class QuestionSerializer(serializers.ModelSerializer):
    """Full question — sent during an active quiz attempt."""
    class Meta:
        model  = Question
        fields = ['id', 'question_text', 'question_type', 'options',
                  'difficulty', 'acs_task_code']
        # correct_letter and rationale are excluded here — sent only after answer


class QuestionWithAnswerSerializer(QuestionSerializer):
    """Includes correct answer and rationale — sent after student answers."""
    class Meta(QuestionSerializer.Meta):
        fields = QuestionSerializer.Meta.fields + [
            'correct_letter', 'rationale', 'rationale_source_ref', 'phak_page'
        ]


class QuizAttemptSerializer(serializers.ModelSerializer):
    bank_name = serializers.CharField(source='bank.name', read_only=True)

    class Meta:
        model  = QuizAttempt
        fields = ['id', 'bank', 'bank_name', 'attempt_type', 'score_pct',
                  'correct_count', 'total_questions', 'time_seconds',
                  'passed', 'completed', 'started_at', 'completed_at']
        read_only_fields = ['score_pct', 'passed', 'completed',
                            'started_at', 'completed_at']


class QuestionResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model  = QuestionResponse
        fields = ['id', 'question', 'selected_letter', 'selected_letters',
                  'is_correct', 'time_seconds', 'answered_at']
        read_only_fields = ['is_correct', 'answered_at']


class TopicMasterySerializer(serializers.ModelSerializer):
    chapter_title = serializers.CharField(source='chapter.title', read_only=True)

    class Meta:
        model  = TopicMastery
        fields = ['id', 'chapter', 'chapter_title', 'acs_task_code',
                  'attempts_count', 'correct_count', 'mastery_pct',
                  'is_weak', 'last_attempted_at']
