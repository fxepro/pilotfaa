'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { usePilotFAA, type ViewId } from '@/contexts/PilotFAAContext'
import { PilotFAABrandContent } from '@/components/pilotfaa-brand'

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== 'undefined' ? '' : 'http://localhost:8000')

const NAV_SECTIONS = [
  {
    label: 'Learn',
    items: [
      { id: 'dashboard' as ViewId, icon: '🗺',  label: 'Dashboard' },
      { id: 'courses'   as ViewId, icon: '📚',  label: 'All Courses' },
      { id: 'lesson'    as ViewId, icon: '▶️',  label: 'Lesson Player' },
      { id: 'tutor'     as ViewId, icon: '🤖',  label: 'AI Tutor', badge: 'AI' },
    ],
  },
  {
    label: 'Study',
    items: [
      { id: 'quiz'      as ViewId, icon: '✏️',  label: 'Quizzes & Exams' },
      { id: 'progress'  as ViewId, icon: '📊',  label: 'My Progress' },
      { id: 'bookmarks' as ViewId, icon: '🔖',  label: 'Bookmarks',  count: true },
      { id: 'notes'     as ViewId, icon: '📝',  label: 'My Notes',   count: true },
    ],
  },
  {
    label: 'FAA References',
    items: [
      { id: 'phak'   as ViewId, icon: '📖', label: 'PHAK Reference' },
      { id: 'faraim' as ViewId, icon: '⚖️', label: 'FAR / AIM' },
      { id: 'acs'    as ViewId, icon: '🎯', label: 'ACS Standards' },
    ],
  },
]

export default function LMSSidebar() {
  const {
    activeView, setActiveView,
    courses, activeCourse, activeCourseSlug, setActiveCourseSlug,
    activeEnrollment,
    bookmarkCount, noteCount,
  } = usePilotFAA()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropRef = useRef<HTMLDivElement>(null)
  const [portalUser, setPortalUser] = useState<{
    can_access_workspace?: boolean
    is_superuser?: boolean
  } | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) return
    let cancelled = false
    axios
      .get(`${API_BASE}/api/user-info/`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!cancelled) setPortalUser(r.data)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const progressPct = activeEnrollment?.progress_pct ?? 0

  function getCount(id: ViewId): number | undefined {
    if (id === 'bookmarks') return bookmarkCount
    if (id === 'notes')     return noteCount
    return undefined
  }

  return (
    <aside className="pf-sidebar">
      {/* Logo */}
      <Link href="/" className="pf-logo no-underline text-inherit hover:opacity-95 transition-opacity">
        <PilotFAABrandContent
          width={128}
          height={32}
          taglineClassName="text-[10px] text-[var(--pf-ink-dim)]"
        />
      </Link>

      {/* Course switcher */}
      <div style={{ position: 'relative', margin: '12px 12px 0' }} ref={dropRef}>
        <div
          className="pf-course-switcher"
          onClick={() => setDropdownOpen(v => !v)}
        >
          <div className="pf-cs-label">Active Course</div>
          <div className="pf-cs-row">
            <div className="pf-cs-badge">
              {courses.find(c => c.slug === activeCourseSlug)?.icon_emoji ?? '✈'}
            </div>
            <div className="pf-cs-name">
              {courses.find(c => c.slug === activeCourseSlug)?.short_name ?? 'Loading…'}
            </div>
            <div className="pf-cs-chevron">▼</div>
          </div>
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="pf-course-dropdown">
            {courses.map(course => (
              <div
                key={course.slug}
                className={`pf-cd-item${course.slug === activeCourseSlug ? ' active' : ''}`}
                onClick={() => {
                  setActiveCourseSlug(course.slug)
                  setDropdownOpen(false)
                }}
              >
                <div className="pf-cs-badge">{course.icon_emoji}</div>
                <div className="pf-cd-info">
                  <div className="pf-cd-name">{course.name}</div>
                  <div className="pf-cd-sub">{course.primary_source_ref}</div>
                </div>
                {course.slug === activeCourseSlug && (
                  <span className="pf-cd-check">✓</span>
                )}
              </div>
            ))}
            <div
              className="pf-cd-add"
              onClick={() => { setActiveView('courses'); setDropdownOpen(false) }}
            >
              ＋ Browse all courses
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="pf-nav-scroll">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <div className="pf-nav-section-label">{section.label}</div>
            {section.items.map(item => {
              const count = getCount(item.id)
              return (
                <div
                  key={item.id}
                  className={`pf-nav-item${activeView === item.id ? ' active' : ''}`}
                  onClick={() => setActiveView(item.id)}
                >
                  <span className="pf-ni-icon">{item.icon}</span>
                  {item.label}
                  {'badge' in item && item.badge && (
                    <span className="pf-ni-badge">{item.badge}</span>
                  )}
                  {count !== undefined && (
                    <span className="pf-ni-count">{count}</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      {portalUser &&
        (portalUser.is_superuser || portalUser.can_access_workspace) && (
          <div
            className="pf-sidebar-admin"
            style={{
              margin: '8px 12px 0',
              paddingTop: 10,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="pf-nav-section-label">Admin</div>
            {portalUser.is_superuser && (
              <Link href="/django-admin/" className="pf-nav-item">
                <span className="pf-ni-icon">⚙</span>
                Django Admin
              </Link>
            )}
            {portalUser.can_access_workspace && (
              <Link href="/workspace" className="pf-nav-item">
                <span className="pf-ni-icon">◫</span>
                Admin workspace
              </Link>
            )}
          </div>
        )}

      {/* Footer progress bar */}
      <div className="pf-sidebar-footer">
        <div className="pf-sf-prog-label">
          <span>{activeCourse?.short_name ?? 'No course'} Progress</span>
          <strong>{progressPct}%</strong>
        </div>
        <div className="pf-sf-bar">
          <div className="pf-sf-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </aside>
  )
}
