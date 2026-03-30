from django.urls import path
from . import views

urlpatterns = [
    path('pdf/<str:short_code>/', views.serve_pdf,      name='pf_faa_serve_pdf'),
    path('documents/',            views.list_documents,  name='pf_faa_documents'),
]
