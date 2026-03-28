from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone
from .models import BlogPost, Category, Tag
from .serializers import (
    BlogPostSerializer, BlogPostListSerializer, BlogPostCreateSerializer,
    CategorySerializer, TagSerializer
)
from users.permission_classes import HasFeaturePermission
from users.permission_utils import has_permission
import logging

logger = logging.getLogger(__name__)


class BlogPostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


@api_view(['GET'])
@permission_classes([AllowAny])
def list_posts(request):
    """List all blog posts (public can see published, admin can see all)"""
    try:
        queryset = BlogPost.objects.all()
        user = request.user
        
        # Public users can only see published posts
        # Admin users with blog.view permission can see all posts
        if not user.is_authenticated:
            queryset = queryset.filter(status='published')
        elif not has_permission(user, 'blog.view'):
            queryset = queryset.filter(status='published')
        else:
            # Filter by status if provided
            status_filter = request.query_params.get('status', None)
            if status_filter:
                queryset = queryset.filter(status=status_filter)
        
        # Filter by category
        category_slug = request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by tag
        tag_slug = request.query_params.get('tag', None)
        if tag_slug:
            queryset = queryset.filter(tags__slug=tag_slug)
        
        # Search
        search = request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(excerpt__icontains=search) |
                Q(content__icontains=search)
            )
        
        # Filter by language
        language = request.query_params.get('language', None)
        if language:
            queryset = queryset.filter(language=language)
        
        # Ordering
        ordering = request.query_params.get('ordering', '-published_at')
        if ordering:
            queryset = queryset.order_by(ordering)
        
        # Pagination
        paginator = BlogPostPagination()
        page = paginator.paginate_queryset(queryset, request)
        
        if page is not None:
            serializer = BlogPostListSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = BlogPostListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        logger.error(f"Error listing blog posts: {str(e)}")
        return Response({
            'error': 'Failed to retrieve blog posts',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_post(request, post_id):
    """Get a single blog post by ID"""
    try:
        post = get_object_or_404(BlogPost, id=post_id)
        user = request.user
        
        # Public users can only see published posts
        if not user.is_authenticated:
            if post.status != 'published':
                return Response({
                    'error': 'Post not found'
                }, status=status.HTTP_404_NOT_FOUND)
        elif not has_permission(user, 'blog.view'):
            if post.status != 'published':
                return Response({
                    'error': 'Post not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BlogPostSerializer(post)
        return Response(serializer.data)
    
    except Exception as e:
        logger.error(f"Error retrieving blog post {post_id}: {str(e)}")
        return Response({
            'error': 'Failed to retrieve blog post',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_post_by_slug(request, slug):
    """Get a single blog post by slug"""
    try:
        post = get_object_or_404(BlogPost, slug=slug)
        user = request.user
        
        # Public users can only see published posts
        if not user.is_authenticated:
            if post.status != 'published':
                return Response({
                    'error': 'Post not found'
                }, status=status.HTTP_404_NOT_FOUND)
        elif not has_permission(user, 'blog.view'):
            if post.status != 'published':
                return Response({
                    'error': 'Post not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = BlogPostSerializer(post)
        return Response(serializer.data)
    
    except Exception as e:
        logger.error(f"Error retrieving blog post by slug {slug}: {str(e)}")
        return Response({
            'error': 'Failed to retrieve blog post',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated, HasFeaturePermission('blog.create')])
def create_post(request):
    """Create a new blog post (admin only)"""
    try:
        serializer = BlogPostCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            post = serializer.save()
            response_serializer = BlogPostSerializer(post)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"Error creating blog post: {str(e)}")
        return Response({
            'error': 'Failed to create blog post',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, HasFeaturePermission('blog.edit')])
def update_post(request, post_id):
    """Update a blog post (admin only)"""
    try:
        post = get_object_or_404(BlogPost, id=post_id)
        serializer = BlogPostSerializer(post, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"Error updating blog post {post_id}: {str(e)}")
        return Response({
            'error': 'Failed to update blog post',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, HasFeaturePermission('blog.delete')])
def delete_post(request, post_id):
    """Delete a blog post (admin only)"""
    try:
        post = get_object_or_404(BlogPost, id=post_id)
        post.delete()
        return Response({
            'success': True,
            'message': 'Blog post deleted successfully'
        })
    
    except Exception as e:
        logger.error(f"Error deleting blog post {post_id}: {str(e)}")
        return Response({
            'error': 'Failed to delete blog post',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def featured_posts(request):
    """Get featured blog posts"""
    try:
        queryset = BlogPost.objects.filter(featured=True, status='published').order_by('-published_at')[:5]
        serializer = BlogPostListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        logger.error(f"Error retrieving featured posts: {str(e)}")
        return Response({
            'error': 'Failed to retrieve featured posts',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def recent_posts(request):
    """Get recent blog posts (excludes featured posts to avoid duplication)"""
    try:
        limit = int(request.query_params.get('limit', 5))
        # Exclude featured posts since they're shown separately
        queryset = BlogPost.objects.filter(status='published', featured=False).order_by('-published_at')[:limit]
        serializer = BlogPostListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        logger.error(f"Error retrieving recent posts: {str(e)}")
        return Response({
            'error': 'Failed to retrieve recent posts',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def increment_view_count(request, post_id):
    """Increment view count for a blog post"""
    try:
        post = get_object_or_404(BlogPost, id=post_id)
        post.views_count += 1
        post.save(update_fields=['views_count'])
        return Response({
            'success': True,
            'views_count': post.views_count
        })
    
    except Exception as e:
        logger.error(f"Error incrementing view count for post {post_id}: {str(e)}")
        return Response({
            'error': 'Failed to increment view count',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_categories(request):
    """List all categories"""
    try:
        queryset = Category.objects.all()
        serializer = CategorySerializer(queryset, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        logger.error(f"Error listing categories: {str(e)}")
        return Response({
            'error': 'Failed to retrieve categories',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated, HasFeaturePermission('blog.create')])
def create_category(request):
    """Create a new category (admin only)"""
    try:
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"Error creating category: {str(e)}")
        return Response({
            'error': 'Failed to create category',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def list_tags(request):
    """List all tags"""
    try:
        queryset = Tag.objects.all()
        serializer = TagSerializer(queryset, many=True)
        return Response(serializer.data)
    
    except Exception as e:
        logger.error(f"Error listing tags: {str(e)}")
        return Response({
            'error': 'Failed to retrieve tags',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated, HasFeaturePermission('blog.create')])
def create_tag(request):
    """Create a new tag (admin only)"""
    try:
        serializer = TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        logger.error(f"Error creating tag: {str(e)}")
        return Response({
            'error': 'Failed to create tag',
            'details': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
