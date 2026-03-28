from django.urls import path
from . import views

urlpatterns = [
    path('banks/',                              views.bank_list,        name='pf_bank_list'),
    path('banks/<int:bank_id>/questions/',      views.bank_questions,   name='pf_bank_questions'),
    path('attempts/',                           views.start_attempt,    name='pf_start_attempt'),
    path('attempts/<int:attempt_id>/respond/',  views.submit_response,  name='pf_submit_response'),
    path('attempts/<int:attempt_id>/complete/', views.complete_attempt, name='pf_complete_attempt'),
    path('attempts/history/',                   views.attempt_history,  name='pf_attempt_history'),
    path('mastery/',                            views.topic_mastery,    name='pf_mastery'),
]
