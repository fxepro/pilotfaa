from django.contrib import admin
from .models import TutorSession, TutorMessage, MessageCitation, MessageFeedback

@admin.register(TutorSession)
class TutorSessionAdmin(admin.ModelAdmin):
    list_display  = ['user', 'course', 'study_mode', 'message_count', 'started_at', 'ended_at']
    list_filter   = ['study_mode']
    search_fields = ['user__username']
    raw_id_fields = ['user', 'course', 'lesson', 'enrollment']

@admin.register(TutorMessage)
class TutorMessageAdmin(admin.ModelAdmin):
    list_display  = ['session', 'role', 'grounded', 'confidence_score', 'created_at']
    list_filter   = ['role', 'grounded', 'intent_type']
    search_fields = ['content', 'session__user__username']

@admin.register(MessageCitation)
class MessageCitationAdmin(admin.ModelAdmin):
    list_display  = ['message', 'source_doc_ref', 'chapter_ref', 'page_ref']
    search_fields = ['source_doc_ref']

@admin.register(MessageFeedback)
class MessageFeedbackAdmin(admin.ModelAdmin):
    list_display  = ['user', 'message', 'rating', 'created_at']
    list_filter   = ['rating']
    search_fields = ['user__username']