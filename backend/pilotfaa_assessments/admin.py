from django.contrib import admin
from .models import QuestionBank, Question, QuizAttempt, QuestionResponse, TopicMastery

@admin.register(QuestionBank)
class QuestionBankAdmin(admin.ModelAdmin):
    list_display  = ['name', 'course', 'bank_type', 'question_count', 'pass_threshold_pct', 'is_active']
    list_filter   = ['bank_type', 'is_active', 'course']
    search_fields = ['name']

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display  = ['__str__', 'bank', 'question_type', 'difficulty', 'status', 'exam_relevant']
    list_filter   = ['status', 'difficulty', 'question_type', 'exam_relevant', 'bank__course']
    search_fields = ['question_text', 'acs_task_code', 'rationale_source_ref']
    raw_id_fields = ['bank', 'chapter', 'created_by']

@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display  = ['user', 'bank', 'attempt_type', 'score_pct', 'passed', 'completed', 'started_at']
    list_filter   = ['completed', 'passed', 'attempt_type']
    search_fields = ['user__username']
    raw_id_fields = ['user', 'bank', 'enrollment']

@admin.register(QuestionResponse)
class QuestionResponseAdmin(admin.ModelAdmin):
    list_display  = ['attempt', 'question', 'selected_letter', 'is_correct']
    list_filter   = ['is_correct']
    raw_id_fields = ['attempt', 'question']

@admin.register(TopicMastery)
class TopicMasteryAdmin(admin.ModelAdmin):
    list_display  = ['user', 'chapter', 'acs_task_code', 'mastery_pct', 'is_weak', 'attempts_count']
    list_filter   = ['is_weak']
    search_fields = ['user__username', 'acs_task_code']
    raw_id_fields = ['user', 'chapter']