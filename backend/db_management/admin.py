"""
Django admin configuration for Database Management
"""

from django.contrib import admin
from .models import DatabaseConnection, DatabaseActivityLog, DatabasePerformanceMetrics


@admin.register(DatabaseConnection)
class DatabaseConnectionAdmin(admin.ModelAdmin):
    """Admin interface for DatabaseConnection"""
    list_display = [
        'name', 'engine', 'host', 'port', 'database_name',
        'status', 'is_active', 'is_default', 'created_by', 'created_at'
    ]
    list_filter = ['engine', 'status', 'is_active', 'is_default', 'created_at']
    search_fields = ['name', 'host', 'database_name', 'username']
    readonly_fields = ['id', 'created_at', 'updated_at', 'last_checked', 'status']
    fieldsets = (
        ('Connection Details', {
            'fields': ('name', 'engine', 'host', 'port', 'database_name', 'schema')
        }),
        ('Credentials', {
            'fields': ('username', 'password')
        }),
        ('Status', {
            'fields': ('is_active', 'is_default', 'status', 'last_checked')
        }),
        ('Metadata', {
            'fields': ('id', 'created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def save_model(self, request, obj, form, change):
        """Set created_by on save"""
        if not change:  # Only on create
            obj.created_by = request.user
        super().save_model(request, obj, form, change)
    
    actions = ['test_connections', 'activate_connections', 'deactivate_connections']
    
    def test_connections(self, request, queryset):
        """Test selected connections"""
        from .db_clients import DatabaseClientFactory
        from django.utils import timezone
        
        for connection in queryset:
            success, error = DatabaseClientFactory.test_connection(connection)
            connection.status = 'connected' if success else 'error'
            connection.last_checked = timezone.now()
            connection.save(update_fields=['status', 'last_checked'])
        
        self.message_user(request, f"Tested {queryset.count()} connection(s)")
    test_connections.short_description = "Test selected connections"
    
    def activate_connections(self, request, queryset):
        """Activate selected connections"""
        queryset.update(is_active=True)
        self.message_user(request, f"Activated {queryset.count()} connection(s)")
    activate_connections.short_description = "Activate selected connections"
    
    def deactivate_connections(self, request, queryset):
        """Deactivate selected connections"""
        queryset.update(is_active=False)
        self.message_user(request, f"Deactivated {queryset.count()} connection(s)")
    deactivate_connections.short_description = "Deactivate selected connections"


@admin.register(DatabaseActivityLog)
class DatabaseActivityLogAdmin(admin.ModelAdmin):
    """Admin interface for DatabaseActivityLog"""
    list_display = [
        'connection', 'user', 'action', 'success', 'execution_time',
        'rows_returned', 'created_at'
    ]
    list_filter = ['action', 'success', 'created_at', 'connection']
    search_fields = ['connection__name', 'user__username', 'table_name', 'query']
    readonly_fields = ['id', 'created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Activity Details', {
            'fields': ('connection', 'user', 'action', 'success')
        }),
        ('Query Information', {
            'fields': ('query', 'table_name', 'schema_name'),
            'classes': ('collapse',)
        }),
        ('Results', {
            'fields': ('execution_time', 'rows_returned', 'error_message')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        """Disable manual creation of logs"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Make logs read-only"""
        return False


@admin.register(DatabasePerformanceMetrics)
class DatabasePerformanceMetricsAdmin(admin.ModelAdmin):
    """Admin interface for DatabasePerformanceMetrics"""
    list_display = [
        'connection', 'ping_time', 'query_time', 'table_count',
        'database_size', 'created_at'
    ]
    list_filter = ['created_at', 'connection']
    search_fields = ['connection__name']
    readonly_fields = ['id', 'created_at']
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Connection', {
            'fields': ('connection',)
        }),
        ('Timing Metrics', {
            'fields': ('ping_time', 'query_time', 'total_collection_time')
        }),
        ('Database Statistics', {
            'fields': ('database_size', 'table_count', 'index_count', 'connection_count')
        }),
        ('Performance Metrics', {
            'fields': ('cache_hit_ratio', 'uptime', 'version')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        """Disable manual creation of metrics"""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Make metrics read-only"""
        return False
