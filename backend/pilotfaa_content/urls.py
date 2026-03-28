from django.urls import path
from . import views

urlpatterns = [
    # Student-facing
    path('courses/',                          views.course_list,         name='pf_course_list'),
    path('courses/<slug:slug>/',              views.course_detail,       name='pf_course_detail'),
    path('chapters/<int:chapter_id>/',        views.chapter_detail,      name='pf_chapter_detail'),
    path('lessons/<int:lesson_id>/',          views.lesson_detail,       name='pf_lesson_detail'),

    # Admin / editor
    path('admin/courses/',                    views.admin_course_list,   name='pf_admin_course_list'),
    path('admin/courses/<slug:slug>/',        views.admin_course_detail, name='pf_admin_course_detail'),
    path('admin/lessons/<int:lesson_id>/publish/', views.publish_lesson, name='pf_publish_lesson'),
]
