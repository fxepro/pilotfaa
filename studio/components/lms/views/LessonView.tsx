'use client'

import { useEffect, useState } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { progressApi } from '@/lib/api/pilotfaa'

export default function LessonView() {
  const {
    activeLesson, loadingLesson,
    activeEnrollment, activeChapterData,
    startStudySession, endStudySession,
    setActiveView, openChapter, activeChapterId,
  } = usePilotFAA()

  const [readPct, setReadPct] = useState(0)

  useEffect(() => {
    if (activeLesson && activeEnrollment) startStudySession(activeLesson.id)
    return () => { endStudySession() }
  }, [activeLesson?.id]) // eslint-disable-line

  // Track scroll depth as read %
  useEffect(() => {
    const el = document.getElementById('pf-lesson-body')
    if (!el) return
    const handler = () => {
      const scrolled = el.scrollTop + el.clientHeight
      const pct = Math.round((scrolled / el.scrollHeight) * 100)
      setReadPct(prev => Math.max(prev, Math.min(pct, 100)))
    }
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [activeLesson?.id])

  async function markProgress(field: 'watch_pct' | 'read_pct', value: number) {
    if (!activeEnrollment) return
    await progressApi.updateCompletion(activeEnrollment.id, {
      lesson_id: activeLesson!.id, [field]: value,
    })
  }

  async function handleComplete() {
    await markProgress('read_pct', 100)
    // Go back to the chapter view if we know which chapter this is
    if (activeChapterId) {
      openChapter(activeChapterId)
    } else {
      setActiveView('dashboard')
    }
  }

  if (loadingLesson) return (
    <div className="pf-view-pad" style={{ textAlign: 'center', padding: 64, color: 'var(--pf-ink-dim)' }}>
      <div style={{ fontSize: 32, marginBottom: 12, animation: 'pfFadeUp 0.3s ease' }}>📖</div>
      Loading lesson…
    </div>
  )

  if (!activeLesson) return (
    <div className="pf-view-pad" style={{ textAlign: 'center', padding: 64 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>📖</div>
      <div style={{ color: 'var(--pf-ink-dim)', marginBottom: 16 }}>Select a lesson from a chapter to begin.</div>
      <button className="pf-btn-primary" onClick={() => setActiveView('dashboard')}>← Back to Dashboard</button>
    </div>
  )

  const content  = activeLesson.content
  const video    = activeLesson.active_video
  const hasVideo = !!video?.video_url

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

      {/* ── Main scrollable lesson body ─────────────────────────────────── */}
      <div id="pf-lesson-body" style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontSize: 13, color: 'var(--pf-ink-dim)' }}>
          <button onClick={() => setActiveView('dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-cobalt)', fontSize: 13, padding: 0 }}>
            Dashboard
          </button>
          <span>›</span>
          {activeChapterData && (
            <>
              <button onClick={() => activeChapterId && openChapter(activeChapterId)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-cobalt)', fontSize: 13, padding: 0 }}>
                Ch.{activeChapterData.chapter_number} — {activeChapterData.title}
              </button>
              <span>›</span>
            </>
          )}
          <span style={{ color: 'var(--pf-ink)' }}>{activeLesson.title}</span>
        </div>

        {/* Lesson header */}
        <div style={{ marginBottom: 24, maxWidth: 820 }}>
          <div style={{ fontSize: 11, color: 'var(--pf-ink-dim)', fontFamily: 'monospace', marginBottom: 6, letterSpacing: '1px' }}>
            LESSON {activeLesson.lesson_number}
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, color: 'var(--pf-ink)', marginBottom: 12, lineHeight: 1.25 }}>
            {activeLesson.title}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="pf-tag pf-tag-blue">{activeLesson.type.replace(/_/g, ' + ').toUpperCase()}</span>
            {activeLesson.duration_minutes && (
              <span className="pf-tag pf-tag-gold">⏱ {activeLesson.duration_minutes} min</span>
            )}
            {activeLesson.is_preview && (
              <span className="pf-tag pf-tag-green">Free Preview</span>
            )}
            {activeLesson.acs_mappings?.slice(0, 3).map(m => (
              <span key={m.id} className="pf-tag pf-tag-green">{m.acs_task_code}</span>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 820 }}>

          {/* ── Video area ──────────────────────────────────────────────── */}
          {hasVideo ? (
            <div style={{ background: '#000', borderRadius: 12, overflow: 'hidden', marginBottom: 28, aspectRatio: '16/9' }}>
              <video
                src={video!.video_url}
                controls
                style={{ width: '100%', height: '100%' }}
                onEnded={() => markProgress('watch_pct', 100)}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget
                  const pct = Math.round((v.currentTime / v.duration) * 100)
                  if (pct > 0 && pct % 20 === 0) markProgress('watch_pct', pct)
                }}
              />
            </div>
          ) : (
            /* Video placeholder — shown until video is generated */
            <div style={{
              background: 'linear-gradient(130deg,#0F1F3A,#1756C8)',
              borderRadius: 12, marginBottom: 28, aspectRatio: '16/9',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 12, color: 'rgba(255,255,255,0.7)',
            }}>
              <div style={{ fontSize: 48, opacity: 0.4 }}>▶</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>Video Coming Soon</div>
              <div style={{ fontSize: 13, opacity: 0.65, textAlign: 'center', maxWidth: 320 }}>
                AI-generated lesson video is being produced.<br />
                Read the lesson text below to study now.
              </div>
              {content?.source_page_ref && (
                <div style={{
                  fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.08)', padding: '6px 14px', borderRadius: 20, marginTop: 4,
                }}>
                  📄 {content.source_page_ref}
                </div>
              )}
            </div>
          )}

          {/* ── Teaching text ────────────────────────────────────────────── */}
          {content?.teaching_text && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: 'var(--pf-ink-dim)', fontFamily: 'monospace', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
                Lesson Content
              </div>
              <div style={{
                fontSize: 15.5, color: 'var(--pf-ink-mid)', lineHeight: 1.85,
                whiteSpace: 'pre-wrap',
              }}>
                {content.teaching_text}
              </div>
            </div>
          )}

          {/* ── Callouts ─────────────────────────────────────────────────── */}
          {content?.callouts && content.callouts.length > 0 && content.callouts.map((c: any, i: number) => {
            const colors: Record<string, { bg: string; border: string; label: string }> = {
              warning: { bg: '#fff8e6', border: '#f59e0b', label: '⚠️' },
              danger:  { bg: '#fff0f0', border: '#dc2626', label: '🚫' },
              tip:     { bg: '#f0fdf4', border: '#16a34a', label: '💡' },
              info:    { bg: 'var(--pf-cobalt-lt)', border: 'var(--pf-cobalt)', label: 'ℹ️' },
            }
            const style = colors[c.variant] ?? colors.info
            return (
              <div key={i} style={{
                background: style.bg, border: `1px solid ${style.border}`,
                borderLeft: `4px solid ${style.border}`,
                borderRadius: 8, padding: '14px 18px', marginBottom: 16,
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
                  {style.label} {c.label}
                </div>
                <div style={{ fontSize: 14, color: 'var(--pf-ink-mid)', lineHeight: 1.7 }}>{c.body}</div>
              </div>
            )
          })}

          {/* ── Key Terms ────────────────────────────────────────────────── */}
          {content?.key_terms && content.key_terms.length > 0 && (
            <div className="pf-card pf-card-p" style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                📚 Key Terms
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {content.key_terms.map((t: any, i: number) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16,
                    paddingBottom: 12,
                    borderBottom: i < content.key_terms.length - 1 ? '1px solid var(--pf-rule-light)' : 'none',
                  }}>
                    <div style={{
                      fontWeight: 700, color: 'var(--pf-cobalt)',
                      fontFamily: 'monospace', fontSize: 13, paddingTop: 2,
                    }}>
                      {t.word}
                    </div>
                    <div style={{ fontSize: 14, color: 'var(--pf-ink-mid)', lineHeight: 1.65 }}>
                      {t.definition}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FAA Source citation ──────────────────────────────────────── */}
          {(content?.source_page_ref || content?.source_section_ref) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--pf-sky)', border: '1px solid var(--pf-rule)',
              borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 12.5,
            }}>
              <span style={{ fontSize: 18 }}>📄</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--pf-ink)', marginBottom: 2 }}>FAA Source</div>
                <div style={{ fontFamily: 'monospace', color: 'var(--pf-ink-dim)', fontSize: 11.5 }}>
                  PHAK FAA-H-8083-25C
                  {content.source_page_ref && ` · ${content.source_page_ref}`}
                  {content.source_section_ref && ` · ${content.source_section_ref}`}
                </div>
              </div>
              <a
                href="https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak"
                target="_blank" rel="noopener noreferrer"
                style={{ marginLeft: 'auto', color: 'var(--pf-cobalt)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}
              >
                View on FAA.gov →
              </a>
            </div>
          )}

          {/* ── Navigation buttons ───────────────────────────────────────── */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 8, marginBottom: 40 }}>
            <button className="pf-btn-outline" onClick={() => activeChapterId ? openChapter(activeChapterId) : setActiveView('dashboard')}>
              ← Back to Chapter
            </button>
            <button
              className="pf-btn-primary"
              style={{ marginLeft: 'auto' }}
              onClick={handleComplete}
            >
              Mark Complete & Continue →
            </button>
          </div>

        </div>
      </div>

      {/* ── Right sidebar: lesson outline ───────────────────────────────── */}
      <div style={{
        width: 240, flexShrink: 0, borderLeft: '1px solid var(--pf-rule)',
        background: 'var(--pf-white)', overflowY: 'auto', padding: '20px 16px',
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--pf-ink-dim)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>
          In this lesson
        </div>

        {hasVideo && (
          <div style={{ fontSize: 13, color: 'var(--pf-ink-mid)', padding: '6px 10px', borderRadius: 6, display: 'flex', gap: 8 }}>
            <span>▶</span> Video ({activeLesson.duration_minutes}m)
          </div>
        )}
        {!hasVideo && (
          <div style={{ fontSize: 13, color: 'var(--pf-ink-dim)', padding: '6px 10px', borderRadius: 6, display: 'flex', gap: 8 }}>
            <span style={{ opacity: 0.4 }}>▶</span> Video (coming soon)
          </div>
        )}
        {content?.teaching_text && (
          <div style={{ fontSize: 13, color: 'var(--pf-ink-mid)', padding: '6px 10px', borderRadius: 6, display: 'flex', gap: 8 }}>
            <span>📝</span> Lesson text
          </div>
        )}
        {content?.callouts?.length > 0 && (
          <div style={{ fontSize: 13, color: 'var(--pf-ink-mid)', padding: '6px 10px', borderRadius: 6, display: 'flex', gap: 8 }}>
            <span>⚠️</span> {content.callouts.length} callout{content.callouts.length > 1 ? 's' : ''}
          </div>
        )}
        {content?.key_terms?.length > 0 && (
          <div style={{ fontSize: 13, color: 'var(--pf-ink-mid)', padding: '6px 10px', borderRadius: 6, display: 'flex', gap: 8 }}>
            <span>📚</span> {content.key_terms.length} key term{content.key_terms.length > 1 ? 's' : ''}
          </div>
        )}

        {/* ACS mappings */}
        {activeLesson.acs_mappings?.length > 0 && (
          <>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--pf-ink-dim)', letterSpacing: '1.5px', textTransform: 'uppercase', marginTop: 16, marginBottom: 8 }}>
              ACS Coverage
            </div>
            {activeLesson.acs_mappings.map((m: any) => (
              <div key={m.id} style={{
                fontSize: 11, fontFamily: 'monospace', color: 'var(--pf-cobalt)',
                background: 'var(--pf-cobalt-lt)', padding: '4px 8px',
                borderRadius: 4, marginBottom: 4,
              }}>
                {m.acs_task_code}
              </div>
            ))}
          </>
        )}

        {/* Read progress */}
        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--pf-rule-light)' }}>
          <div style={{ fontSize: 11, color: 'var(--pf-ink-dim)', marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span>Read progress</span><span>{readPct}%</span>
          </div>
          <div style={{ height: 4, background: 'var(--pf-rule)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${readPct}%`, background: 'var(--pf-cobalt)', borderRadius: 2, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>

    </div>
  )
}
