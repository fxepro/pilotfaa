'use client'

import { usePilotFAA } from '@/contexts/PilotFAAContext'

export default function DashboardView() {
  const {
    setActiveView, openChapter,
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

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
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
          {weakCount > 0 && ` ${weakCount} weak topic${weakCount > 1 ? 's' : ''} to review.`}
        </div>
        <div className="pf-hero-actions">
          <button className="pf-btn-white"       onClick={() => setActiveView('lesson')}>▶ Resume Lesson</button>
          <button className="pf-btn-ghost-white" onClick={() => setActiveView('quiz')}>✏️ Take a Quiz</button>
          <button className="pf-btn-ghost-white" onClick={() => setActiveView('tutor')}>🤖 Ask AI Tutor</button>
        </div>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <div className="pf-stats-row">
        {[
          { label: 'Hours Studied', value: hoursStudied.toFixed(1), note: 'Total study time',        color: 'var(--pf-cobalt)' },
          { label: 'Quiz Average',  value: `${quizAvg}%`,           note: 'Across all attempts',     color: 'var(--pf-green)'  },
          { label: 'Lessons Done',  value: String(lessonsDone),      note: `of ${activeCourse?.total_lessons ?? '—'}`, color: 'var(--pf-gold)' },
          { label: 'Weak Topics',   value: String(weakCount),        note: weakCount > 0 ? '⚠ Need review' : '✓ All strong', color: weakCount > 0 ? 'var(--pf-red)' : 'var(--pf-green)' },
        ].map(s => (
          <div className="pf-stat-card" key={s.label}>
            <div className="pf-stat-accent" style={{ background: s.color }} />
            <div className="pf-stat-label">{s.label}</div>
            <div className="pf-stat-val">{s.value}</div>
            <div className="pf-stat-note">{s.note}</div>
          </div>
        ))}
      </div>

      {/* ── Course content by Module ──────────────────────────────────────── */}
      {activeCourse && activeCourse.modules.length > 0 ? (
        <>
          <div className="pf-section-heading">
            {activeCourse.short_name} — Course Outline
            <span className="pf-tag pf-tag-gold">{activeCourse.primary_source_ref}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeCourse.modules.map((mod, modIdx) => (
              <div key={mod.id} className="pf-card" style={{ overflow: 'hidden' }}>

                {/* Module header */}
                <div style={{
                  padding: '14px 20px',
                  background: 'var(--pf-cobalt-lt)',
                  borderBottom: '1px solid var(--pf-rule)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: 'var(--pf-cobalt)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>{modIdx + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pf-cobalt)' }}>{mod.title}</div>
                    {mod.description && (
                      <div style={{ fontSize: 12, color: 'var(--pf-ink-dim)', marginTop: 2 }}>{mod.description}</div>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--pf-ink-dim)', fontFamily: 'monospace' }}>
                    {mod.chapters.length} chapter{mod.chapters.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Chapters inside module */}
                {mod.chapters.map((ch, idx) => (
                  <div
                    key={ch.id}
                    className="pf-chap-row"
                    onClick={() => openChapter(ch.id)}
                    style={{
                      cursor: 'pointer',
                      borderBottom: idx < mod.chapters.length - 1 ? '1px solid var(--pf-rule-light)' : 'none',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--pf-sky)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="pf-chap-num">{ch.chapter_number}</div>
                    <div className="pf-chap-info">
                      <div className="pf-chap-title">Ch.{ch.chapter_number} — {ch.title}</div>
                      <div className="pf-chap-sub">
                        {ch.lessons.length} lesson{ch.lessons.length !== 1 ? 's' : ''}
                        {ch.source_page_start && (
                          <span style={{ marginLeft: 8, fontFamily: 'monospace', fontSize: 10 }}>
                            pp.{ch.source_page_start}–{ch.source_page_end}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="pf-chap-mini-bar">
                      <div className="pf-cmb-track">
                        <div className="pf-cmb-fill" style={{ width: '0%' }} />
                      </div>
                    </div>
                    <div style={{ color: 'var(--pf-ink-dim)', fontSize: 18, marginLeft: 8 }}>›</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      ) : activeCourse ? (
        /* Course loaded but no modules yet */
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--pf-ink-dim)' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
          <div style={{ fontSize: 15, marginBottom: 8 }}>Course content is being prepared.</div>
          <div style={{ fontSize: 13 }}>Run <code>python seed_pilotfaa.py</code> in the backend to populate lessons.</div>
        </div>
      ) : (
        /* No course enrolled */
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
