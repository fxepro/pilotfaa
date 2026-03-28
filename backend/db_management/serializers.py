"""
Serializers for Database Management API
"""

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import DatabaseConnection, DatabaseActivityLog, DatabasePerformanceMetrics
from .encryption import EncryptionService


class DatabaseConnectionSerializer(serializers.ModelSerializer):
    """
    Serializer for DatabaseConnection
    Encrypts password on create/update, excludes it on read
    """
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = DatabaseConnection
        fields = [
            'id', 'name', 'engine', 'host', 'port', 'username', 'password',
            'database_name', 'schema', 'is_active', 'is_default', 'status',
            'created_by', 'created_by_username', 'created_at', 'updated_at',
            'last_checked'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_checked', 'status']
    
    def create(self, validated_data):
        """Create connection with encrypted password"""
        password = validated_data.pop('password', '')
        if password:
            validated_data['password'] = EncryptionService.encrypt_password(password)
        
        # Set created_by to current user
        validated_data['created_by'] = self.context['request'].user
        
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Update connection, encrypting password if provided"""
        password = validated_data.pop('password', None)
        if password is not None:
            if password:  # Only encrypt if password is not empty
                validated_data['password'] = EncryptionService.encrypt_password(password)
            else:
                # Keep existing password if empty string provided
                validated_data['password'] = instance.password
        
        return super().update(instance, validated_data)


class DatabaseConnectionListSerializer(serializers.ModelSerializer):
    """
    List serializer that excludes password
    """
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = DatabaseConnection
        fields = [
            'id', 'name', 'engine', 'host', 'port', 'username',
            'database_name', 'schema', 'is_active', 'is_default', 'status',
            'created_by_username', 'created_at', 'updated_at', 'last_checked'
        ]


class SchemaSerializer(serializers.Serializer):
    """Serializer for schema information"""
    name = serializers.CharField()


class TableSerializer(serializers.Serializer):
    """Serializer for table information"""
    schema = serializers.CharField()
    name = serializers.CharField()
    rows = serializers.IntegerField(required=False, allow_null=True)
    size = serializers.IntegerField(required=False, allow_null=True)  # size in bytes
    indexes = serializers.IntegerField(required=False, allow_null=True)


class ColumnSerializer(serializers.Serializer):
    """Serializer for column information"""
    name = serializers.CharField()
    type = serializers.CharField()
    nullable = serializers.BooleanField()


class RowPreviewSerializer(serializers.Serializer):
    """Serializer for row preview"""
    columns = serializers.ListField(child=serializers.CharField())
    rows = serializers.ListField(child=serializers.DictField())
    count = serializers.IntegerField()


class QueryResultSerializer(serializers.Serializer):
    """Serializer for query execution results"""
    columns = serializers.ListField(child=serializers.CharField())
    rows = serializers.ListField(child=serializers.DictField())
    row_count = serializers.IntegerField()
    execution_time = serializers.FloatField()


class DatabaseActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for activity logs"""
    connection_name = serializers.CharField(source='connection.name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = DatabaseActivityLog
        fields = [
            'id', 'connection', 'connection_name', 'user', 'user_username',
            'action', 'query', 'table_name', 'schema_name', 'execution_time',
            'success', 'error_message', 'rows_returned', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class DatabasePerformanceMetricsSerializer(serializers.ModelSerializer):
    """Serializer for performance metrics"""
    connection_name = serializers.CharField(source='connection.name', read_only=True)
    
    class Meta:
        model = DatabasePerformanceMetrics
        fields = [
            'id', 'connection', 'connection_name', 'ping_time', 'query_time',
            'total_collection_time', 'database_size', 'table_count', 'index_count',
            'connection_count', 'cache_hit_ratio', 'uptime', 'version', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']

