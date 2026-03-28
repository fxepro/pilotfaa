from django.urls import path
from . import views

urlpatterns = [
    path('api/site-config/', views.get_site_config, name='get_site_config'),
    path('api/site-config/update/', views.update_site_config, name='update_site_config'),
    path('api/site-config/public/', views.get_public_site_flags, name='get_public_site_flags'),
]
