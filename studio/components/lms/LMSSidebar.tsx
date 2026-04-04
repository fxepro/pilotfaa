'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { usePilotFAA, type ViewId } from '@/contexts/PilotFAAContext'
import { PilotFAABrandContent } from '@/components/pilotfaa-brand'
import { PILOTFAA_COURSES } from '@/lib/pilotfaa-marketing'

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window !== 'undefined' ? '' : 'http://localhost:8000')

const NAV_SECTIONS = [
  {
    label: 'Learn',
    items: [
      { id: 'dashboard' as ViewId, icon: '🗺',  label: 'Dashboard' },
      { id: 'courses'   as ViewId, icon: '📚',  label: 'All Courses' },
      { id: 'courseOutline' as ViewId, icon: '📋', label: 'Course outline' },
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
      { id: 'faaLibrary' as ViewId, icon: '📚', label: 'FAA Library' },
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
    activeEnrollment, enrollments,
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

  const activeCatalog = PILOTFAA_COURSES.find((c) => c.checkoutSlug === activeCourseSlug)
  const activeApiCourse = courses.find((c) => c.slug === activeCourseSlug)
  const switcherEmoji = activeApiCourse?.icon_emoji ?? activeCatalog?.emoji ?? '✈'
  const switcherName =
    activeApiCourse?.short_name ?? activeCatalog?.name ?? 'Select a course'

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
            <div className="pf-cs-badge">{switcherEmoji}</div>
            <div className="pf-cs-name">{switcherName}</div>
            <div className="pf-cs-chevron">▼</div>
          </div>
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="pf-course-dropdown">
            {PILOTFAA_COURSES.map((cat) => {
              const apiCourse = courses.find((c) => c.slug === cat.checkoutSlug)
              const enrolled = enrollments.some((e) => e.course_slug === cat.checkoutSlug)
              const canSwitch = enrolled && Boolean(apiCourse)
              const isActive = cat.checkoutSlug === activeCourseSlug

              return (
                <div
                  key={cat.checkoutSlug}
                  className={`pf-cd-item${isActive ? ' active' : ''}${!enrolled ? ' pf-cd-item-muted' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (canSwitch) {
                      void setActiveCourseSlug(cat.checkoutSlug)
                      setDropdownOpen(false)
                    } else if (enrolled) {
                      setActiveView('courses')
                      setDropdownOpen(false)
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      if (canSwitch) {
                        void setActiveCourseSlug(cat.checkoutSlug)
                        setDropdownOpen(false)
                      } else if (enrolled) {
                        setActiveView('courses')
                        setDropdownOpen(false)
                      }
                    }
                  }}
                >
                  <div className="pf-cs-badge">{apiCourse?.icon_emoji ?? cat.emoji}</div>
                  <div className="pf-cd-info">
                    <div className="pf-cd-name">{cat.name}</div>
                    <div className="pf-cd-sub">{cat.sub}</div>
                  </div>
                  {enrolled && <span className="pf-tag pf-tag-green" style={{ fontSize: 10, padding: '2px 6px' }}>Enrolled</span>}
                  {!enrolled && (
                    <Link
                      href={`/checkout?course=${encodeURIComponent(cat.checkoutSlug)}`}
                      className="pf-cd-enroll"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDropdownOpen(false)
                      }}
                    >
                      Enroll
                    </Link>
                  )}
                  {isActive && <span className="pf-cd-check">✓</span>}
                </div>
              )
            })}
            <div
              className="pf-cd-add"
              onClick={() => {
                setActiveView('courses')
                setDropdownOpen(false)
              }}
            >
              ＋ All courses & details
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
          <span>{activeCourse?.short_name ?? activeCatalog?.name ?? 'No course'} Progress</span>
          <strong>{progressPct}%</strong>
        </div>
        <div className="pf-sf-bar">
          <div className="pf-sf-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
    </aside>
  )
}
