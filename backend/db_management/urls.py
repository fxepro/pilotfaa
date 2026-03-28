"""
URL configuration for Database Management API
"""

from django.urls import path
from . import views

app_name = 'db_management'

urlpatterns = [
    # Connection management
    path('', views.database_connections_list, name='connections-list'),
    path('<uuid:pk>/', views.database_connection_detail, name='connection-detail'),
    path('<uuid:pk>/test/', views.test_connection, name='test-connection'),
    
    # Database operations
    path('<uuid:pk>/schemas/', views.list_schemas, name='list-schemas'),
    path('<uuid:pk>/tables/', views.list_tables, name='list-tables'),
    path('<uuid:pk>/tables/<str:table_name>/columns/', views.list_columns, name='list-columns'),
    path('<uuid:pk>/tables/<str:table_name>/preview/', views.preview_rows, name='preview-rows'),
    path('<uuid:pk>/query/', views.execute_query, name='execute-query'),
    
    # Activity logs
    path('<uuid:pk>/logs/', views.activity_logs, name='activity-logs'),
    
    # Performance metrics
    path('<uuid:pk>/performance/', views.performance_metrics, name='performance-metrics'),
]

