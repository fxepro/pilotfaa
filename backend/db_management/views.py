"""
API views for Database Management
All operations are read-only and require admin authentication
"""

import time
import logging
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import DatabaseConnection, DatabaseActivityLog, DatabasePerformanceMetrics
from .serializers import (
    DatabaseConnectionSerializer, DatabaseConnectionListSerializer,
    SchemaSerializer, TableSerializer, ColumnSerializer,
    RowPreviewSerializer, QueryResultSerializer, DatabaseActivityLogSerializer,
    DatabasePerformanceMetricsSerializer
)
from .db_clients import DatabaseClientFactory
from .db_operations import DatabaseOperations
from .query_validator import QueryValidator

logger = logging.getLogger(__name__)


def log_activity(connection, user, action, success, **kwargs):
    """Helper to log database activity"""
    try:
        DatabaseActivityLog.objects.create(
            connection=connection,
            user=user,
            action=action,
            success=success,
            **kwargs
        )
    except Exception as e:
        logger.error(f"Failed to log activity: {str(e)}")


# Connection Management Views

@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def database_connections_list(request):
    """List all database connections or create a new one"""
    if request.method == 'GET':
        connections = DatabaseConnection.objects.all().order_by('-created_at')
        serializer = DatabaseConnectionListSerializer(connections, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = DatabaseConnectionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            connection = serializer.save()
            log_activity(
                connection, request.user, 'connect', True,
                query=f"Created connection: {connection.name}"
            )
            return Response(
                DatabaseConnectionListSerializer(connection).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def database_connection_detail(request, pk):
    """Get, update, or delete a specific database connection"""
    connection = get_object_or_404(DatabaseConnection, pk=pk)
    
    if request.method == 'GET':
        serializer = DatabaseConnectionSerializer(connection)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = DatabaseConnectionSerializer(
            connection, data=request.data, partial=True, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            log_activity(
                connection, request.user, 'connect', True,
                query=f"Updated connection: {connection.name}"
            )
            return Response(DatabaseConnectionListSerializer(connection).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        connection_name = connection.name
        connection_id = connection.id
        connection.delete()
        # Note: Can't log activity after deletion, but connection is already deleted
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def test_connection(request, pk):
    """Test a database connection"""
    connection = get_object_or_404(DatabaseConnection, pk=pk)
    
    start_time = time.time()
    success, error_message = DatabaseClientFactory.test_connection(connection)
    execution_time = time.time() - start_time
    
    # Update connection status
    connection.status = 'connected' if success else 'error'
    connection.last_checked = timezone.now()
    connection.save(update_fields=['status', 'last_checked'])
    
    log_activity(
        connection, request.user, 'test_connection', success,
        execution_time=execution_time,
        error_message=error_message if not success else None
    )
    
    if success:
        return Response({
            'success': True,
            'message': 'Connection test successful',
            'execution_time': execution_time
        })
    else:
        return Response({
            'success': False,
            'message': 'Connection test failed',
            'error': error_message,
            'execution_time': execution_time
        }, status=status.HTTP_400_BAD_REQUEST)


# Database Operations Views

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_schemas(request, pk):
    """List all schemas in a database"""
    connection = get_object_or_404(DatabaseConnection, pk=pk)
    
    if not connection.is_active:
        return Response(
            {'error': 'Connection is not active'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        start_time = time.time()
        schemas = DatabaseOperations.list_schemas(connection)
        execution_time = time.time() - start_time
        
        serializer = SchemaSerializer(schemas, many=True)
        
        log_activity(
            connection, request.user, 'list_schemas', True,
            execution_time=execution_time,
            rows_returned=len(schemas)
        )
        
        return Response(serializer.data)
    
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error listing schemas: {error_msg}")
        log_activity(
            connection, request.user, 'list_schemas', False,
            error_message=error_msg
        )
        return Response(
            {'error': error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_tables(request, pk):
    """List all tables in a database"""
    connection = get_object_or_404(DatabaseConnection, pk=pk)
    
    if not connection.is_active:
        return Response(
            {'error': 'Connection is not active'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    schema_name = request.query_params.get('schema', None)
    include_stats = request.query_params.get('include_stats', 'false').lower() == 'true'
    
    try:
        start_time = time.time()
        if include_stats:
            tables = DatabaseOperations.list_tables_with_stats(connection, schema_name)
        else:
            tables = DatabaseOperations.list_tables(connection, schema_name)
        execution_time = time.time() - start_time
        
        serializer = TableSerializer(tables, many=True)
        
        log_activity(
            connection, request.user, 'list_tables', True,
            execution_time=execution_time,
            schema_name=schema_name,
            rows_returned=len(tables)
        )
        
        return Response(serializer.data)
    
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error listing tables: {error_msg}")
        log_activity(
            connection, request.user, 'list_tables', False,
            error_message=error_msg,
            schema_name=schema_name
        )
        return Response(
            {'error': error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_columns(request, pk, table_name):
    """List all columns in a table"""
    connection = get_object_or_404(DatabaseConnection, pk=pk)
    
    if not connection.is_active:
        return Response(
            {'error': 'Connection is not active'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    schema_name = request.query_params.get('schema', None)
    
    try:
        start_time = time.time()
        columns = DatabaseOperations.list_columns(connection, table_name, schema_name)
        execution_time = time.time() - start_time
        
        serializer = ColumnSerializer(columns, many=True)
        
        log_activity(
            connection, request.user, 'list_columns', True,
            execution_time=execution_time,
            table_name=table_name,
            schema_name=schema_name,
            rows_returned=len(columns)
        )
        
        return Response(serializer.data)
    
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error listing columns: {error_msg}")
        log_activity(
            connection, request.user, 'list_columns', False,
            error_message=error_msg,
            table_name=table_name,
            schema_name=schema_name
        )
        return Response(
            {'error': error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def preview_rows(request, pk, table_name):
    """Preview rows from a table (read-only, limited)"""
    connection = get_object_or_404(DatabaseConnection, pk=pk)
    
    if not connection.is_active:
        return Response(
            {'error': 'Connection is not active'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    schema_name = request.query_params.get('schema', None)
    limit = int(request.query_params.get('limit', 50))
    limit = min(limit, 100)  # Enforce maximum
    
    try:
        start_time = time.time()
        preview_data = DatabaseOperations.preview_rows(connection, table_name, schema_name, limit)
        execution_time = time.time() - start_time
        
        serializer = RowPreviewSerializer(preview_data)
        
        log_activity(
            connection, request.user, 'preview', True,
            execution_time=execution_time,
            table_name=table_name,
            schema_name=schema_name,
            rows_returned=preview_data['count']
        )
        
        return Response(serializer.data)
    
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error previewing rows: {error_msg}")
        log_activity(
            connection, request.user, 'preview', False,
            error_message=error_msg,
            table_name=table_name,
            schema_name=schema_name
        )
        return Response(
            {'error': error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAdminUser])
def execute_query(request, pk):
    """Execute a safe, read-only SQL query"""
    connection = get_object_or_404(DatabaseConnection, pk=pk)
    
    if not connection.is_active:
        return Response(
            {'error': 'Connection is not active'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    query = request.data.get('query', '').strip()
    if not query:
        return Response(
            {'error': 'Query is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate query
    is_safe, error_message = QueryValidator.is_safe(query)
    if not is_safe:
        log_activity(
            connection, request.user, 'query', False,
            query=query,
            error_message=error_message
        )
        return Response(
            {'error': error_message},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Add LIMIT if not present
        query = QueryValidator.validate_and_limit(query, max_rows=1000)
        
        # Get database client
        db_client = DatabaseClientFactory.get_client(connection)
        cursor = db_client['cursor']
        client_type = db_client['type']
        
        # Execute query with timeout
        start_time = time.time()
        cursor.execute(query)
        rows = cursor.fetchall()
        execution_time = time.time() - start_time
        
        # Get column names
        if client_type == 'sqlite':
            column_names = [description[0] for description in cursor.description]
            row_dicts = [dict(row) for row in rows]
        else:
            column_names = [desc[0] for desc in cursor.description]
            row_dicts = [
                {col: val for col, val in zip(column_names, row)}
                for row in rows
            ]
        
        # Close connection
        db_client['client'].close()
        
        result = {
            'columns': column_names,
            'rows': row_dicts,
            'row_count': len(row_dicts),
            'execution_time': execution_time
        }
        
        serializer = QueryResultSerializer(result)
        
        log_activity(
            connection, request.user, 'query', True,
            query=query,
            execution_time=execution_time,
            rows_returned=len(row_dicts)
        )
        
        return Response(serializer.data)
    
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Error executing query: {error_msg}")
        log_activity(
            connection, request.user, 'query', False,
            query=query,
            error_message=error_msg
        )
        return Response(
            {'error': error_msg},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAdminUser])
def activity_logs(request, pk):
    """Get activity logs for a database connection"""
    connection = get_object_or_404(DatabaseConnection, pk=pk)
    
    logs = DatabaseActivityLog.objects.filter(connection=connection).order_by('-created_at')[:100]
    serializer = DatabaseActivityLogSerializer(logs, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def performance_metrics(request, pk):
    """Get or create performance metrics for a database connection (ping, query time, stats)"""
    connection = get_object_or_404(DatabaseConnection, pk=pk)
    
    if not connection.is_active:
        return Response(
            {'error': 'Connection is not active'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if request.method == 'GET':
        # Return latest metrics or all historical metrics
        limit = int(request.query_params.get('limit', 1))
        metrics_queryset = DatabasePerformanceMetrics.objects.filter(
            connection=connection
        ).order_by('-created_at')[:limit]
        
        serializer = DatabasePerformanceMetricsSerializer(metrics_queryset, many=True)
        return Response(serializer.data if limit > 1 else (serializer.data[0] if serializer.data else None))
    
    elif request.method == 'POST':
        # Gather new metrics and save them
        try:
            start_time = time.time()
            metrics_data = DatabaseOperations.get_performance_metrics(connection)
            total_time = time.time() - start_time
            
            # Save metrics to database
            performance_metric = DatabasePerformanceMetrics.objects.create(
                connection=connection,
                ping_time=metrics_data.get('ping_time'),
                query_time=metrics_data.get('query_time'),
                total_collection_time=round(total_time * 1000, 2),  # milliseconds
                database_size=metrics_data.get('database_size'),
                table_count=metrics_data.get('table_count'),
                index_count=metrics_data.get('index_count'),
                connection_count=metrics_data.get('connection_count'),
                cache_hit_ratio=metrics_data.get('cache_hit_ratio'),
                uptime=metrics_data.get('uptime'),
                version=metrics_data.get('version'),
            )
            
            # Add metadata to response
            metrics_data['timestamp'] = timezone.now().isoformat()
            metrics_data['total_collection_time'] = round(total_time * 1000, 2)  # milliseconds
            metrics_data['id'] = str(performance_metric.id)
            
            log_activity(
                connection, request.user, 'performance_check', True,
                execution_time=total_time
            )
            
            serializer = DatabasePerformanceMetricsSerializer(performance_metric)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Error getting performance metrics: {error_msg}")
            log_activity(
                connection, request.user, 'performance_check', False,
                error_message=error_msg
            )
            return Response(
                {'error': error_msg},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
