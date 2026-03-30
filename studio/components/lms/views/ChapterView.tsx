'use client'

import { usePilotFAA } from '@/contexts/PilotFAAContext'

export default function ChapterView() {
  const {
    activeChapterData,
    openLesson,
    setActiveView,
    quizBanks,
    activeEnrollment,
    activeCourse,
  } = usePilotFAA()

  if (!activeChapterData) return (
    <div className="pf-view-pad" style={{ textAlign: 'center', padding: 64, color: 'var(--pf-ink-dim)' }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
      <div>No chapter selected.</div>
      <button className="pf-btn-primary" style={{ marginTop: 16 }} onClick={() => setActiveView('dashboard')}>
        ← Back to Dashboard
      </button>
    </div>
  )

  const chapterBank = quizBanks.find(b => b.chapter === activeChapterData.id)

  return (
    <div className="pf-view-pad">

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: 'var(--pf-ink-dim)' }}>
        <button onClick={() => setActiveView('dashboard')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-cobalt)', fontSize: 13, padding: 0 }}>
          Dashboard
        </button>
        <span>›</span>
        <span>{activeCourse?.short_name ?? 'Course'}</span>
        <span>›</span>
        <span style={{ color: 'var(--pf-ink)' }}>Ch.{activeChapterData.chapter_number} — {activeChapterData.title}</span>
      </div>

      {/* Chapter header */}
      <div className="pf-card pf-card-p" style={{ marginBottom: 24, background: 'linear-gradient(130deg,#0F1F3A,#1756C8)', color: '#fff', border: 'none' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 8 }}>
          Chapter {activeChapterData.chapter_number}
        </div>
        <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          {activeChapterData.title}
        </div>
        {activeChapterData.source_page_start && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace' }}>
            📄 PHAK FAA-H-8083-25C · pp.{activeChapterData.source_page_start}–{activeChapterData.source_page_end}
          </div>
        )}
        <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
          <span>📚 {activeChapterData.lessons.length} lesson{activeChapterData.lessons.length !== 1 ? 's' : ''}</span>
          {chapterBank && <span>✏️ {chapterBank.question_count} quiz questions</span>}
        </div>
      </div>

      {/* Lessons list */}
      <div className="pf-section-heading">Lessons</div>
      <div className="pf-card" style={{ marginBottom: 24 }}>
        {activeChapterData.lessons.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--pf-ink-dim)', fontSize: 14 }}>
            Lessons coming soon for this chapter.
          </div>
        ) : (
          activeChapterData.lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              onClick={() => openLesson(lesson.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                borderBottom: idx < activeChapterData.lessons.length - 1 ? '1px solid var(--pf-rule-light)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--pf-sky)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Lesson number circle */}
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: 'var(--pf-cobalt-lt)', color: 'var(--pf-cobalt)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'monospace', fontSize: 11, fontWeight: 700, flexShrink: 0,
              }}>
                {lesson.lesson_number}
              </div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--pf-ink)', marginBottom: 3 }}>
                  {lesson.title}
                </div>
                <div style={{ display: 'flex', gap: 10, fontSize: 12, color: 'var(--pf-ink-dim)' }}>
                  <span style={{ textTransform: 'capitalize' }}>{lesson.type.replace('_', ' + ')}</span>
                  {lesson.duration_minutes && <span>· {lesson.duration_minutes} min</span>}
                  {lesson.is_preview && <span className="pf-tag pf-tag-green" style={{ fontSize: 10 }}>Free Preview</span>}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ color: 'var(--pf-ink-dim)', fontSize: 16 }}>›</div>
            </div>
          ))
        )}
      </div>

      {/* Chapter quiz CTA */}
      {chapterBank && activeEnrollment && (
        <div className="pf-card pf-card-p" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--pf-ink)', marginBottom: 4 }}>
              Chapter {activeChapterData.chapter_number} Quiz
            </div>
            <div style={{ fontSize: 13, color: 'var(--pf-ink-dim)' }}>
              {chapterBank.question_count} questions · Pass at {chapterBank.pass_threshold_pct}%
            </div>
          </div>
          <button
            className="pf-btn-primary"
            onClick={() => setActiveView('quiz')}
          >
            ✏️ Take Quiz
          </button>
        </div>
      )}
    </div>
  )
}
