from rest_framework import serializers
from .models import Enrollment, LessonCompletion, StudySession, Bookmark, Note


class EnrollmentSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    course_slug = serializers.CharField(source='course.slug', read_only=True)
    last_lesson_title = serializers.SerializerMethodField()

    class Meta:
        model  = Enrollment
        fields = ['id', 'course', 'course_name', 'course_slug', 'status',
                  'progress_pct', 'total_time_seconds', 'last_lesson',
                  'last_lesson_title', 'enrolled_at', 'trial_ends_at', 'completed_at']
        read_only_fields = ['progress_pct', 'total_time_seconds', 'enrolled_at']

    def get_last_lesson_title(self, obj):
        return obj.last_lesson.title if obj.last_lesson else None


class LessonCompletionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = LessonCompletion
        fields = ['id', 'lesson', 'watch_pct', 'read_pct', 'completed',
                  'time_spent_seconds', 'first_accessed_at', 'completed_at']
        read_only_fields = ['first_accessed_at', 'completed_at']


class StudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = StudySession
        fields = ['id', 'lesson', 'activity_type', 'device_type',
                  'duration_seconds', 'started_at', 'ended_at']


class BookmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Bookmark
        fields = ['id', 'lesson', 'title', 'source_ref', 'excerpt',
                  'category', 'tag_label', 'tag_variant', 'created_at']
        read_only_fields = ['created_at']


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Note
        fields = ['id', 'lesson', 'title', 'source_ref', 'body',
                  'updated_at', 'created_at']
        read_only_fields = ['updated_at', 'created_at']
