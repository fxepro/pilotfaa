"""
Database Management Models
"""

import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

SCHEMA = "db_management"

def schema_table(table):
    return f'{SCHEMA}"."{table}'



class DatabaseConnection(models.Model):
    """
    Database connection profiles with encrypted credentials
    """
    ENGINE_CHOICES = [
        ('postgresql', 'PostgreSQL'),
        ('mysql', 'MySQL'),
        ('sqlite', 'SQLite'),
    ]
    
    STATUS_CHOICES = [
        ('connected', 'Connected'),
        ('disconnected', 'Disconnected'),
        ('error', 'Error'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, help_text='Display name for this connection')
    engine = models.CharField(max_length=50, choices=ENGINE_CHOICES, help_text='Database engine type')
    host = models.CharField(max_length=255, help_text='Database host')
    port = models.IntegerField(help_text='Database port')
    username = models.CharField(max_length=255, help_text='Database username')
    password = models.TextField(help_text='Encrypted database password')
    database_name = models.CharField(max_length=255, help_text='Database name')
    schema = models.CharField(max_length=255, null=True, blank=True, help_text='Default schema (optional)')
    is_active = models.BooleanField(default=True, help_text='Is this connection active?')
    is_default = models.BooleanField(default=False, help_text='Is this the default connection?')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='disconnected', help_text='Connection status')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='database_connections')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_checked = models.DateTimeField(null=True, blank=True, help_text='Last connection test time')
    
    class Meta:
        db_table = schema_table("db_management_databaseconnection")
        ordering = ['-created_at']
        verbose_name = 'Database Connection'
        verbose_name_plural = 'Database Connections'
        indexes = [
            models.Index(fields=['engine', 'is_active']),
            models.Index(fields=['status', '-last_checked']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.engine})"
    
    def save(self, *args, **kwargs):
        # Ensure only one default connection per engine
        if self.is_default:
            DatabaseConnection.objects.filter(
                engine=self.engine,
                is_default=True
            ).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class DatabaseActivityLog(models.Model):
    """
    Audit log for all database operations
    """
    ACTION_CHOICES = [
        ('connect', 'Connect'),
        ('disconnect', 'Disconnect'),
        ('query', 'Query'),
        ('preview', 'Preview'),
        ('list_schemas', 'List Schemas'),
        ('list_tables', 'List Tables'),
        ('list_columns', 'List Columns'),
        ('test_connection', 'Test Connection'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    connection = models.ForeignKey(
        DatabaseConnection,
        on_delete=models.CASCADE,
        related_name='activity_logs',
        help_text='Database connection used'
    )
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='database_activities',
        help_text='User who performed the action'
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES, help_text='Action performed')
    query = models.TextField(null=True, blank=True, help_text='SQL query executed (if applicable)')
    table_name = models.CharField(max_length=255, null=True, blank=True, help_text='Table name (if applicable)')
    schema_name = models.CharField(max_length=255, null=True, blank=True, help_text='Schema name (if applicable)')
    execution_time = models.FloatField(null=True, blank=True, help_text='Query execution time in seconds')
    success = models.BooleanField(help_text='Was the operation successful?')
    error_message = models.TextField(null=True, blank=True, help_text='Error message if operation failed')
    rows_returned = models.IntegerField(null=True, blank=True, help_text='Number of rows returned')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = schema_table("db_management_databaseactivitylog")
        ordering = ['-created_at']
        verbose_name = 'Database Activity Log'
        verbose_name_plural = 'Database Activity Logs'
        indexes = [
            models.Index(fields=['connection', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action', '-created_at']),
            models.Index(fields=['success', '-created_at']),
        ]
    
    def __str__(self):
        status = '✅' if self.success else '❌'
        return f"{status} {self.connection.name} - {self.action} ({self.created_at})"


class DatabasePerformanceMetrics(models.Model):
    """
    Historical performance metrics for database connections
    Stores ping times, query times, and database statistics over time
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    connection = models.ForeignKey(
        DatabaseConnection,
        on_delete=models.CASCADE,
        related_name='performance_metrics',
        help_text='Database connection these metrics belong to'
    )
    
    # Timing metrics (in milliseconds)
    ping_time = models.FloatField(null=True, blank=True, help_text='Connection latency in milliseconds')
    query_time = models.FloatField(null=True, blank=True, help_text='Query execution time in milliseconds')
    total_collection_time = models.FloatField(null=True, blank=True, help_text='Total time to collect all metrics in milliseconds')
    
    # Database statistics
    database_size = models.BigIntegerField(null=True, blank=True, help_text='Database size in bytes')
    table_count = models.IntegerField(null=True, blank=True, help_text='Number of tables')
    index_count = models.IntegerField(null=True, blank=True, help_text='Number of indexes')
    connection_count = models.IntegerField(null=True, blank=True, help_text='Active connections')
    
    # Performance metrics (database-specific)
    cache_hit_ratio = models.FloatField(null=True, blank=True, help_text='Cache hit ratio percentage (PostgreSQL)')
    uptime = models.CharField(max_length=255, null=True, blank=True, help_text='Database uptime')
    version = models.TextField(null=True, blank=True, help_text='Database version string')
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    
    class Meta:
        db_table = schema_table("db_management_databaseperformancemetrics")
        ordering = ['-created_at']
        verbose_name = 'Database Performance Metric'
        verbose_name_plural = 'Database Performance Metrics'
        indexes = [
            models.Index(fields=['connection', '-created_at']),
            models.Index(fields=['-created_at']),
        ]
        get_latest_by = 'created_at'
    
    def __str__(self):
        return f"{self.connection.name} - {self.created_at} (Ping: {self.ping_time}ms)"
