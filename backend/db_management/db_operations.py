"""
Database operations for listing schemas, tables, columns, and previewing data
"""

import logging
from typing import List, Dict, Any, Optional
from .db_clients import DatabaseClientFactory
from .models import DatabaseConnection

logger = logging.getLogger(__name__)


class DatabaseOperations:
    """
    Operations for querying database metadata and data
    All operations are read-only
    """
    
    @staticmethod
    def list_schemas(connection: DatabaseConnection) -> List[Dict[str, Any]]:
        """
        List all schemas in the database
        
        Args:
            connection: DatabaseConnection instance
            
        Returns:
            List of schema dictionaries with 'name' key
        """
        try:
            db_client = DatabaseClientFactory.get_client(connection)
            client_type = db_client['type']
            cursor = db_client['cursor']
            
            if client_type == 'postgresql':
                cursor.execute("""
                    SELECT schema_name 
                    FROM information_schema.schemata 
                    WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
                    ORDER BY schema_name;
                """)
                rows = cursor.fetchall()
                return [{'name': row[0]} for row in rows]
            
            elif client_type == 'mysql':
                cursor.execute("SHOW DATABASES;")
                rows = cursor.fetchall()
                return [{'name': row[0]} for row in rows]
            
            elif client_type == 'sqlite':
                # SQLite doesn't have schemas, return default
                return [{'name': 'main'}]
            
            else:
                raise ValueError(f"Unsupported database type: {client_type}")
        
        except Exception as e:
            logger.error(f"Error listing schemas: {str(e)}")
            raise
        finally:
            if 'client' in db_client:
                db_client['client'].close()
    
    @staticmethod
    def list_tables(connection: DatabaseConnection, schema_name: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        List all tables in a schema
        
        Args:
            connection: DatabaseConnection instance
            schema_name: Optional schema name (uses connection.schema if not provided)
            
        Returns:
            List of table dictionaries with 'schema' and 'name' keys
        """
        try:
            db_client = DatabaseClientFactory.get_client(connection)
            client_type = db_client['type']
            cursor = db_client['cursor']
            
            schema = schema_name or connection.schema or 'public'
            
            if client_type == 'postgresql':
                if schema_name:
                    cursor.execute("""
                        SELECT table_schema, table_name
                        FROM information_schema.tables
                        WHERE table_schema = %s
                        AND table_type = 'BASE TABLE'
                        ORDER BY table_schema, table_name;
                    """, (schema,))
                else:
                    cursor.execute("""
                        SELECT table_schema, table_name
                        FROM information_schema.tables
                        WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
                        AND table_type = 'BASE TABLE'
                        ORDER BY table_schema, table_name;
                    """)
                rows = cursor.fetchall()
                return [{'schema': row[0], 'name': row[1]} for row in rows]
            
            elif client_type == 'mysql':
                cursor.execute("""
                    SELECT table_schema, table_name
                    FROM information_schema.tables
                    WHERE table_schema = %s
                    AND table_type = 'BASE TABLE'
                    ORDER BY table_name;
                """, (connection.database_name,))
                rows = cursor.fetchall()
                return [{'schema': row[0], 'name': row[1]} for row in rows]
            
            elif client_type == 'sqlite':
                cursor.execute("""
                    SELECT name 
                    FROM sqlite_master 
                    WHERE type='table' 
                    ORDER BY name;
                """)
                rows = cursor.fetchall()
                return [{'schema': 'main', 'name': row[0]} for row in rows]
            
            else:
                raise ValueError(f"Unsupported database type: {client_type}")
        
        except Exception as e:
            logger.error(f"Error listing tables: {str(e)}")
            raise
        finally:
            if 'client' in db_client:
                db_client['client'].close()
    
    @staticmethod
    def list_tables_with_stats(connection: DatabaseConnection, schema_name: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        List all tables with statistics (rows, size, indexes) in a schema
        
        Args:
            connection: DatabaseConnection instance
            schema_name: Optional schema name (uses connection.schema if not provided)
            
        Returns:
            List of table dictionaries with 'schema', 'name', 'rows', 'size', 'indexes' keys
        """
        try:
            db_client = DatabaseClientFactory.get_client(connection)
            client_type = db_client['type']
            cursor = db_client['cursor']
            
            schema = schema_name or connection.schema or 'public'
            
            if client_type == 'postgresql':
                if schema_name:
                    # Get tables with stats for specific schema
                    cursor.execute("""
                        SELECT 
                            t.table_schema,
                            t.table_name,
                            COALESCE(c.reltuples::bigint, 0) as row_count,
                            COALESCE(pg_total_relation_size(quote_ident(t.table_schema)||'.'||quote_ident(t.table_name)), 0) as size_bytes,
                            COALESCE((
                                SELECT COUNT(*) 
                                FROM pg_indexes 
                                WHERE schemaname = t.table_schema 
                                AND tablename = t.table_name
                            ), 0) as index_count
                        FROM information_schema.tables t
                        LEFT JOIN pg_class c ON c.relname = t.table_name
                        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
                        WHERE t.table_schema = %s
                        AND t.table_type = 'BASE TABLE'
                        ORDER BY t.table_schema, t.table_name;
                    """, (schema,))
                else:
                    # Get tables with stats for all schemas (excluding system schemas)
                    cursor.execute("""
                        SELECT 
                            t.table_schema,
                            t.table_name,
                            COALESCE(c.reltuples::bigint, 0) as row_count,
                            COALESCE(pg_total_relation_size(quote_ident(t.table_schema)||'.'||quote_ident(t.table_name)), 0) as size_bytes,
                            COALESCE((
                                SELECT COUNT(*) 
                                FROM pg_indexes 
                                WHERE schemaname = t.table_schema 
                                AND tablename = t.table_name
                            ), 0) as index_count
                        FROM information_schema.tables t
                        LEFT JOIN pg_class c ON c.relname = t.table_name
                        LEFT JOIN pg_namespace n ON n.oid = c.relnamespace AND n.nspname = t.table_schema
                        WHERE t.table_schema NOT IN ('pg_catalog', 'information_schema')
                        AND t.table_type = 'BASE TABLE'
                        ORDER BY t.table_schema, t.table_name;
                    """)
                rows = cursor.fetchall()
                return [
                    {
                        'schema': row[0],
                        'name': row[1],
                        'rows': int(row[2]) if row[2] is not None else 0,
                        'size': int(row[3]) if row[3] is not None else 0,  # size in bytes
                        'indexes': int(row[4]) if row[4] is not None else 0
                    }
                    for row in rows
                ]
            
            elif client_type == 'mysql':
                # Get tables with stats for the database
                cursor.execute("""
                    SELECT 
                        t.table_schema,
                        t.table_name,
                        COALESCE(t.table_rows, 0) as row_count,
                        COALESCE((t.data_length + t.index_length), 0) as size_bytes,
                        COALESCE((
                            SELECT COUNT(*) 
                            FROM information_schema.statistics 
                            WHERE table_schema = t.table_schema 
                            AND table_name = t.table_name
                        ), 0) as index_count
                    FROM information_schema.tables t
                    WHERE t.table_schema = %s
                    AND t.table_type = 'BASE TABLE'
                    ORDER BY t.table_name;
                """, (connection.database_name,))
                rows = cursor.fetchall()
                return [
                    {
                        'schema': row[0],
                        'name': row[1],
                        'rows': int(row[2]) if row[2] is not None else 0,
                        'size': int(row[3]) if row[3] is not None else 0,  # size in bytes
                        'indexes': int(row[4]) if row[4] is not None else 0
                    }
                    for row in rows
                ]
            
            elif client_type == 'sqlite':
                # SQLite: Get tables and their stats
                cursor.execute("""
                    SELECT name 
                    FROM sqlite_master 
                    WHERE type='table' 
                    AND name NOT LIKE 'sqlite_%'
                    ORDER BY name;
                """)
                table_rows = cursor.fetchall()
                
                # Get page size for size calculations
                cursor.execute('PRAGMA page_size;')
                page_size_row = cursor.fetchone()
                page_size = int(page_size_row[0]) if page_size_row and page_size_row[0] else 4096  # Default 4KB
                
                tables_with_stats = []
                for table_row in table_rows:
                    table_name = table_row[0]
                    
                    # Get row count
                    cursor.execute(f'SELECT COUNT(*) FROM "{table_name}";')
                    row_count_row = cursor.fetchone()
                    row_count = int(row_count_row[0]) if row_count_row else 0
                    
                    # Get index count
                    cursor.execute("""
                        SELECT COUNT(*) 
                        FROM sqlite_master 
                        WHERE type='index' 
                        AND tbl_name = ?;
                    """, (table_name,))
                    index_row = cursor.fetchone()
                    index_count = int(index_row[0]) if index_row else 0
                    
                    # Get table size using PRAGMA table_info and approximate calculation
                    # SQLite doesn't provide exact table sizes, so we use an approximation
                    # based on row count and average row size (rough estimate)
                    # For better accuracy, we could query the database file size, but that's complex
                    # For now, we'll use a simple approximation: rows * estimated_bytes_per_row
                    # A more accurate approach would require parsing the database file
                    estimated_bytes_per_row = 100  # Conservative estimate
                    size_bytes = row_count * estimated_bytes_per_row if row_count > 0 else 0
                    
                    tables_with_stats.append({
                        'schema': 'main',
                        'name': table_name,
                        'rows': row_count,
                        'size': size_bytes,
                        'indexes': index_count
                    })
                
                return tables_with_stats
            
            else:
                raise ValueError(f"Unsupported database type: {client_type}")
        
        except Exception as e:
            logger.error(f"Error listing tables with stats: {str(e)}")
            raise
        finally:
            if 'client' in db_client:
                db_client['client'].close()
    
    @staticmethod
    def list_columns(connection: DatabaseConnection, table_name: str, schema_name: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        List all columns in a table
        
        Args:
            connection: DatabaseConnection instance
            table_name: Table name
            schema_name: Optional schema name
            
        Returns:
            List of column dictionaries with 'name', 'type', 'nullable' keys
        """
        try:
            db_client = DatabaseClientFactory.get_client(connection)
            client_type = db_client['type']
            cursor = db_client['cursor']
            
            if client_type == 'postgresql':
                if schema_name:
                    cursor.execute("""
                        SELECT column_name, data_type, is_nullable
                        FROM information_schema.columns
                        WHERE table_schema = %s AND table_name = %s
                        ORDER BY ordinal_position;
                    """, (schema_name, table_name))
                else:
                    cursor.execute("""
                        SELECT column_name, data_type, is_nullable
                        FROM information_schema.columns
                        WHERE table_name = %s
                        ORDER BY ordinal_position;
                    """, (table_name,))
                rows = cursor.fetchall()
                return [
                    {
                        'name': row[0],
                        'type': row[1],
                        'nullable': row[2] == 'YES'
                    }
                    for row in rows
                ]
            
            elif client_type == 'mysql':
                cursor.execute("""
                    SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
                    FROM information_schema.columns
                    WHERE table_schema = %s AND table_name = %s
                    ORDER BY ordinal_position;
                """, (connection.database_name, table_name))
                rows = cursor.fetchall()
                return [
                    {
                        'name': row[0],
                        'type': row[1],
                        'nullable': row[2] == 'YES'
                    }
                    for row in rows
                ]
            
            elif client_type == 'sqlite':
                cursor.execute(f"PRAGMA table_info({table_name});")
                rows = cursor.fetchall()
                return [
                    {
                        'name': row[1],
                        'type': row[2],
                        'nullable': not row[3]  # notnull is 0 for nullable
                    }
                    for row in rows
                ]
            
            else:
                raise ValueError(f"Unsupported database type: {client_type}")
        
        except Exception as e:
            logger.error(f"Error listing columns: {str(e)}")
            raise
        finally:
            if 'client' in db_client:
                db_client['client'].close()
    
    @staticmethod
    def preview_rows(connection: DatabaseConnection, table_name: str, schema_name: Optional[str] = None, limit: int = 50) -> Dict[str, Any]:
        """
        Preview rows from a table (read-only, limited)
        
        Args:
            connection: DatabaseConnection instance
            table_name: Table name
            schema_name: Optional schema name
            limit: Maximum number of rows (default 50, max 100)
            
        Returns:
            Dict with 'columns' and 'rows' keys
        """
        # Enforce maximum limit
        limit = min(limit, 100)
        
        try:
            db_client = DatabaseClientFactory.get_client(connection)
            client_type = db_client['type']
            cursor = db_client['cursor']
            
            # Build table name with schema if needed
            if client_type == 'postgresql' and schema_name:
                full_table_name = f'"{schema_name}"."{table_name}"'
            elif client_type == 'mysql' and schema_name:
                full_table_name = f'`{schema_name}`.`{table_name}`'
            else:
                full_table_name = table_name
            
            # Get columns first
            columns = DatabaseOperations.list_columns(connection, table_name, schema_name)
            column_names = [col['name'] for col in columns]
            
            # Get rows
            if client_type == 'postgresql':
                cursor.execute(f'SELECT * FROM {full_table_name} LIMIT %s;', (limit,))
            elif client_type == 'mysql':
                cursor.execute(f'SELECT * FROM {full_table_name} LIMIT %s;', (limit,))
            elif client_type == 'sqlite':
                cursor.execute(f'SELECT * FROM {table_name} LIMIT ?;', (limit,))
            
            rows = cursor.fetchall()
            
            # Convert rows to dictionaries
            if client_type == 'sqlite':
                # SQLite rows are already Row objects
                row_dicts = [dict(row) for row in rows]
            else:
                # PostgreSQL and MySQL return tuples
                row_dicts = [
                    {col: val for col, val in zip(column_names, row)}
                    for row in rows
                ]
            
            return {
                'columns': column_names,
                'rows': row_dicts,
                'count': len(row_dicts)
            }
        
        except Exception as e:
            logger.error(f"Error previewing rows: {str(e)}")
            raise
        finally:
            if 'client' in db_client:
                db_client['client'].close()
    
    @staticmethod
    def get_table_stats(connection: DatabaseConnection, table_name: str, schema_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Get statistics for a table
        
        Args:
            connection: DatabaseConnection instance
            table_name: Table name
            schema_name: Optional schema name
            
        Returns:
            Dict with table statistics
        """
        try:
            db_client = DatabaseClientFactory.get_client(connection)
            client_type = db_client['type']
            cursor = db_client['cursor']
            
            stats = {
                'rows': 0,
                'size': 0,
                'indexes': 0
            }
            
            if client_type == 'postgresql':
                if schema_name:
                    cursor.execute("""
                        SELECT 
                            (SELECT COUNT(*) FROM "%s"."%s") as row_count,
                            pg_size_pretty(pg_total_relation_size('"%s"."%s"')) as size,
                            (SELECT COUNT(*) FROM pg_indexes WHERE tablename = '%s' AND schemaname = '%s') as index_count;
                    """ % (schema_name, table_name, schema_name, table_name, table_name, schema_name))
                else:
                    cursor.execute("""
                        SELECT 
                            (SELECT COUNT(*) FROM "%s") as row_count,
                            pg_size_pretty(pg_total_relation_size('"%s"')) as size,
                            (SELECT COUNT(*) FROM pg_indexes WHERE tablename = '%s') as index_count;
                    """ % (table_name, table_name, table_name))
                row = cursor.fetchone()
                stats['rows'] = row[0] if row[0] else 0
                stats['size'] = row[1] if row[1] else '0 bytes'
                stats['indexes'] = row[2] if row[2] else 0
            
            elif client_type == 'mysql':
                cursor.execute("""
                    SELECT 
                        table_rows,
                        ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
                    FROM information_schema.tables
                    WHERE table_schema = %s AND table_name = %s;
                """, (connection.database_name, table_name))
                row = cursor.fetchone()
                if row:
                    stats['rows'] = row[0] if row[0] else 0
                    stats['size'] = f"{row[1]} MB" if row[1] else '0 MB'
                
                cursor.execute("""
                    SELECT COUNT(*) FROM information_schema.statistics
                    WHERE table_schema = %s AND table_name = %s;
                """, (connection.database_name, table_name))
                index_row = cursor.fetchone()
                stats['indexes'] = index_row[0] if index_row else 0
            
            elif client_type == 'sqlite':
                cursor.execute(f'SELECT COUNT(*) FROM {table_name};')
                row = cursor.fetchone()
                stats['rows'] = row[0] if row else 0
                # SQLite doesn't easily provide size/index info
                stats['size'] = 'N/A'
                stats['indexes'] = 0
            
            return stats
        
        except Exception as e:
            logger.error(f"Error getting table stats: {str(e)}")
            raise
        finally:
            if 'client' in db_client:
                db_client['client'].close()
    
    @staticmethod
    def get_performance_metrics(connection: DatabaseConnection) -> Dict[str, Any]:
        """
        Get performance metrics for a database connection (ping, query time, stats)
        
        Args:
            connection: DatabaseConnection instance
            
        Returns:
            Dict with performance metrics including:
            - ping_time: Connection latency in milliseconds
            - query_time: Simple query execution time in milliseconds
            - database_size: Total database size
            - table_count: Number of tables
            - index_count: Number of indexes
            - connection_count: Active connections (if available)
            - cache_hit_ratio: Cache hit ratio (PostgreSQL only)
        """
        import time
        
        metrics = {
            'ping_time': None,
            'query_time': None,
            'database_size': 0,
            'table_count': 0,
            'index_count': 0,
            'connection_count': None,
            'cache_hit_ratio': None,
            'version': None,
            'uptime': None,
        }
        
        try:
            # Measure connection time (ping)
            ping_start = time.time()
            db_client = DatabaseClientFactory.get_client(connection)
            ping_time = (time.time() - ping_start) * 1000  # Convert to milliseconds
            metrics['ping_time'] = round(ping_time, 2)
            
            client_type = db_client['type']
            cursor = db_client['cursor']
            
            # Measure simple query execution time
            query_start = time.time()
            if client_type == 'postgresql':
                cursor.execute('SELECT 1;')
                cursor.fetchone()
                
                # Get database version
                cursor.execute('SELECT version();')
                version_row = cursor.fetchone()
                metrics['version'] = version_row[0] if version_row else None
                
                # Get database size
                cursor.execute("""
                    SELECT pg_size_pretty(pg_database_size(%s)) as size,
                           pg_database_size(%s) as size_bytes;
                """, (connection.database_name, connection.database_name))
                size_row = cursor.fetchone()
                if size_row:
                    metrics['database_size'] = size_row[1] if size_row[1] else 0
                
                # Get table count
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM information_schema.tables 
                    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
                    AND table_type = 'BASE TABLE';
                """)
                table_row = cursor.fetchone()
                metrics['table_count'] = table_row[0] if table_row else 0
                
                # Get index count
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM pg_indexes 
                    WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
                """)
                index_row = cursor.fetchone()
                metrics['index_count'] = index_row[0] if index_row else 0
                
                # Get connection count
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM pg_stat_activity 
                    WHERE datname = %s;
                """, (connection.database_name,))
                conn_row = cursor.fetchone()
                metrics['connection_count'] = conn_row[0] if conn_row else 0
                
                # Get cache hit ratio
                cursor.execute("""
                    SELECT 
                        sum(heap_blks_hit) / NULLIF(sum(heap_blks_hit) + sum(heap_blks_read), 0) as ratio
                    FROM pg_statio_user_tables;
                """)
                cache_row = cursor.fetchone()
                if cache_row and cache_row[0]:
                    metrics['cache_hit_ratio'] = round(float(cache_row[0]) * 100, 2)
                
                # Get database uptime (time since last restart)
                cursor.execute("""
                    SELECT date_trunc('second', current_timestamp - pg_postmaster_start_time()) as uptime;
                """)
                uptime_row = cursor.fetchone()
                if uptime_row and uptime_row[0]:
                    metrics['uptime'] = str(uptime_row[0])
            
            elif client_type == 'mysql':
                cursor.execute('SELECT 1;')
                cursor.fetchone()
                
                # Get database version
                cursor.execute('SELECT VERSION();')
                version_row = cursor.fetchone()
                metrics['version'] = version_row[0] if version_row else None
                
                # Get database size
                cursor.execute("""
                    SELECT 
                        ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as size_mb,
                        SUM(data_length + index_length) as size_bytes
                    FROM information_schema.tables 
                    WHERE table_schema = %s;
                """, (connection.database_name,))
                size_row = cursor.fetchone()
                if size_row:
                    metrics['database_size'] = int(size_row[1]) if size_row[1] else 0
                
                # Get table count
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM information_schema.tables 
                    WHERE table_schema = %s AND table_type = 'BASE TABLE';
                """, (connection.database_name,))
                table_row = cursor.fetchone()
                metrics['table_count'] = table_row[0] if table_row else 0
                
                # Get index count
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM information_schema.statistics 
                    WHERE table_schema = %s;
                """, (connection.database_name,))
                index_row = cursor.fetchone()
                metrics['index_count'] = index_row[0] if index_row else 0
                
                # Get connection count
                cursor.execute("SHOW STATUS LIKE 'Threads_connected';")
                conn_row = cursor.fetchone()
                if conn_row:
                    metrics['connection_count'] = int(conn_row[1]) if len(conn_row) > 1 else 0
                
                # Get uptime
                cursor.execute("SHOW STATUS LIKE 'Uptime';")
                uptime_row = cursor.fetchone()
                if uptime_row and len(uptime_row) > 1:
                    uptime_seconds = int(uptime_row[1])
                    hours = uptime_seconds // 3600
                    minutes = (uptime_seconds % 3600) // 60
                    seconds = uptime_seconds % 60
                    metrics['uptime'] = f"{hours}h {minutes}m {seconds}s"
            
            elif client_type == 'sqlite':
                cursor.execute('SELECT 1;')
                cursor.fetchone()
                
                # Get SQLite version
                cursor.execute('SELECT sqlite_version();')
                version_row = cursor.fetchone()
                metrics['version'] = f"SQLite {version_row[0]}" if version_row else None
                
                # Get table count
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM sqlite_master 
                    WHERE type='table';
                """)
                table_row = cursor.fetchone()
                metrics['table_count'] = table_row[0] if table_row else 0
                
                # Get database size (approximate from file)
                import os
                if os.path.exists(connection.database_name):
                    metrics['database_size'] = os.path.getsize(connection.database_name)
            
            query_time = (time.time() - query_start) * 1000  # Convert to milliseconds
            metrics['query_time'] = round(query_time, 2)
            
        except Exception as e:
            logger.error(f"Error getting performance metrics: {str(e)}")
            raise
        finally:
            if 'client' in db_client:
                db_client['client'].close()
        
        return metrics

