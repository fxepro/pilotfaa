"""
JWT auth that does not 401 when the Bearer token is missing, expired, or invalid.

Public AllowAny views should still work for visitors with a stale token in localStorage.
"""

from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication


class OptionalJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        try:
            return super().authenticate(request)
        except AuthenticationFailed:
            return None
