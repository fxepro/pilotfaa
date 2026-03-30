from django.urls import path, re_path
from . import views

urlpatterns = [
    # With and without trailing slash — Next.js proxy sometimes strips trailing slash
    path('pdf/<str:short_code>/',  views.serve_pdf,     name='pf_faa_serve_pdf'),
    path('pdf/<str:short_code>',   views.serve_pdf,     name='pf_faa_serve_pdf_noslash'),
    path('documents/',             views.list_documents, name='pf_faa_documents'),
]
