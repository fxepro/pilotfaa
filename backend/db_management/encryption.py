"""
Encryption service for database passwords
"""

from cryptography.fernet import Fernet
from django.conf import settings
import base64
import hashlib
import logging

logger = logging.getLogger(__name__)


class EncryptionService:
    """
    Service for encrypting and decrypting database passwords
    Uses Fernet symmetric encryption with Django SECRET_KEY
    """
    
    _cipher_suite = None
    
    @classmethod
    def _get_cipher_suite(cls):
        """Get or create Fernet cipher suite"""
        if cls._cipher_suite is None:
            # Generate key from Django SECRET_KEY
            secret_key = getattr(settings, 'SECRET_KEY', '')
            if not secret_key:
                raise ValueError("SECRET_KEY must be set in Django settings")
            
            # Create a 32-byte key from SECRET_KEY using SHA256
            key = hashlib.sha256(secret_key.encode()).digest()
            # Fernet requires base64-encoded 32-byte key
            key_b64 = base64.urlsafe_b64encode(key)
            cls._cipher_suite = Fernet(key_b64)
        
        return cls._cipher_suite
    
    @staticmethod
    def encrypt_password(password: str) -> str:
        """
        Encrypt a database password
        
        Args:
            password: Plain text password
            
        Returns:
            Encrypted password as string
        """
        if not password:
            return ""
        
        try:
            cipher_suite = EncryptionService._get_cipher_suite()
            encrypted = cipher_suite.encrypt(password.encode())
            return encrypted.decode()
        except Exception as e:
            logger.error(f"Error encrypting password: {str(e)}")
            raise ValueError(f"Failed to encrypt password: {str(e)}")
    
    @staticmethod
    def decrypt_password(encrypted_password: str) -> str:
        """
        Decrypt a database password
        
        Args:
            encrypted_password: Encrypted password string
            
        Returns:
            Decrypted password as string
        """
        if not encrypted_password:
            return ""
        
        try:
            cipher_suite = EncryptionService._get_cipher_suite()
            decrypted = cipher_suite.decrypt(encrypted_password.encode())
            return decrypted.decode()
        except Exception as e:
            logger.error(f"Error decrypting password: {str(e)}")
            raise ValueError(f"Failed to decrypt password: {str(e)}")

