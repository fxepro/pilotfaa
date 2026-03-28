from django.contrib import admin
from .models import Enrollment, LessonCompletion, StudySession, Bookmark, Note

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display  = ['user', 'course', 'status', 'progress_pct', 'enrolled_at']
    list_filter   = ['status', 'course']
    search_fields = ['user__username', 'user__email']
    raw_id_fields = ['user', 'course', 'last_lesson']

@admin.register(LessonCompletion)
class LessonCompletionAdmin(admin.ModelAdmin):
    list_display  = ['user', 'lesson', 'completed', 'watch_pct', 'read_pct']
    list_filter   = ['completed']
    search_fields = ['user__username', 'lesson__title']
    raw_id_fields = ['user', 'lesson', 'enrollment']

@admin.register(StudySession)
class StudySessionAdmin(admin.ModelAdmin):
    list_display  = ['user', 'activity_type', 'started_at', 'duration_seconds']
    list_filter   = ['activity_type']
    search_fields = ['user__username']

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display  = ['user', 'title', 'category', 'created_at']
    list_filter   = ['category']
    search_fields = ['user__username', 'title']

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display  = ['user', 'title', 'updated_at', 'deleted_at']
    list_filter   = ['deleted_at']
    search_fields = ['user__username', 'title']