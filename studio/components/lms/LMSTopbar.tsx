'use client'

import { useState } from 'react'
import { usePilotFAA, type ViewId } from '@/contexts/PilotFAAContext'
import { PILOTFAA_COURSES } from '@/lib/pilotfaa-marketing'

const PAGE_INFO: Record<ViewId, { title: string; breadcrumb: string }> = {
  dashboard:    { title: 'Dashboard',       breadcrumb: '' },
  courses:      { title: 'All Courses',     breadcrumb: 'Course Catalog' },
  courseDetail: { title: 'Course',          breadcrumb: 'Course Overview' },
  courseOutline: { title: 'Course outline', breadcrumb: 'Modules & chapters' },
  chapter:      { title: 'Chapter',         breadcrumb: 'Lessons' },
  lesson:       { title: 'Lesson Player',   breadcrumb: 'Lesson' },
  tutor:        { title: 'AI Tutor',        breadcrumb: 'AI Tutor Session' },
  quiz:         { title: 'Quizzes & Exams', breadcrumb: 'Chapter Quiz' },
  bookmarks:    { title: 'Bookmarks',       breadcrumb: 'Saved Items' },
  notes:        { title: 'My Notes',        breadcrumb: 'Study Notes' },
  phak:         { title: 'PHAK Reference',  breadcrumb: 'FAA-H-8083-25C' },
  faraim:       { title: 'FAR / AIM',       breadcrumb: '14 CFR · eCFR.gov' },
  acs:          { title: 'ACS Standards',   breadcrumb: 'FAA-S-ACS-6C' },
  progress:     { title: 'My Progress',     breadcrumb: 'Progress Report' },
}

export default function LMSTopbar() {
  const { activeView, activeCourse, activeLesson, activeChapterData, activeCourseSlug } = usePilotFAA()
  const [query, setQuery] = useState('')

  const info = PAGE_INFO[activeView] ?? { title: 'PilotFAA', breadcrumb: '' }
  const catalogCourse = PILOTFAA_COURSES.find((c) => c.checkoutSlug === activeCourseSlug)
  const courseLabel = activeCourse?.short_name ?? catalogCourse?.name ?? 'PilotFAA'

  // Dynamic breadcrumb per view
  const breadcrumb =
    activeView === 'lesson'  && activeLesson
      ? `${activeLesson.lesson_number} › ${activeLesson.title}`
    : activeView === 'chapter' && activeChapterData
      ? `Ch.${activeChapterData.chapter_number} — ${activeChapterData.title}`
    : activeView === 'courses' && activeCourse
      ? activeCourse.short_name
    : activeView === 'dashboard'
      ? courseLabel
    : activeView === 'courseOutline'
      ? courseLabel
    : info.breadcrumb

  return (
    <div className="pf-topbar">
      <div className="pf-topbar-left">
        <div className="pf-page-title">{info.title}</div>
        <div className="pf-breadcrumb">
          <span>{courseLabel}</span>
          {breadcrumb && breadcrumb !== courseLabel && (
            <> › {breadcrumb}</>
          )}
        </div>
      </div>

      <div className="pf-topbar-right">
        <div className="pf-search-wrap">
          <span className="pf-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search lessons, topics…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <button className="pf-btn-icon-top" title="Notifications">🔔</button>
        <button className="pf-btn-icon-top" title="Settings">⚙️</button>
        {/* Avatar — initials from Django user */}
        <div className="pf-avatar" title="My Account">AJ</div>
      </div>
    </div>
  )
}
