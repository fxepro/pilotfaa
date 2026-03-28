"""
Database client factory for connecting to different database types
"""

import logging
from typing import Dict, Any, Optional
from django.conf import settings
from .models import DatabaseConnection
from .encryption import EncryptionService

logger = logging.getLogger(__name__)


class DatabaseClientFactory:
    """
    Factory for creating database clients based on connection profile
    """
    
    @staticmethod
    def get_client(connection: DatabaseConnection) -> Dict[str, Any]:
        """
        Get a database client based on connection profile
        
        Args:
            connection: DatabaseConnection instance
            
        Returns:
            Dict with 'type' and 'client' keys
            
        Raises:
            ValueError: If engine is not supported
            Exception: If connection fails
        """
        # Decrypt password
        try:
            password = EncryptionService.decrypt_password(connection.password)
        except Exception as e:
            logger.error(f"Failed to decrypt password for connection {connection.id}: {str(e)}")
            raise ValueError(f"Failed to decrypt password: {str(e)}")
        
        if connection.engine == 'postgresql':
            return DatabaseClientFactory._get_postgres_client(connection, password)
        elif connection.engine == 'mysql':
            return DatabaseClientFactory._get_mysql_client(connection, password)
        elif connection.engine == 'sqlite':
            return DatabaseClientFactory._get_sqlite_client(connection)
        else:
            raise ValueError(f"Unsupported database engine: {connection.engine}")
    
    @staticmethod
    def _get_postgres_client(connection: DatabaseConnection, password: str) -> Dict[str, Any]:
        """Get PostgreSQL client"""
        try:
            import psycopg2
            from psycopg2 import pool
        except ImportError:
            raise ImportError("psycopg2-binary is required for PostgreSQL connections. Install with: pip install psycopg2-binary")
        
        try:
            conn = psycopg2.connect(
                host=connection.host,
                port=connection.port,
                user=connection.username,
                password=password,
                database=connection.database_name,
                connect_timeout=10
            )
            return {
                'type': 'postgresql',
                'client': conn,
                'cursor': conn.cursor()
            }
        except Exception as e:
            logger.error(f"PostgreSQL connection failed: {str(e)}")
            raise ConnectionError(f"Failed to connect to PostgreSQL: {str(e)}")
    
    @staticmethod
    def _get_mysql_client(connection: DatabaseConnection, password: str) -> Dict[str, Any]:
        """Get MySQL client"""
        try:
            import MySQLdb
        except ImportError:
            try:
                import pymysql
                MySQLdb = pymysql
            except ImportError:
                raise ImportError("mysqlclient or pymysql is required for MySQL connections. Install with: pip install mysqlclient or pip install pymysql")
        
        try:
            conn = MySQLdb.connect(
                host=connection.host,
                port=connection.port,
                user=connection.username,
                passwd=password,
                db=connection.database_name,
                connect_timeout=10
            )
            return {
                'type': 'mysql',
                'client': conn,
                'cursor': conn.cursor()
            }
        except Exception as e:
            logger.error(f"MySQL connection failed: {str(e)}")
            raise ConnectionError(f"Failed to connect to MySQL: {str(e)}")
    
    @staticmethod
    def _get_sqlite_client(connection: DatabaseConnection) -> Dict[str, Any]:
        """Get SQLite client"""
        try:
            import sqlite3
        except ImportError:
            raise ImportError("sqlite3 is required for SQLite connections (usually included with Python)")
        
        try:
            # For SQLite, host field contains the file path
            db_path = connection.host
            conn = sqlite3.connect(db_path, timeout=10.0)
            conn.row_factory = sqlite3.Row  # Return rows as dict-like objects
            return {
                'type': 'sqlite',
                'client': conn,
                'cursor': conn.cursor()
            }
        except Exception as e:
            logger.error(f"SQLite connection failed: {str(e)}")
            raise ConnectionError(f"Failed to connect to SQLite: {str(e)}")
    
    @staticmethod
    def test_connection(connection: DatabaseConnection):
        """
        Test database connection
        
        Args:
            connection: DatabaseConnection instance
            
        Returns:
            Tuple of (success: bool, error_message: Optional[str])
        """
        try:
            db_client = DatabaseClientFactory.get_client(connection)
            client = db_client['client']
            
            # Test query based on engine
            if db_client['type'] == 'postgresql':
                cursor = client.cursor()
                cursor.execute('SELECT version();')
                cursor.fetchone()
            elif db_client['type'] == 'mysql':
                cursor = client.cursor()
                cursor.execute('SELECT version();')
                cursor.fetchone()
            elif db_client['type'] == 'sqlite':
                cursor = client.cursor()
                cursor.execute('SELECT sqlite_version();')
                cursor.fetchone()
            
            # Close connection
            client.close()
            
            return True, None
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Connection test failed for {connection.name}: {error_msg}")
            return False, error_msg

