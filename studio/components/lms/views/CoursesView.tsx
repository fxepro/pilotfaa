'use client'

import Link from 'next/link'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { PILOTFAA_COURSES } from '@/lib/pilotfaa-marketing'

export default function CoursesView() {
  const { courses, enrollments, setActiveCourseSlug, setActiveView } = usePilotFAA()

  return (
    <div className="pf-view-pad">
      <div className="pf-section-heading">All courses</div>
      <p style={{ fontSize: 13, color: 'var(--pf-ink-dim)', margin: '0 0 20px', maxWidth: 640 }}>
        Enroll through checkout to unlock content. If you already have access, use Continue to open the course in the app.
      </p>
      <div className="pf-grid-3">
        {PILOTFAA_COURSES.map((cat) => {
          const enrollment = enrollments.find((e) => e.course_slug === cat.checkoutSlug)
          const apiCourse = courses.find((c) => c.slug === cat.checkoutSlug)
          const enrolled = Boolean(enrollment)
          const canContinue = enrolled && Boolean(apiCourse)
          const lessons = apiCourse?.total_lessons ?? cat.lessons
          const hours =
            apiCourse?.estimated_hours != null
              ? `${apiCourse.estimated_hours}h`
              : cat.hours

          return (
            <div
              key={cat.checkoutSlug}
              className="pf-card pf-card-p"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                borderTop: `3px solid ${cat.color}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 32 }}>{cat.emoji}</div>
                <span
                  className={enrolled ? 'pf-tag pf-tag-green' : 'pf-tag'}
                  style={!enrolled ? { opacity: 0.85, background: 'var(--pf-surface-2, #f1f5f9)' } : undefined}
                >
                  {enrolled ? 'Enrolled' : 'Not enrolled'}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{cat.name}</div>
              <div style={{ fontSize: 12, color: 'var(--pf-ink-dim)', flex: 1 }}>{cat.sub}</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 4 }}>
                <span className="pf-tag pf-tag-blue">{cat.ref}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--pf-ink-dim)' }}>
                {lessons} lessons{hours ? ` · ~${hours}` : ''}
                {enrolled && enrollment && enrollment.progress_pct > 0 && (
                  <span> · {Math.round(enrollment.progress_pct)}% complete</span>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
                {canContinue ? (
                  <button
                    type="button"
                    className="pf-btn-primary"
                    style={{ justifyContent: 'center', fontSize: 12 }}
                    onClick={async () => {
                      await setActiveCourseSlug(cat.checkoutSlug)
                      setActiveView('dashboard')
                    }}
                  >
                    Continue
                  </button>
                ) : enrolled && !apiCourse ? (
                  <button
                    type="button"
                    className="pf-btn-primary"
                    style={{ justifyContent: 'center', fontSize: 12, opacity: 0.6 }}
                    disabled
                    title="This course is not loaded in the catalog yet. Check back soon."
                  >
                    Continue
                  </button>
                ) : (
                  <Link
                    href={`/checkout?course=${encodeURIComponent(cat.checkoutSlug)}`}
                    className="pf-btn-primary"
                    style={{
                      justifyContent: 'center',
                      fontSize: 12,
                      textAlign: 'center',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    Enroll
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
