'use client'

import { usePilotFAA } from '@/contexts/PilotFAAContext'

export default function DashboardView() {
  const {
    setActiveView, openLesson, openChapter,
    activeCourse, activeEnrollment, stats,
    weakTopics,
  } = usePilotFAA()

  const progressPct = activeEnrollment?.progress_pct ?? 0
  const hoursStudied = stats?.hours_studied ?? 0
  const lessonsDone  = stats?.lessons_done  ?? 0
  const quizAvg      = stats?.quiz_avg_pct  ?? 0
  const weakCount    = stats?.weak_topics   ?? 0

  return (
    <div className="pf-view-pad">
      {/* Hero */}
      <div className="pf-dash-hero">
        <div className="pf-hero-eyebrow">
          ▸ {activeCourse?.short_name ?? 'Ground School'} · FAA PHAK
        </div>
        <div className="pf-hero-title">
          Welcome back.<br />
          <em>Clear skies ahead.</em>
        </div>
        <div className="pf-hero-sub">
          You&apos;re {progressPct}% through {activeCourse?.short_name ?? 'your course'}.
          {weakCount > 0 && ` You have ${weakCount} weak topic${weakCount > 1 ? 's' : ''} to review.`}
        </div>
        <div className="pf-hero-actions">
          <button className="pf-btn-white"       onClick={() => setActiveView('lesson')}>▶ Resume Lesson</button>
          <button className="pf-btn-ghost-white" onClick={() => setActiveView('quiz')}>✏️ Take a Quiz</button>
          <button className="pf-btn-ghost-white" onClick={() => setActiveView('tutor')}>🤖 Ask AI Tutor</button>
        </div>
      </div>

      {/* Stats */}
      <div className="pf-stats-row">
        {[
          { label: 'Hours Studied', value: hoursStudied.toFixed(1), note: 'Total study time',   color: 'var(--pf-cobalt)' },
          { label: 'Quiz Average',  value: `${quizAvg}%`,          note: 'Across all attempts', color: 'var(--pf-green)'  },
          { label: 'Lessons Done',  value: String(lessonsDone),     note: `of ${activeCourse?.total_lessons ?? '—'}`, color: 'var(--pf-gold)' },
          { label: 'Weak Topics',   value: String(weakCount),       note: weakCount > 0 ? '⚠ Need review' : '✓ All strong', color: weakCount > 0 ? 'var(--pf-red)' : 'var(--pf-green)' },
        ].map(s => (
          <div className="pf-stat-card" key={s.label}>
            <div className="pf-stat-accent" style={{ background: s.color }} />
            <div className="pf-stat-label">{s.label}</div>
            <div className="pf-stat-val">{s.value}</div>
            <div className="pf-stat-note">{s.note}</div>
          </div>
        ))}
      </div>

      {/* Module list — from real course data */}
      {activeCourse && (
        <>
          <div className="pf-section-heading">
            PHAK Chapters — {activeCourse.short_name}{' '}
            <span className="pf-tag pf-tag-gold">{activeCourse.primary_source_ref}</span>
          </div>
          <div className="pf-card">
            {activeCourse.modules.flatMap(m => m.chapters).map(ch => (
              <div className="pf-chap-row" key={ch.id}
                onClick={() => openChapter(ch.id)}
                style={{ cursor: 'pointer' }}
              >
                <div className="pf-chap-num">{ch.chapter_number}</div>
                <div className="pf-chap-info">
                  <div className="pf-chap-title">Ch.{ch.chapter_number} — {ch.title}</div>
                  <div className="pf-chap-sub">
                    {ch.lessons.length} lesson{ch.lessons.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <div className="pf-chap-mini-bar">
                  <div className="pf-cmb-track">
                    <div className="pf-cmb-fill" style={{ width: '0%', background: 'var(--pf-ink-dim)' }} />
                  </div>
                </div>
                <div style={{ color: 'var(--pf-ink-dim)', fontSize: 16, marginLeft: 8 }}>›</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* No course enrolled CTA */}
      {!activeCourse && (
        <div style={{ textAlign: 'center', padding: '48px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✈</div>
          <div style={{ fontSize: 16, marginBottom: 12 }}>No course loaded yet.</div>
          <button className="pf-btn-primary" onClick={() => setActiveView('courses')}>
            Browse Courses →
          </button>
        </div>
      )}
    </div>
  )
}
