"""
Django settings for core project.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

env_path = BASE_DIR / '.env'
load_dotenv(dotenv_path=env_path)

try:
    from decouple import config, Csv
    USE_DECOUPLE = True
except ImportError:
    USE_DECOUPLE = False
    def config(key, default=None, cast=None):
        value = os.environ.get(key, default)
        if cast is not None and value is not None and value != default:
            try:
                return cast(value)
            except (ValueError, TypeError):
                return default
        return value
    def Csv(value, cast=None):
        if value is None:
            return []
        return [v.strip() for v in value.split(',') if v.strip()]


def get_env_bool(key, default=False):
    if USE_DECOUPLE:
        return config(key, default=default, cast=bool)
    value = config(key, default=str(default))
    return value.lower() in ('true', '1', 'yes', 'on')


def get_env_list(key, default=None):
    if default is None:
        default_list = []
    elif isinstance(default, (list, tuple)):
        default_list = list(default)
    else:
        default_list = [str(default)]

    def ensure_list(value, fallback_default):
        if isinstance(value, list):
            return value
        elif isinstance(value, tuple):
            return list(value)
        elif value is None:
            return fallback_default.copy() if fallback_default else []
        else:
            return fallback_default.copy() if fallback_default else []

    try:
        raw_str = config(key, default='')
        if not raw_str or raw_str.strip() == '':
            return ensure_list(None, default_list)
        parsed_list = [v.strip() for v in str(raw_str).split(',') if v.strip()]
        if not parsed_list:
            return ensure_list(None, default_list)
        filtered_list = [str(v).strip() for v in parsed_list if v is not None and str(v).strip()]
        if not filtered_list and default_list:
            return ensure_list(default_list.copy(), default_list)
        return ensure_list(filtered_list, default_list)
    except Exception:
        return ensure_list(None, default_list)


SECRET_KEY = config('SECRET_KEY', default='django-insecure-lc*ju4=46*vlq62ladn2_l1tb)h%#roituyojqs#czz^j&^tof')
DEBUG = get_env_bool('DEBUG', default=True)

_default_hosts = ['adminrodeo.com', 'www.adminrodeo.com', '3.151.149.58', 'localhost', '127.0.0.1']
_railway_domain = config('RAILWAY_PUBLIC_DOMAIN', default='')
if _railway_domain:
    _default_hosts.append(_railway_domain)
ALLOWED_HOSTS = get_env_list('ALLOWED_HOSTS', default=_default_hosts)

FRONTEND_URL = os.getenv("FRONTEND_URL")
NEXT_PUBLIC_APP_URL = os.getenv("NEXT_PUBLIC_APP_URL")
NEXT_PUBLIC_API_BASE_URL = os.getenv("NEXT_PUBLIC_API_BASE_URL")

csrf_defaults = ['http://localhost:8000', 'http://127.0.0.1:8000']
if FRONTEND_URL:
    if FRONTEND_URL.startswith('https://'):
        csrf_defaults.append(FRONTEND_URL)
        csrf_defaults.append(FRONTEND_URL.replace('https://', 'http://'))
    elif FRONTEND_URL.startswith('http://'):
        csrf_defaults.append(FRONTEND_URL)
        csrf_defaults.append(FRONTEND_URL.replace('http://', 'https://'))
CSRF_TRUSTED_ORIGINS = get_env_list('CSRF_TRUSTED_ORIGINS', default=csrf_defaults)

if DEBUG and SECRET_KEY.startswith('django-insecure-'):
    import warnings
    warnings.warn('WARNING: Using insecure SECRET_KEY. Set SECRET_KEY environment variable in production!', UserWarning)

APPEND_SLASH = True

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',
    'django_extensions',
    'actstream',
    'auditlog',
    'drf_spectacular',
    'anymail',
    'core.apps.CoreConfig',
    'users',
    'multilocation',
    'multilanguage',
    'financials',
    'emails',
    'products',
    'inventory',
    'pricing',
    'purchasing',
    'invoicing',
    'site_settings.apps.SettingsConfig',
    'blog',
    'db_management',
    'pilotfaa_faa',
    'pilotfaa_content',
    'pilotfaa_progress',
    'pilotfaa_assessments',
    'pilotfaa_tutor',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'core' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# ── Database — reads DATABASE_URL on Railway, falls back to DB_* vars locally ──

def _build_db_config():
    import urllib.parse as _up
    _url = config('DATABASE_PUBLIC_URL', default='') or config('DATABASE_URL', default='')
    if _url:
        _p = _up.urlparse(_url)
        return {
            'ENGINE':   'django.db.backends.postgresql',
            'NAME':     _p.path.lstrip('/'),
            'USER':     _p.username,
            'PASSWORD': _p.password,
            'HOST':     _p.hostname,
            'PORT':     str(_p.port or 5432),
            'OPTIONS':  {
                'connect_timeout': 10,
                'options': '-c search_path=public,core,users,financials,multilocation,multilanguage,emails,products,inventory,pricing,purchasing,invoicing,site_settings,audit_reports,api_monitoring,blog,db_management,pilotfaa',
            },
        }
    return {
        'ENGINE':   'django.db.backends.postgresql',
        'NAME':     config('DB_NAME',     default='pilotfaa'),
        'USER':     config('DB_USER',     default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default='postgres'),
        'HOST':     config('DB_HOST',     default='127.0.0.1'),
        'PORT':     config('DB_PORT',     default='5432'),
        'OPTIONS': {
            'connect_timeout': 10,
            'options': (
                '-c search_path='
                'core,users,financials,multilocation,multilanguage,'
                'emails,products,inventory,pricing,purchasing,invoicing,'
                'site_settings,audit_reports,api_monitoring,blog,'
                'db_management,pilotfaa,public'
            ),
        },
    }


DATABASES = {
    'default': _build_db_config(),
}


AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

CORS_ALLOW_ALL_ORIGINS = get_env_bool('CORS_ALLOW_ALL_ORIGINS', default=True)
cors_defaults = ['http://localhost:3000', 'http://127.0.0.1:3000']
if FRONTEND_URL:
    cors_defaults.append(FRONTEND_URL)
    if FRONTEND_URL.startswith('https://'):
        cors_defaults.append(FRONTEND_URL.replace('https://', 'http://'))
    elif FRONTEND_URL.startswith('http://'):
        cors_defaults.append(FRONTEND_URL.replace('http://', 'https://'))
CORS_ALLOWED_ORIGINS = get_env_list('CORS_ALLOWED_ORIGINS', default=cors_defaults)
CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization', 'content-type',
    'dnt', 'origin', 'user-agent', 'x-csrftoken', 'x-requested-with',
]

EMAIL_BACKEND     = config('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST        = config('EMAIL_HOST', default='smtp.gmail.com')
EMAIL_PORT        = int(config('EMAIL_PORT', default='587'))
EMAIL_USE_TLS     = get_env_bool('EMAIL_USE_TLS', default=True)
EMAIL_HOST_USER   = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
EMAIL_USE_SSL     = False
EMAIL_TIMEOUT     = 30
DEFAULT_FROM_EMAIL = "PilotFAA <noreply@pilotfaa.com>"
SERVER_EMAIL       = "noreply@pilotfaa.com"
SUPPORT_EMAIL      = "support@pilotfaa.com"

AWS_ACCESS_KEY_ID     = config('AWS_ACCESS_KEY_ID', default='')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY', default='')
AWS_SES_REGION_NAME   = config('AWS_SES_REGION_NAME', default='us-east-1')
AWS_SES_REGION_ENDPOINT = config('AWS_SES_REGION_ENDPOINT', default='')

ANYMAIL = {
    "AMAZON_SES_CLIENT_PARAMS": {
        "region_name": AWS_SES_REGION_NAME,
    }
}
if AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY:
    ANYMAIL["AMAZON_SES_CLIENT_PARAMS"]["aws_access_key_id"] = AWS_ACCESS_KEY_ID
    ANYMAIL["AMAZON_SES_CLIENT_PARAMS"]["aws_secret_access_key"] = AWS_SECRET_ACCESS_KEY
if AWS_SES_REGION_ENDPOINT:
    ANYMAIL["AMAZON_SES_CLIENT_PARAMS"]["endpoint_url"] = AWS_SES_REGION_ENDPOINT

STATIC_URL  = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'core.optional_jwt.OptionalJWTAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME':  timedelta(minutes=30),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS':  True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

try:
    from core.posthog_config import posthog_client, capture_event, identify_user
except ImportError:
    posthog_client = None
    capture_event = lambda *args, **kwargs: None
    identify_user  = lambda *args, **kwargs: None

try:
    from core.logging_config import LOGGING
except ImportError:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {'console': {'class': 'logging.StreamHandler'}},
        'root': {'handlers': ['console'], 'level': 'WARNING'},
    }

try:
    from core.security_config import (
        SECURE_SSL_REDIRECT, SECURE_HSTS_SECONDS, SECURE_HSTS_INCLUDE_SUBDOMAINS,
        SECURE_HSTS_PRELOAD, SECURE_CONTENT_TYPE_NOSNIFF, SECURE_BROWSER_XSS_FILTER,
        X_FRAME_OPTIONS, SECURE_REFERRER_POLICY, SECURE_PROXY_SSL_HEADER,
        SESSION_COOKIE_SECURE, SESSION_COOKIE_HTTPONLY, SESSION_COOKIE_SAMESITE,
        CSRF_COOKIE_SECURE, CSRF_COOKIE_HTTPONLY, CSRF_COOKIE_SAMESITE,
        RATE_LIMIT_ENABLE, RATE_LIMIT_PER_MINUTE, RATE_LIMIT_PER_HOUR,
    )
    SECURE_SSL_REDIRECT = False
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    USE_X_FORWARDED_HOST = True
    RATE_LIMIT_ENABLE     = RATE_LIMIT_ENABLE
    RATE_LIMIT_PER_MINUTE = RATE_LIMIT_PER_MINUTE
    RATE_LIMIT_PER_HOUR   = RATE_LIMIT_PER_HOUR
except ImportError:
    SECURE_SSL_REDIRECT            = not DEBUG
    SECURE_HSTS_SECONDS            = 31536000 if not DEBUG else 0
    SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
    SECURE_HSTS_PRELOAD            = not DEBUG
    SECURE_CONTENT_TYPE_NOSNIFF    = True
    SECURE_BROWSER_XSS_FILTER      = True
    X_FRAME_OPTIONS                = 'DENY'
    SECURE_REFERRER_POLICY         = 'strict-origin-when-cross-origin'
    SESSION_COOKIE_SECURE          = get_env_bool('SESSION_COOKIE_SECURE', default=not DEBUG)
    SESSION_COOKIE_HTTPONLY        = True
    SESSION_COOKIE_SAMESITE        = 'Lax'
    CSRF_COOKIE_SECURE             = get_env_bool('CSRF_COOKIE_SECURE', default=not DEBUG)
    CSRF_COOKIE_HTTPONLY           = True
    CSRF_COOKIE_SAMESITE           = 'Lax'
    SECURE_PROXY_SSL_HEADER        = ('HTTP_X_FORWARDED_PROTO', 'https')
    RATE_LIMIT_ENABLE              = True
    RATE_LIMIT_PER_MINUTE          = 60
    RATE_LIMIT_PER_HOUR            = 1000

try:
    import csp
    CSP_ENABLED = True
except ImportError:
    CSP_ENABLED = False
    CSP_DEFAULT_SRC = ["'self'"]
    CSP_SCRIPT_SRC  = ["'self'", "'unsafe-inline'", "'unsafe-eval'"]
    CSP_STYLE_SRC   = ["'self'", "'unsafe-inline'"]
    CSP_IMG_SRC     = ["'self'", 'data:', 'https:']
    CSP_FONT_SRC    = ["'self'", 'data:']
    CSP_CONNECT_SRC = ["'self'"]
    CSP_FRAME_SRC   = ["'self'"]

CELERY_BROKER_URL        = config('CELERY_BROKER_URL', default='redis://localhost:6379/0')
CELERY_RESULT_BACKEND    = config('CELERY_RESULT_BACKEND', default='redis://localhost:6379/0')
CELERY_ACCEPT_CONTENT    = ['json']
CELERY_TASK_SERIALIZER   = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE          = 'UTC'
CELERY_ENABLE_UTC        = True
CELERY_TASK_TRACK_STARTED         = True
CELERY_TASK_TIME_LIMIT            = 30 * 60
CELERY_TASK_SOFT_TIME_LIMIT       = 25 * 60
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_WORKER_MAX_TASKS_PER_CHILD = 1000

import sys
if sys.platform == 'win32':
    CELERY_WORKER_POOL = 'solo'
