"""
pilotfaa_tutor/serializers.py
"""
from rest_framework import serializers
from .models import TutorSession, TutorMessage, MessageCitation, MessageFeedback


class MessageCitationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MessageCitation
        fields = ['id', 'source_doc_ref', 'chapter_ref', 'section_ref',
                  'page_ref', 'sort_order']


class TutorMessageSerializer(serializers.ModelSerializer):
    citations = MessageCitationSerializer(many=True, read_only=True)

    class Meta:
        model  = TutorMessage
        fields = ['id', 'role', 'content', 'intent_type', 'confidence_score',
                  'grounded', 'citations', 'created_at']


class TutorSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TutorSession
        fields = ['id', 'course', 'lesson', 'study_mode',
                  'message_count', 'started_at', 'ended_at']


class MessageFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MessageFeedback
        fields = ['id', 'message', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']
