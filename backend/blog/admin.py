from django.contrib import admin
from .models import BlogPost, Category, Tag, BlogAuthor


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order', 'created_at']
    list_editable = ['order']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name', 'description']


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'category', 'status', 'featured', 'published_at', 'views_count', 'created_at']
    list_filter = ['status', 'featured', 'category', 'tags', 'language', 'created_at']
    search_fields = ['title', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['tags']
    readonly_fields = ['created_at', 'updated_at', 'views_count', 'read_time']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'author', 'category', 'tags')
        }),
        ('Publication', {
            'fields': ('status', 'featured', 'published_at')
        }),
        ('Media', {
            'fields': ('featured_image', 'og_image')
        }),
        ('SEO', {
            'fields': ('meta_title', 'meta_description', 'meta_keywords')
        }),
        ('Multi-language', {
            'fields': ('language', 'translations')
        }),
        ('Statistics', {
            'fields': ('views_count', 'read_time', 'created_at', 'updated_at')
        }),
    )


@admin.register(BlogAuthor)
class BlogAuthorAdmin(admin.ModelAdmin):
    list_display = ['user', 'get_user_email']
    search_fields = ['user__username', 'user__email', 'bio']
    readonly_fields = []
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'Email'
