from rest_framework import serializers
from .models import Course, Module, Chapter, Lesson, LessonContent, VideoAsset, ACSTaskMapping


class ACSTaskMappingSerializer(serializers.ModelSerializer):
    class Meta:
        model = ACSTaskMapping
        fields = ['id', 'acs_area_code', 'acs_task_code', 'knowledge_type',
                  'knowledge_ref', 'is_primary']


class VideoAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoAsset
        fields = ['id', 'asset_version', 'generation_status', 'video_url',
                  'caption_url', 'thumbnail_url', 'duration_seconds',
                  'source_refs', 'is_active', 'generated_at']


class LessonContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonContent
        fields = ['id', 'teaching_text', 'key_terms', 'callouts',
                  'source_page_ref', 'source_section_ref']


class LessonSerializer(serializers.ModelSerializer):
    content     = LessonContentSerializer(read_only=True)
    acs_mappings = ACSTaskMappingSerializer(many=True, read_only=True)
    active_video = serializers.SerializerMethodField()

    class Meta:
        model  = Lesson
        fields = ['id', 'lesson_number', 'title', 'type', 'duration_minutes',
                  'sort_order', 'is_preview', 'status', 'published_at',
                  'content', 'acs_mappings', 'active_video']

    def get_active_video(self, obj):
        asset = obj.video_assets.filter(is_active=True).first()
        return VideoAssetSerializer(asset).data if asset else None


class LessonListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for lesson lists (no content body)."""
    class Meta:
        model  = Lesson
        fields = ['id', 'lesson_number', 'title', 'type', 'duration_minutes',
                  'sort_order', 'is_preview', 'status']


class ChapterSerializer(serializers.ModelSerializer):
    lessons = LessonListSerializer(many=True, read_only=True)

    class Meta:
        model  = Chapter
        fields = ['id', 'chapter_number', 'title', 'source_page_start',
                  'source_page_end', 'sort_order', 'status', 'lessons']


class ModuleSerializer(serializers.ModelSerializer):
    chapters = ChapterSerializer(many=True, read_only=True)

    class Meta:
        model  = Module
        fields = ['id', 'title', 'description', 'sort_order', 'status', 'chapters']


class CourseSerializer(serializers.ModelSerializer):
    modules            = ModuleSerializer(many=True, read_only=True)
    primary_source_ref = serializers.CharField(
        source='primary_source.publication_ref', read_only=True)
    acs_code           = serializers.CharField(read_only=True)

    class Meta:
        model  = Course
        fields = ['id', 'slug', 'name', 'short_name', 'category', 'description',
                  'icon_emoji', 'banner_gradient', 'total_lessons', 'estimated_hours',
                  'sort_order', 'status', 'published_at', 'primary_source_ref',
                  'acs_code', 'modules']


class CourseListSerializer(serializers.ModelSerializer):
    """Lightweight — no nested modules."""
    primary_source_ref = serializers.CharField(
        source='primary_source.publication_ref', read_only=True)

    class Meta:
        model  = Course
        fields = ['id', 'slug', 'name', 'short_name', 'category', 'icon_emoji',
                  'banner_gradient', 'total_lessons', 'estimated_hours',
                  'sort_order', 'status', 'primary_source_ref', 'acs_code']
