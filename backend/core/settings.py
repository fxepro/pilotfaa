# ── DATABASES — replace the entire DATABASES block in settings.py ──────────────
# Find this block:
#
#   DATABASES = {
#       'default': {
#           'ENGINE': 'django.db.backends.postgresql',
#           'NAME': config('DB_NAME', default='pilotfaa'),
#           ...
#       }
#   }
#
# Replace it entirely with this:

def _build_db_config():
    """
    Returns the database config dict.
    On Railway (and any PaaS), DATABASE_URL is set automatically when a
    Postgres plugin is linked — parse it first.
    Falls back to individual DB_* env vars for local development.
    """
    import urllib.parse as _up
    _url = config('DATABASE_URL', default='')
    if _url:
        _p = _up.urlparse(_url)
        return {
            'ENGINE':   'django.db.backends.postgresql',
            'NAME':     _p.path.lstrip('/'),
            'USER':     _p.username,
            'PASSWORD': _p.password,
            'HOST':     _p.hostname,
            'PORT':     str(_p.port or 5432),
            'OPTIONS':  {'connect_timeout': 10},
        }
    # Local dev — use individual env vars + custom search_path
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