'use client'

import { useEffect, useState, useRef } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { progressApi } from '@/lib/api/pilotfaa'

// PHAK chapter index — matches PhakView
const PHAK_CHAPTERS = [
  { num: 1,  title: 'Introduction to Flying',         pdfPage: 13  },
  { num: 2,  title: 'Aeronautical Decision-Making',   pdfPage: 31  },
  { num: 3,  title: 'Flight Instruments',             pdfPage: 61  },
  { num: 4,  title: 'Aircraft Systems',               pdfPage: 113 },
  { num: 5,  title: 'Aerodynamics of Flight',         pdfPage: 163 },
  { num: 6,  title: 'Flight Controls',                pdfPage: 223 },
  { num: 7,  title: 'Aircraft Performance',           pdfPage: 253 },
  { num: 8,  title: 'Weight and Balance',             pdfPage: 293 },
  { num: 9,  title: 'Flight Navigation',              pdfPage: 323 },
  { num: 10, title: 'Aviation Weather',               pdfPage: 383 },
  { num: 11, title: 'Aviation Weather Services',      pdfPage: 443 },
  { num: 12, title: 'Airport Operations',             pdfPage: 493 },
  { num: 13, title: 'Airspace',                       pdfPage: 533 },
  { num: 14, title: 'Air Traffic Control',            pdfPage: 573 },
  { num: 15, title: 'Emergency Procedures',           pdfPage: 613 },
  { num: 16, title: 'Night Operations',               pdfPage: 643 },
  { num: 17, title: 'High-Altitude and Aeromedical',  pdfPage: 663 },
]

export default function LessonView() {
  const {
    activeLesson, loadingLesson,
    activeEnrollment, activeChapterData,
    startStudySession, endStudySession,
    setActiveView, openChapter, activeChapterId,
    quizBanks,
  } = usePilotFAA()

  const [readPct,     setReadPct]     = useState(0)
  const [paneOpen,    setPaneOpen]    = useState<'phak' | 'acs' | null>(null)
  const [phakToken,   setPhakToken]   = useState('')
  const [phakReady,   setPhakReady]   = useState(false)
  const [completed,   setCompleted]   = useState(false)
  const phakChecked = useRef(false)

  // Study session
  useEffect(() => {
    if (activeLesson && activeEnrollment) startStudySession(activeLesson.id)
    return () => { endStudySession() }
  }, [activeLesson?.id]) // eslint-disable-line

  // Read progress via scroll
  useEffect(() => {
    const el = document.getElementById('pf-lesson-body')
    if (!el) return
    const handler = () => {
      const pct = Math.round(((el.scrollTop + el.clientHeight) / el.scrollHeight) * 100)
      setReadPct(prev => Math.max(prev, Math.min(pct, 100)))
    }
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [activeLesson?.id])

  // Check PHAK PDF once
  useEffect(() => {
    if (phakChecked.current) return
    phakChecked.current = true
    const t = localStorage.getItem('access_token') ?? ''
    setPhakToken(t)
    if (!t) return
    fetch(`/api/pilotfaa/faa/pdf/PHAK/?token=${t}`, { method: 'HEAD' })
      .then(r => { if (r.ok) setPhakReady(true) })
      .catch(() => {})
  }, [])

  async function markProgress(field: 'watch_pct' | 'read_pct', value: number) {
    if (!activeEnrollment) return
    await progressApi.updateCompletion(activeEnrollment.id, {
      lesson_id: activeLesson!.id, [field]: value,
    })
  }

  async function handleComplete() {
    await markProgress('read_pct', 100)
    setCompleted(true)
  }

  function goToQuiz() {
    if (activeChapterId) openChapter(activeChapterId)
    setTimeout(() => setActiveView('quiz'), 50)
  }

  if (loadingLesson) return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', alignItems: 'center', justifyContent: 'center', color: 'var(--pf-ink-dim)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>📖</div>
        Loading lesson…
      </div>
    </div>
  )

  if (!activeLesson) return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📖</div>
        <div style={{ color: 'var(--pf-ink-dim)', marginBottom: 16 }}>Select a lesson to begin.</div>
        <button className="pf-btn-primary" onClick={() => setActiveView('dashboard')}>← Dashboard</button>
      </div>
    </div>
  )

  const content      = activeLesson.content
  const video        = activeLesson.active_video
  const hasVideo     = !!video?.video_url
  // Privileged = has active video AND a second tutor video would exist
  // For now we treat any lesson with content as potentially dual-video
  const isPrivileged = false // TODO: wire to user.account_type === 'cfi' | 'privileged'
  const chapterNum   = activeChapterData?.chapter_number ?? 1
  const phakChapter  = PHAK_CHAPTERS.find(c => c.num === chapterNum) ?? PHAK_CHAPTERS[0]
  const phakSrc      = phakReady ? `/api/pilotfaa/faa/pdf/PHAK/?token=${phakToken}#page=${phakChapter.pdfPage}` : null
  const chapterBank  = quizBanks.find(b => b.chapter === activeChapterData?.id)

  // Callout color map
  const calloutStyle: Record<string, { bg: string; border: string; icon: string }> = {
    warning: { bg: '#fff8e6', border: '#f59e0b', icon: '⚠️' },
    danger:  { bg: '#fff0f0', border: '#dc2626', icon: '🚫' },
    tip:     { bg: '#f0fdf4', border: '#16a34a', icon: '💡' },
    info:    { bg: 'var(--pf-cobalt-lt)', border: 'var(--pf-cobalt)', icon: 'ℹ️' },
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden', position: 'relative' }}>

      {/* ── Main lesson body ──────────────────────────────────────────────── */}
      <div
        id="pf-lesson-body"
        style={{
          flex: 1, overflowY: 'auto', padding: '28px 36px',
          transition: 'margin-right 0.3s ease',
        }}
      >
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
        <div style={{ marginBottom: 20, maxWidth: 860 }}>
          <div style={{ fontSize: 11, color: 'var(--pf-ink-dim)', fontFamily: 'monospace', marginBottom: 6, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
            Lesson {activeLesson.lesson_number}
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, color: 'var(--pf-ink)', marginBottom: 12, lineHeight: 1.25, margin: '0 0 12px' }}>
            {activeLesson.title}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="pf-tag pf-tag-blue">{activeLesson.type.replace(/_/g, ' + ').toUpperCase()}</span>
            {activeLesson.duration_minutes && <span className="pf-tag pf-tag-gold">⏱ {activeLesson.duration_minutes} min</span>}
            {activeLesson.is_preview && <span className="pf-tag pf-tag-green">Free Preview</span>}
            {activeLesson.acs_mappings?.slice(0, 3).map(m => (
              <span key={m.id} className="pf-tag pf-tag-green">{m.acs_task_code}</span>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 860 }}>

          {/* ── Video section ─────────────────────────────────────────────── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isPrivileged ? '1fr 1fr' : '1fr',
            gap: 12,
            marginBottom: 0,
          }}>
            {/* AI lesson video */}
            {hasVideo ? (
              <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '16/9', background: '#000' }}>
                <video src={video!.video_url} controls style={{ width: '100%', height: '100%' }}
                  onEnded={() => markProgress('watch_pct', 100)}
                  onTimeUpdate={e => {
                    const v = e.currentTarget
                    const pct = Math.round((v.currentTime / v.duration) * 100)
                    if (pct > 0 && pct % 20 === 0) markProgress('watch_pct', pct)
                  }} />
              </div>
            ) : (
              <div style={{
                borderRadius: 12, aspectRatio: '16/9',
                background: 'linear-gradient(130deg,#0F1F3A,#1756C8)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 10,
              }}>
                <div style={{ fontSize: 40, opacity: 0.35 }}>▶</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Video Coming Soon</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', textAlign: 'center', maxWidth: 260, lineHeight: 1.6 }}>
                  AI-generated lesson video in production.<br />Read the lesson text below.
                </div>
                {content?.source_page_ref && (
                  <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.07)', padding: '4px 12px', borderRadius: 20, marginTop: 4 }}>
                    📄 PHAK {content.source_page_ref}
                  </div>
                )}
              </div>
            )}

            {/* CFI / Tutor video — privileged accounts only */}
            {isPrivileged && (
              <div style={{
                borderRadius: 12, aspectRatio: '16/9',
                background: 'linear-gradient(130deg,#1a1a2e,#2d1b69)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 10, border: '1px solid rgba(138,43,226,0.3)',
              }}>
                <div style={{ fontSize: 40, opacity: 0.35 }}>👨‍✈️</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>CFI Session</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 220, lineHeight: 1.6 }}>
                  Live or recorded instructor session will appear here.
                </div>
              </div>
            )}
          </div>

          {/* ── Divider line under video ──────────────────────────────────── */}
          <div style={{ height: 1, background: 'var(--pf-rule)', margin: '20px 0' }} />

          {/* ── "In this lesson" summary bar ─────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            fontSize: 12.5, color: 'var(--pf-ink-dim)',
            marginBottom: 20, paddingBottom: 16,
            borderBottom: '1px solid var(--pf-rule-light)',
          }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--pf-ink-dim)', marginRight: 4 }}>
              IN THIS LESSON
            </span>
            {hasVideo && <span>▶ AI Video ({activeLesson.duration_minutes}m)</span>}
            {!hasVideo && <span style={{ opacity: 0.5 }}>▶ Video coming soon</span>}
            {isPrivileged && <span>👨‍✈️ CFI Video</span>}
            {content?.teaching_text && <span>📝 Lesson text</span>}
            {(content?.callouts?.length ?? 0) > 0 && <span>⚠️ {content!.callouts.length} callout{content!.callouts.length > 1 ? 's' : ''}</span>}
            {(content?.key_terms?.length ?? 0) > 0 && <span>📚 {content!.key_terms.length} key terms</span>}
            {chapterBank && <span>✏️ {chapterBank.question_count} quiz questions</span>}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Read</span>
              <div style={{ width: 80, height: 4, background: 'var(--pf-rule)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${readPct}%`, background: 'var(--pf-cobalt)', borderRadius: 2, transition: 'width 0.3s' }} />
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{readPct}%</span>
            </div>
          </div>

          {/* ── Teaching text ─────────────────────────────────────────────── */}
          {content?.teaching_text && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, color: 'var(--pf-ink-dim)', fontFamily: 'monospace', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 14 }}>
                Lesson Content
              </div>
              <div style={{ fontSize: 15.5, color: 'var(--pf-ink-mid)', lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>
                {content.teaching_text}
              </div>
            </div>
          )}

          {/* ── Callouts ──────────────────────────────────────────────────── */}
          {content?.callouts?.map((c: any, i: number) => {
            const cs = calloutStyle[c.variant] ?? calloutStyle.info
            return (
              <div key={i} style={{
                background: cs.bg, border: `1px solid ${cs.border}`,
                borderLeft: `4px solid ${cs.border}`,
                borderRadius: 8, padding: '14px 18px', marginBottom: 16,
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{cs.icon} {c.label}</div>
                <div style={{ fontSize: 14, color: 'var(--pf-ink-mid)', lineHeight: 1.7 }}>{c.body}</div>
              </div>
            )
          })}

          {/* ── Key Terms ─────────────────────────────────────────────────── */}
          {content?.key_terms && content.key_terms.length > 0 && (
            <div className="pf-card pf-card-p" style={{ marginBottom: 24 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📚 Key Terms</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {content.key_terms.map((t: any, i: number) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16,
                    paddingBottom: 12,
                    borderBottom: i < content.key_terms.length - 1 ? '1px solid var(--pf-rule-light)' : 'none',
                  }}>
                    <div style={{ fontWeight: 700, color: 'var(--pf-cobalt)', fontFamily: 'monospace', fontSize: 13, paddingTop: 2 }}>
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

          {/* ── FAA Source citation ───────────────────────────────────────── */}
          {(content?.source_page_ref || content?.source_section_ref) && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'var(--pf-sky)', border: '1px solid var(--pf-rule)',
              borderRadius: 8, padding: '12px 16px', marginBottom: 28,
            }}>
              <span style={{ fontSize: 18 }}>📄</span>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--pf-ink)', fontSize: 13, marginBottom: 2 }}>FAA Source</div>
                <div style={{ fontFamily: 'monospace', color: 'var(--pf-ink-dim)', fontSize: 11.5 }}>
                  PHAK FAA-H-8083-25C
                  {content.source_page_ref && ` · ${content.source_page_ref}`}
                  {content.source_section_ref && ` · ${content.source_section_ref}`}
                </div>
              </div>
              <a href="https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak"
                target="_blank" rel="noopener noreferrer"
                style={{ marginLeft: 'auto', color: 'var(--pf-cobalt)', fontSize: 12, textDecoration: 'none', fontWeight: 600 }}>
                FAA.gov →
              </a>
            </div>
          )}

          {/* ── Lesson complete / quiz CTA ────────────────────────────────── */}
          {!completed ? (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: 8, marginBottom: 48 }}>
              <button className="pf-btn-outline"
                onClick={() => activeChapterId ? openChapter(activeChapterId) : setActiveView('dashboard')}>
                ← Back to Chapter
              </button>
              <button className="pf-btn-primary" style={{ marginLeft: 'auto' }} onClick={handleComplete}>
                Mark Complete & Continue →
              </button>
            </div>
          ) : (
            /* Post-completion CTA */
            <div style={{
              background: 'var(--pf-cobalt-lt)', border: '1px solid var(--pf-cobalt)',
              borderRadius: 12, padding: '24px 28px', marginBottom: 48,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--pf-cobalt)', marginBottom: 4 }}>
                  ✓ Lesson Complete
                </div>
                <div style={{ fontSize: 13, color: 'var(--pf-ink-mid)' }}>
                  {chapterBank
                    ? `Ready to test your knowledge? Take the Chapter ${activeChapterData?.chapter_number} quiz.`
                    : 'Move on to the next lesson or return to the chapter.'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="pf-btn-outline"
                  onClick={() => activeChapterId ? openChapter(activeChapterId) : setActiveView('dashboard')}>
                  ← Back to Chapter
                </button>
                {chapterBank && (
                  <button className="pf-btn-primary" onClick={goToQuiz}>
                    ✏️ Take Chapter Quiz →
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Right tab strip ───────────────────────────────────────────────── */}
      <div style={{
        width: 40, flexShrink: 0,
        background: 'var(--pf-white)',
        borderLeft: '1px solid var(--pf-rule)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        paddingTop: 16, gap: 8, zIndex: 10,
      }}>
        {/* PHAK tab */}
        <button
          onClick={() => setPaneOpen(p => p === 'phak' ? null : 'phak')}
          title="PHAK Reference"
          style={{
            width: 32, height: 64, borderRadius: 6, border: 'none', cursor: 'pointer',
            background: paneOpen === 'phak' ? 'var(--pf-cobalt)' : 'var(--pf-sky)',
            color: paneOpen === 'phak' ? '#fff' : 'var(--pf-ink-dim)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2, fontSize: 16,
            transition: 'all 0.2s',
          }}
        >
          <span>📖</span>
          <span style={{ fontSize: 7, fontFamily: 'monospace', letterSpacing: '0.5px', fontWeight: 700 }}>PHAK</span>
        </button>

        {/* ACS tab */}
        <button
          onClick={() => setPaneOpen(p => p === 'acs' ? null : 'acs')}
          title="ACS Standards"
          style={{
            width: 32, height: 64, borderRadius: 6, border: 'none', cursor: 'pointer',
            background: paneOpen === 'acs' ? 'var(--pf-cobalt)' : 'var(--pf-sky)',
            color: paneOpen === 'acs' ? '#fff' : 'var(--pf-ink-dim)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 2, fontSize: 16,
            transition: 'all 0.2s',
          }}
        >
          <span>🎯</span>
          <span style={{ fontSize: 7, fontFamily: 'monospace', letterSpacing: '0.5px', fontWeight: 700 }}>ACS</span>
        </button>
      </div>

      {/* ── Slide-in reference pane ───────────────────────────────────────── */}
      {paneOpen && (
        <div style={{
          position: 'absolute', top: 0, right: 40, bottom: 0,
          width: '50%', minWidth: 400,
          background: 'var(--pf-white)',
          borderLeft: '1px solid var(--pf-rule)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(15,31,58,0.12)',
          zIndex: 20,
          animation: 'pfSlideInRight 0.25s ease',
        }}>

          {/* Pane header */}
          <div style={{
            padding: '14px 16px', borderBottom: '1px solid var(--pf-rule)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--pf-sky)', flexShrink: 0,
          }}>
            <span style={{ fontSize: 18 }}>{paneOpen === 'phak' ? '📖' : '🎯'}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pf-ink)' }}>
                {paneOpen === 'phak' ? 'PHAK Reference' : 'ACS Standards'}
              </div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--pf-ink-dim)', marginTop: 1 }}>
                {paneOpen === 'phak'
                  ? `Ch.${phakChapter.num} — ${phakChapter.title} · FAA-H-8083-25C`
                  : 'FAA-S-ACS-6C · Private Pilot'}
              </div>
            </div>
            <button onClick={() => setPaneOpen(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-ink-dim)', fontSize: 20, padding: '0 4px', lineHeight: 1 }}>
              ×
            </button>
          </div>

          {/* PHAK pane content */}
          {paneOpen === 'phak' && (
            <>
              {/* Chapter pills */}
              <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--pf-rule-light)', display: 'flex', gap: 5, flexWrap: 'wrap', flexShrink: 0 }}>
                {PHAK_CHAPTERS.map(ch => (
                  <a key={ch.num}
                    href={phakReady ? `/api/pilotfaa/faa/pdf/PHAK/?token=${phakToken}#page=${ch.pdfPage}` : '#'}
                    target={phakReady ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    style={{
                      padding: '3px 8px', borderRadius: 20, fontSize: 11,
                      fontFamily: 'monospace', fontWeight: 600, textDecoration: 'none',
                      background: ch.num === chapterNum ? 'var(--pf-cobalt)' : 'var(--pf-sky)',
                      color: ch.num === chapterNum ? '#fff' : 'var(--pf-ink-dim)',
                      border: ch.num === chapterNum ? 'none' : '1px solid var(--pf-rule)',
                    }}
                    title={`Ch.${ch.num} — ${ch.title}`}
                  >
                    {ch.num}
                  </a>
                ))}
              </div>

              {/* PDF or not-uploaded state */}
              {phakSrc ? (
                <iframe
                  key={phakSrc}
                  src={phakSrc}
                  style={{ flex: 1, border: 'none', background: '#525659' }}
                  title={`PHAK Ch.${phakChapter.num}`}
                />
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: 'var(--pf-ink-dim)', padding: 32, textAlign: 'center' }}>
                  <div style={{ fontSize: 36 }}>📄</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--pf-ink)' }}>PHAK PDF not uploaded</div>
                  <div style={{ fontSize: 12, lineHeight: 1.7 }}>
                    Run <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>python upload_pdf.py PHAK phak.pdf</code> in your backend folder.
                  </div>
                </div>
              )}
            </>
          )}

          {/* ACS pane content */}
          {paneOpen === 'acs' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
              {activeLesson.acs_mappings && activeLesson.acs_mappings.length > 0 ? (
                <>
                  <div style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--pf-ink-dim)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 14 }}>
                    ACS Tasks covered in this lesson
                  </div>
                  {activeLesson.acs_mappings.map((m: any) => (
                    <div key={m.id} className="pf-card pf-card-p" style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                        <span className="pf-tag pf-tag-blue">{m.acs_task_code}</span>
                        <span className="pf-tag pf-tag-gold">{m.knowledge_type}</span>
                      </div>
                      {m.knowledge_ref && (
                        <div style={{ fontSize: 13, color: 'var(--pf-ink-mid)', lineHeight: 1.6 }}>{m.knowledge_ref}</div>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--pf-ink-dim)', padding: '48px 20px' }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🎯</div>
                  <div style={{ fontSize: 13 }}>No ACS task mappings for this lesson yet.</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
