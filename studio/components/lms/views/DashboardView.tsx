'use client'

import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { PILOTFAA_COURSES } from '@/lib/pilotfaa-marketing'

function formatStudyTime(totalSeconds: number) {
  if (totalSeconds <= 0) return '—'
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function DashboardView() {
  const {
    setActiveView,
    activeCourseSlug,
    enrollments,
    courses,
    setActiveCourseSlug,
    openLesson,
    stats,
    weakTopics,
  } = usePilotFAA()

  const hoursStudied = stats?.hours_studied ?? 0
  const lessonsDone = stats?.lessons_done ?? 0
  const quizAvg = stats?.quiz_avg_pct ?? 0
  const weakCount = stats?.weak_topics ?? weakTopics.length

  const enrolledCount = enrollments.length
  const avgProgress =
    enrolledCount > 0
      ? Math.round(
          enrollments.reduce((acc, e) => acc + (e.progress_pct ?? 0), 0) / enrolledCount
        )
      : 0

  return (
    <div className="pf-view-pad">
      <div className="pf-dash-hero">
        <div className="pf-hero-eyebrow">▸ Dashboard</div>
        <div className="pf-hero-title">
          Welcome back.
          <br />
          <em>Clear skies ahead.</em>
        </div>
        <div className="pf-hero-sub">
          {enrolledCount === 0
            ? 'Enroll in a course to start tracking progress here.'
            : `${enrolledCount} enrolled course${enrolledCount !== 1 ? 's' : ''} · average progress ${avgProgress}%`}
          {weakCount > 0 && ` · ${weakCount} weak topic${weakCount > 1 ? 's' : ''} to review.`}
        </div>
        <div className="pf-hero-actions">
          <button className="pf-btn-white" onClick={() => setActiveView('courses')}>
            All courses
          </button>
          <button className="pf-btn-ghost-white" onClick={() => setActiveView('quiz')}>
            ✏️ Quizzes
          </button>
          <button className="pf-btn-ghost-white" onClick={() => setActiveView('tutor')}>
            🤖 AI Tutor
          </button>
        </div>
      </div>

      <div className="pf-stats-row">
        {[
          {
            label: 'Hours studied',
            value: hoursStudied.toFixed(1),
            note: 'Total study time',
            color: 'var(--pf-cobalt)',
          },
          {
            label: 'Quiz average',
            value: `${quizAvg}%`,
            note: 'Across attempts',
            color: 'var(--pf-green)',
          },
          {
            label: 'Lessons done',
            value: String(lessonsDone),
            note: 'Completed',
            color: 'var(--pf-gold)',
          },
          {
            label: 'Weak topics',
            value: String(weakCount),
            note: weakCount > 0 ? '⚠ Need review' : '✓ None flagged',
            color: weakCount > 0 ? 'var(--pf-red)' : 'var(--pf-green)',
          },
        ].map((s) => (
          <div className="pf-stat-card" key={s.label}>
            <div className="pf-stat-accent" style={{ background: s.color }} />
            <div className="pf-stat-label">{s.label}</div>
            <div className="pf-stat-val">{s.value}</div>
            <div className="pf-stat-note">{s.note}</div>
          </div>
        ))}
      </div>

      <div className="pf-section-heading">Your enrollments</div>
      <p style={{ fontSize: 13, color: 'var(--pf-ink-dim)', margin: '-8px 0 16px' }}>
        Progress and study time for courses you&apos;re enrolled in.
      </p>

      {enrollments.length === 0 ? (
        <div className="pf-card pf-card-p" style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--pf-ink-dim)' }}>
          <div style={{ fontSize: 15, marginBottom: 12 }}>No enrollments yet.</div>
          <button type="button" className="pf-btn-primary" onClick={() => setActiveView('courses')}>
            Browse courses
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {enrollments.map((enr) => {
            const cat = PILOTFAA_COURSES.find((c) => c.checkoutSlug === enr.course_slug)
            const api = courses.find((c) => c.slug === enr.course_slug)
            const isActive = enr.course_slug === activeCourseSlug
            const pct = Math.round(enr.progress_pct ?? 0)
            const title = cat?.name ?? enr.course_name
            const sub = cat?.sub ?? enr.course_slug.replace(/-/g, ' ')
            const emoji = cat?.emoji ?? '📘'
            const accent = cat?.color ?? 'var(--pf-cobalt)'

            return (
              <div
                key={enr.id}
                className="pf-card pf-card-p"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto auto',
                  gap: 14,
                  alignItems: 'center',
                  borderLeft: `4px solid ${accent}`,
                }}
              >
                <div style={{ fontSize: 28 }}>{emoji}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'var(--pf-ink-dim)' }}>{sub}</div>
                  <div style={{ fontSize: 11, color: 'var(--pf-ink-dim)', marginTop: 4, fontFamily: 'monospace' }}>
                    {api ? `${api.total_lessons} lessons` : cat ? `${cat.lessons} lessons` : '—'}
                    <span style={{ marginLeft: 10 }}>· study {formatStudyTime(enr.total_time_seconds)}</span>
                    {enr.last_lesson_title && (
                      <span style={{ marginLeft: 10 }}>· last: {enr.last_lesson_title}</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--pf-ink-dim)',
                      textTransform: 'uppercase' as const,
                      letterSpacing: '0.06em',
                    }}
                  >
                    Progress
                  </div>
                  <div
                    style={{
                      fontSize: 20,
                      fontWeight: 800,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: 'var(--pf-cobalt)',
                    }}
                  >
                    {pct}%
                  </div>
                  {isActive && (
                    <div style={{ fontSize: 11, marginTop: 2 }}>
                      <span className="pf-tag pf-tag-blue" style={{ fontSize: 10 }}>
                        Active
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'stretch' }}>
                  {api ? (
                    <>
                      <button
                        type="button"
                        className="pf-btn-primary"
                        style={{ fontSize: 11, padding: '6px 12px', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          void setActiveCourseSlug(enr.course_slug)
                          if (enr.last_lesson != null) {
                            openLesson(enr.last_lesson)
                          } else {
                            setActiveView('lesson')
                          }
                        }}
                      >
                        {enr.last_lesson != null ? 'Resume' : 'Open'}
                      </button>
                    </>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--pf-ink-dim)', maxWidth: 120 }}>Content pending</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
