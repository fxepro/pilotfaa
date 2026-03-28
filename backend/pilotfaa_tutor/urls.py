from django.urls import path
from . import views

urlpatterns = [
    path('sessions/',                                      views.start_session,    name='pf_tutor_start'),
    path('sessions/<int:session_id>/end/',                 views.end_session,      name='pf_tutor_end'),
    path('sessions/<int:session_id>/messages/',            views.session_messages, name='pf_tutor_messages'),
    path('sessions/<int:session_id>/ask/',                 views.ask,              name='pf_tutor_ask'),
    path('messages/<int:message_id>/feedback/',            views.submit_feedback,  name='pf_tutor_feedback'),
]
