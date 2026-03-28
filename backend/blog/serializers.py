from rest_framework import serializers
from django.contrib.auth.models import User
from .models import BlogPost, Category, Tag, BlogAuthor


class AuthorSerializer(serializers.ModelSerializer):
    """Serializer for blog author (User)"""
    full_name = serializers.SerializerMethodField()
    avatar_url = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'avatar_url']
    
    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username
    
    def get_avatar_url(self, obj):
        if hasattr(obj, 'blog_author_profile') and obj.blog_author_profile.avatar:
            return obj.blog_author_profile.avatar.url
        return None


class CategorySerializer(serializers.ModelSerializer):
    """Serializer for category"""
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'order', 'post_count', 'created_at']
        read_only_fields = ['slug', 'created_at']
    
    def get_post_count(self, obj):
        return obj.posts.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    """Serializer for tag"""
    post_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug', 'post_count', 'created_at']
        read_only_fields = ['slug', 'created_at']
    
    def get_post_count(self, obj):
        return obj.posts.filter(status='published').count()


class BlogPostListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for blog post list views"""
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'author', 'category', 'tags', 'status', 'featured',
            'published_at', 'created_at', 'updated_at',
            'views_count', 'read_time', 'language'
        ]


class BlogPostSerializer(serializers.ModelSerializer):
    """Full serializer for blog post detail"""
    author = AuthorSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True,
        required=False,
        allow_null=True
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        source='tags',
        write_only=True,
        required=False
    )
    
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'content',
            'featured_image', 'author', 'category', 'category_id',
            'tags', 'tag_ids', 'status', 'featured',
            'published_at', 'created_at', 'updated_at',
            'views_count', 'read_time',
            'meta_title', 'meta_description', 'meta_keywords',
            'og_image', 'language', 'translations'
        ]
        read_only_fields = ['author', 'slug', 'created_at', 'updated_at', 'read_time', 'views_count']
    
    def create(self, validated_data):
        # Set author to current user
        validated_data['author'] = self.context['request'].user
        # Extract category and tags for separate handling
        category = validated_data.pop('category', None)
        tags = validated_data.pop('tags', [])
        
        post = BlogPost.objects.create(**validated_data)
        if category:
            post.category = category
        if tags:
            post.tags.set(tags)
        post.save()
        return post
    
    def update(self, instance, validated_data):
        # Handle category and tags separately
        category = validated_data.pop('category', None)
        tags = validated_data.pop('tags', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if category is not None:
            instance.category = category
        if tags is not None:
            instance.tags.set(tags)
        
        instance.save()
        return instance


class BlogPostCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating blog posts"""
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        required=False,
        allow_null=True
    )
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(),
        many=True,
        source='tags',
        required=False
    )
    
    class Meta:
        model = BlogPost
        fields = [
            'title', 'slug', 'excerpt', 'content',
            'featured_image', 'category_id', 'tag_ids',
            'status', 'featured', 'published_at',
            'meta_title', 'meta_description', 'meta_keywords',
            'og_image', 'language', 'translations'
        ]
    
    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
