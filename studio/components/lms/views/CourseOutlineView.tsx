'use client'

import { usePilotFAA } from '@/contexts/PilotFAAContext'

export default function CourseOutlineView() {
  const { activeCourse, openChapter, setActiveView } = usePilotFAA()

  if (!activeCourse) {
    return (
      <div className="pf-view-pad" style={{ textAlign: 'center', padding: '48px 20px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✈</div>
        <div style={{ fontSize: 16, marginBottom: 12, color: 'var(--pf-ink-dim)' }}>No course loaded.</div>
        <button type="button" className="pf-btn-primary" onClick={() => setActiveView('courses')}>
          Choose a course
        </button>
      </div>
    )
  }

  if (!activeCourse.modules.length) {
    return (
      <div className="pf-view-pad" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--pf-ink-dim)' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
        <div style={{ fontSize: 15, marginBottom: 8 }}>No outline for this course yet.</div>
        <div style={{ fontSize: 13 }}>Content is added in Django / seed scripts.</div>
      </div>
    )
  }

  const heading = `${activeCourse.short_name} — Course Outline`

  return (
    <div className="pf-view-pad">
      <div className="pf-section-heading">
        {heading}
        <span className="pf-tag pf-tag-gold">{activeCourse.primary_source_ref}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {activeCourse.modules.map((mod, modIdx) => (
          <div key={mod.id} className="pf-card" style={{ overflow: 'hidden' }}>
            <div
              style={{
                padding: '14px 20px',
                background: 'var(--pf-cobalt-lt)',
                borderBottom: '1px solid var(--pf-rule)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: 'var(--pf-cobalt)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {modIdx + 1}
              </div>
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

            {mod.chapters.map((ch, idx) => (
              <div
                key={ch.id}
                className="pf-chap-row"
                role="button"
                tabIndex={0}
                onClick={() => openChapter(ch.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    openChapter(ch.id)
                  }
                }}
                style={{
                  cursor: 'pointer',
                  borderBottom: idx < mod.chapters.length - 1 ? '1px solid var(--pf-rule-light)' : 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--pf-sky)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <div className="pf-chap-num">{ch.chapter_number}</div>
                <div className="pf-chap-info">
                  <div className="pf-chap-title">
                    Ch.{ch.chapter_number} — {ch.title}
                  </div>
                  <div className="pf-chap-sub">
                    {ch.lessons.length} lesson{ch.lessons.length !== 1 ? 's' : ''}
                    {ch.source_page_start != null && (
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
    </div>
  )
}
