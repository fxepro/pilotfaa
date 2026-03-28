from django.urls import path
from . import views

urlpatterns = [
    # Enrollments
    path('enrollments/',                                    views.my_enrollments,     name='pf_enrollments'),
    path('enroll/',                                         views.enroll,             name='pf_enroll'),
    path('enrollments/<slug:course_slug>/',                 views.enrollment_detail,  name='pf_enrollment_detail'),

    # Lesson completions
    path('enrollments/<int:enrollment_id>/completions/',    views.lesson_completions, name='pf_completions'),

    # Study sessions
    path('sessions/start/',                                 views.start_session,      name='pf_session_start'),
    path('sessions/<int:session_id>/end/',                  views.end_session,        name='pf_session_end'),
    path('heatmap/',                                        views.heatmap,            name='pf_heatmap'),

    # Bookmarks
    path('bookmarks/',                                      views.bookmarks,          name='pf_bookmarks'),
    path('bookmarks/<int:bookmark_id>/',                    views.bookmark_detail,    name='pf_bookmark_detail'),

    # Notes
    path('notes/',                                          views.notes,              name='pf_notes'),
    path('notes/<int:note_id>/',                            views.note_detail,        name='pf_note_detail'),

    # Dashboard
    path('stats/',                                          views.dashboard_stats,    name='pf_stats'),
]
