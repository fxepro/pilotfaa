from django.contrib import admin
from .models import Course, Module, Chapter, Lesson, LessonContent, VideoAsset, ACSTaskMapping

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display        = ['name', 'category', 'status', 'total_lessons', 'published_at']
    list_filter         = ['status', 'category']
    search_fields       = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display  = ['title', 'course', 'sort_order', 'status']
    list_filter   = ['status', 'course']
    search_fields = ['title']

@admin.register(Chapter)
class ChapterAdmin(admin.ModelAdmin):
    list_display  = ['chapter_number', 'title', 'module', 'status']
    list_filter   = ['status', 'module__course']
    search_fields = ['title']
    ordering      = ['module__course', 'chapter_number']

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display  = ['lesson_number', 'title', 'chapter', 'type', 'status', 'is_preview', 'duration_minutes']
    list_filter   = ['status', 'type', 'is_preview', 'chapter__module__course']
    search_fields = ['title', 'lesson_number']
    ordering      = ['chapter__module__course', 'chapter__chapter_number', 'sort_order']

@admin.register(LessonContent)
class LessonContentAdmin(admin.ModelAdmin):
    list_display  = ['lesson', 'content_status', 'approved_at']
    list_filter   = ['content_status']
    search_fields = ['lesson__title', 'teaching_text']
    raw_id_fields = ['lesson', 'reviewed_by']

@admin.register(VideoAsset)
class VideoAssetAdmin(admin.ModelAdmin):
    list_display  = ['lesson', 'asset_version', 'generation_status', 'is_active', 'ai_provider']
    list_filter   = ['generation_status', 'is_active', 'ai_provider']

@admin.register(ACSTaskMapping)
class ACSTaskMappingAdmin(admin.ModelAdmin):
    list_display  = ['lesson', 'acs_task_code', 'acs_area_code', 'knowledge_type', 'is_primary']
    list_filter   = ['acs_area_code', 'knowledge_type', 'is_primary']
    search_fields = ['acs_task_code', 'lesson__title']