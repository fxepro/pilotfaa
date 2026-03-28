from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.utils.text import slugify
from django.urls import reverse
import re


class Category(models.Model):
    """Blog category model"""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True, help_text='Icon name from lucide-react')
    created_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0, help_text='Display order')

    class Meta:
        ordering = ['order', 'name']
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    """Blog tag model"""
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class BlogPost(models.Model):
    """Blog post model"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True, db_index=True)
    excerpt = models.TextField(max_length=500, blank=True)
    content = models.TextField(help_text='Markdown or HTML content')
    featured_image = models.ImageField(upload_to='blog/images/', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='blog_posts')
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='posts')
    tags = models.ManyToManyField(Tag, blank=True, related_name='posts')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    featured = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.IntegerField(default=0)
    read_time = models.IntegerField(default=0, help_text='Estimated read time in minutes')
    
    # SEO fields
    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(max_length=500, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)
    og_image = models.ImageField(upload_to='blog/og_images/', null=True, blank=True)
    
    # Multi-language support
    language = models.CharField(max_length=5, default='en', help_text='Language code (e.g., en, es, fr)')
    translations = models.JSONField(default=dict, blank=True, help_text='Translations of this post')

    class Meta:
        ordering = ['-published_at', '-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['status']),
            models.Index(fields=['published_at']),
            models.Index(fields=['featured']),
            models.Index(fields=['language']),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # Auto-generate slug if not provided
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Auto-set published_at when status changes to published
        if self.status == 'published' and not self.published_at:
            self.published_at = timezone.now()
        
        # Calculate read time (approximate: 200 words per minute)
        if self.content:
            word_count = len(re.findall(r'\w+', self.content))
            self.read_time = max(1, (word_count // 200))
        
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('blog:post_detail', kwargs={'slug': self.slug})


class BlogAuthor(models.Model):
    """Extended author profile for blog"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='blog_author_profile')
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='blog/avatars/', null=True, blank=True)
    social_links = models.JSONField(default=dict, blank=True, help_text='Social media links (Twitter, LinkedIn, etc.)')
    author_page_url = models.URLField(blank=True)

    class Meta:
        verbose_name = 'Blog Author'
        verbose_name_plural = 'Blog Authors'

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - Blog Author"
