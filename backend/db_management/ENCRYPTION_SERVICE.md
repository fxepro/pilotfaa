# EncryptionService Documentation

## Overview

The `EncryptionService` is a security component that automatically encrypts and decrypts database passwords before storing them in the database. It ensures that sensitive credentials are never stored in plain text.

## Purpose

- **Security**: Passwords are never stored in plain text in the database
- **Encryption**: Uses Fernet symmetric encryption (industry-standard)
- **Key Management**: Derives encryption key from Django's `SECRET_KEY`

## How It Works

### Encryption Process

1. **When creating/updating a database connection:**
   - Plain text password is received from the API
   - Password is encrypted using Fernet encryption
   - Encrypted password is stored in the database

2. **When connecting to a database:**
   - Encrypted password is retrieved from the database
   - Password is decrypted in memory (temporary)
   - Decrypted password is used for database connection
   - Password is never exposed in API responses

### Technical Details

- **Encryption Algorithm**: Fernet (symmetric encryption)
- **Key Derivation**: SHA256 hash of Django's `SECRET_KEY`
- **Key Format**: Base64-encoded 32-byte key (Fernet requirement)
- **Library**: `cryptography` (Python package)

## Where It's Used

### 1. Serializers (`serializers.py`)

**Location**: `backend/db_management/serializers.py`

**Usage**:
- **Line 33**: Encrypts password when creating a new connection
- **Line 45**: Encrypts password when updating an existing connection

```python
def create(self, validated_data):
    password = validated_data.pop('password', '')
    if password:
        validated_data['password'] = EncryptionService.encrypt_password(password)
    return super().create(validated_data)
```

### 2. Database Client Factory (`db_clients.py`)

**Location**: `backend/db_management/db_clients.py`

**Usage**:
- **Line 33**: Decrypts password when connecting to a database

```python
def get_client(connection: DatabaseConnection):
    # Decrypt password
    password = EncryptionService.decrypt_password(connection.password)
    # Use decrypted password for connection
    ...
```

## API Behavior

### Creating a Connection

**Request**:
```json
POST /api/admin/databases/
{
    "name": "Production DB",
    "engine": "postgresql",
    "host": "localhost",
    "port": 5432,
    "username": "admin",
    "password": "my_plain_text_password",  // Plain text sent
    "database_name": "myapp"
}
```

**Storage**: Password is encrypted before saving to database

**Response**: Password is never included in the response

### Updating a Connection

**Request**:
```json
PUT /api/admin/databases/{id}/
{
    "password": "new_plain_text_password"  // Plain text sent
}
```

**Storage**: New password is encrypted and replaces old encrypted password

### Listing Connections

**Response**:
```json
{
    "id": "...",
    "name": "Production DB",
    "engine": "postgresql",
    "host": "localhost",
    "port": 5432,
    "username": "admin",
    // password field is NOT included
    "database_name": "myapp"
}
```

## Security Features

### ✅ Password Encryption at Rest

- All passwords stored in the database are encrypted
- Even database administrators cannot see plain text passwords
- Encrypted passwords look like: `gAAAAABpPGsnM4-_HK3kYOHMHCg8ojkr96bmCBgb1iqc48x54v...`

### ✅ In-Memory Decryption Only

- Passwords are decrypted only when needed for database connections
- Decryption happens in memory (temporary)
- Decrypted passwords are never logged or exposed

### ✅ API Security

- Passwords are never returned in API responses
- `DatabaseConnectionListSerializer` excludes password field
- Only `DatabaseConnectionSerializer` accepts password (write-only)

### ✅ Key Management

- Uses Django's `SECRET_KEY` for encryption
- Key is derived using SHA256 hash
- If `SECRET_KEY` is compromised, all passwords can be decrypted
- **Important**: Keep `SECRET_KEY` secure and never commit it to version control

## Testing

### Verify Encryption Works

```python
from db_management.encryption import EncryptionService

# Test encryption/decryption
test_password = "my_secret_password"
encrypted = EncryptionService.encrypt_password(test_password)
decrypted = EncryptionService.decrypt_password(encrypted)

print(f"Original: {test_password}")
print(f"Encrypted: {encrypted}")
print(f"Decrypted: {decrypted}")
print(f"Match: {test_password == decrypted}")  # Should be True
```

### Expected Output

```
Original: my_secret_password
Encrypted: gAAAAABpPGsnM4-_HK3kYOHMHCg8ojkr96bmCBgb1iqc48x54v...
Decrypted: my_secret_password
Match: True
```

## Is It Active?

**Yes, the EncryptionService is automatically active and working.**

### Automatic Activation

- ✅ **Active on create**: Passwords are encrypted when creating connections
- ✅ **Active on update**: Passwords are encrypted when updating connections
- ✅ **Active on connect**: Passwords are decrypted when connecting to databases
- ✅ **Active on list**: Passwords are never returned in API responses

### No Manual Intervention Required

The encryption/decryption happens automatically through:
1. Serializers (encryption on save)
2. Database client factory (decryption on connect)

You don't need to manually call encryption methods in your code.

## Dependencies

### Required Package

```bash
pip install cryptography
```

**Version**: `cryptography>=41.0.0` (in requirements.txt)

### Python Version

- Works with Python 3.8+
- Uses standard library modules: `hashlib`, `base64`

## Security Best Practices

### ✅ Do's

- Keep Django `SECRET_KEY` secure
- Use strong, unique passwords for database connections
- Rotate `SECRET_KEY` periodically (requires re-encrypting all passwords)
- Use read-only database users when possible
- Monitor activity logs for suspicious access

### ❌ Don'ts

- Never commit `SECRET_KEY` to version control
- Never log decrypted passwords
- Never return passwords in API responses
- Never share `SECRET_KEY` between environments
- Never use the same `SECRET_KEY` in production and development

## Troubleshooting

### Error: "SECRET_KEY must be set in Django settings"

**Solution**: Ensure `SECRET_KEY` is set in `settings.py` or `.env` file

### Error: "Failed to decrypt password"

**Possible Causes**:
1. `SECRET_KEY` has changed since password was encrypted
2. Password was manually modified in database
3. Encryption key derivation failed

**Solution**: 
- Ensure `SECRET_KEY` matches the one used when password was encrypted
- Re-enter password through API to re-encrypt with current key

### Error: "ModuleNotFoundError: No module named 'cryptography'"

**Solution**: 
```bash
pip install cryptography
# Or if using virtual environment:
venv/Scripts/pip install cryptography
```

## Code Location

- **Service**: `backend/db_management/encryption.py`
- **Usage**: `backend/db_management/serializers.py` (lines 33, 45)
- **Usage**: `backend/db_management/db_clients.py` (line 33)

## Summary

The `EncryptionService` is a critical security component that:
- ✅ Automatically encrypts passwords before storage
- ✅ Automatically decrypts passwords when needed
- ✅ Never exposes passwords in API responses
- ✅ Uses industry-standard Fernet encryption
- ✅ Requires no manual intervention
- ✅ Is active and working by default

All database connection passwords are automatically protected through this service.

