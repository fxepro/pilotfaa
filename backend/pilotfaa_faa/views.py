"""
pilotfaa_faa/views.py
Serves FAA source documents (PDF) to authenticated users.

The PDF endpoint accepts the JWT token as a query parameter (?token=...)
because browser iframes cannot send custom Authorization headers.
"""
from django.http import HttpResponse, Http404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import FAASourceDocument


def _authenticate_token(request):
    """Extract and validate JWT from ?token= query param or Authorization header."""
    from rest_framework_simplejwt.tokens import AccessToken
    from django.contrib.auth.models import User

    token_str = request.GET.get('token') or request.headers.get('Authorization', '').replace('Bearer ', '')
    if not token_str:
        return None
    try:
        token = AccessToken(token_str)
        return User.objects.get(id=token['user_id'])
    except Exception:
        return None


@api_view(['GET', 'HEAD'])
@permission_classes([AllowAny])
def serve_pdf(request, short_code):
    """
    GET /api/pilotfaa/faa/pdf/<short_code>/?token=<jwt>
    Returns the stored PDF binary. Accepts token as query param for iframe use.
    HEAD is used by PhakView to check if PDF exists before showing the iframe.
    """
    user = _authenticate_token(request)
    if not user or not user.is_active:
        return HttpResponse(status=401)

    try:
        doc = FAASourceDocument.objects.get(
            short_code=short_code.upper(), is_current=True
        )
    except FAASourceDocument.DoesNotExist:
        raise Http404(f"No document found: {short_code}")

    if not doc.pdf_file:
        return HttpResponse(
            f"PDF not yet uploaded for {short_code}. Run: python upload_pdf.py {short_code} <file.pdf>",
            status=404
        )

    if request.method == 'HEAD':
        return HttpResponse(
            status=200,
            headers={
                'Content-Type': 'application/pdf',
                'X-Frame-Options': 'SAMEORIGIN',
            }
        )

    return HttpResponse(
        bytes(doc.pdf_file),
        content_type='application/pdf',
        headers={
            'Content-Disposition': f'inline; filename="{doc.publication_ref}.pdf"',
            'Cache-Control': 'private, max-age=3600',
            'X-Frame-Options': 'SAMEORIGIN',
        }
    )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_documents(request):
    """GET /api/pilotfaa/faa/documents/ — list all FAA source docs (no binary)."""
    docs = FAASourceDocument.objects.filter(is_current=True).order_by('short_code')
    return Response([{
        'id':              d.id,
        'short_code':      d.short_code,
        'full_title':      d.full_title,
        'publication_ref': d.publication_ref,
        'version':         d.version,
        'effective_date':  d.effective_date,
        'chapter_count':   d.chapter_count,
        'has_pdf':         bool(d.pdf_file),
        'source_url':      d.source_url,
    } for d in docs])
