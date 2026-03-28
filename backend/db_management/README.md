# Database Management Django App

## Overview

This Django app provides a secure, read-only database management system for the Rodeo Admin platform. It allows administrators to connect to external databases (PostgreSQL, MySQL, SQLite), browse schemas and tables, preview data, and execute safe read-only queries.

## Features

- ✅ Secure password encryption using Fernet
- ✅ Support for PostgreSQL, MySQL, and SQLite
- ✅ Read-only operations only (no write/delete/alter)
- ✅ Query validation and safety checks
- ✅ Activity logging and audit trail
- ✅ Connection testing
- ✅ Schema and table browsing
- ✅ Row preview with limits
- ✅ Safe query execution

## Installation

### Dependencies

Install required database drivers:

```bash
pip install psycopg2-binary  # For PostgreSQL
pip install mysqlclient       # For MySQL (or pymysql)
# sqlite3 is included with Python
```

The `cryptography` package is required for password encryption (should already be installed).

### Database Migration

Run migrations to create the database tables:

```bash
python manage.py makemigrations db_management
python manage.py migrate
```

## API Endpoints

All endpoints require admin authentication (`IsAdminUser` permission).

### Connection Management

- `GET /api/admin/databases/` - List all connections
- `POST /api/admin/databases/` - Create new connection
- `GET /api/admin/databases/{id}/` - Get connection details
- `PUT /api/admin/databases/{id}/` - Update connection
- `DELETE /api/admin/databases/{id}/` - Delete connection
- `POST /api/admin/databases/{id}/test/` - Test connection

### Database Operations

- `GET /api/admin/databases/{id}/schemas/` - List schemas
- `GET /api/admin/databases/{id}/tables/` - List tables (optional `?schema=name` query param)
- `GET /api/admin/databases/{id}/tables/{table_name}/columns/` - List columns (optional `?schema=name`)
- `GET /api/admin/databases/{id}/tables/{table_name}/preview/` - Preview rows (optional `?schema=name&limit=50`)
- `POST /api/admin/databases/{id}/query/` - Execute safe read-only query

### Activity Logs

- `GET /api/admin/databases/{id}/logs/` - Get activity logs for a connection

## Usage Examples

### Create a Connection

```python
POST /api/admin/databases/
{
    "name": "Production DB",
    "engine": "postgresql",
    "host": "localhost",
    "port": 5432,
    "username": "readonly_user",
    "password": "secure_password",
    "database_name": "myapp_db",
    "schema": "public",
    "is_active": true
}
```

### Test Connection

```python
POST /api/admin/databases/{id}/test/
```

### List Tables

```python
GET /api/admin/databases/{id}/tables/?schema=public
```

### Preview Rows

```python
GET /api/admin/databases/{id}/tables/users/preview/?limit=50
```

### Execute Query

```python
POST /api/admin/databases/{id}/query/
{
    "query": "SELECT * FROM users WHERE active = true LIMIT 100"
}
```

## Security Features

1. **Password Encryption**: All passwords are encrypted using Fernet symmetric encryption
2. **Read-Only Operations**: Only SELECT queries are allowed
3. **Query Validation**: Queries are validated for safety before execution
4. **Query Limits**: Results are limited to 1000 rows maximum
5. **Execution Timeout**: Queries timeout after 5 seconds
6. **Activity Logging**: All operations are logged for audit purposes
7. **Admin Only**: All endpoints require admin authentication

## Models

### DatabaseConnection

Stores database connection profiles with encrypted credentials.

### DatabaseActivityLog

Audit log of all database operations performed.

## Admin Interface

The app is registered in Django admin with:

- Connection management
- Activity log viewing
- Bulk actions (test, activate, deactivate)
- Search and filtering

## Error Handling

All operations include comprehensive error handling and logging. Errors are returned with appropriate HTTP status codes:

- `400` - Bad Request (validation errors, inactive connection)
- `404` - Not Found (connection doesn't exist)
- `500` - Internal Server Error (database connection issues)

## Notes

- Always use read-only database users for connections
- Passwords are encrypted at rest using Django's SECRET_KEY
- Connection pooling is handled by the database drivers
- All queries are validated before execution
- Activity logs are retained for audit purposes

