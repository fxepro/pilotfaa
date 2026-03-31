'use client'

import { useState } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { quizApi, type Question, type QuizAttempt } from '@/lib/api/pilotfaa'

export default function ChapterView() {
  const {
    activeChapterData,
    openLesson,
    setActiveView,
    quizBanks,
    activeEnrollment,
    activeCourse,
    activeChapterId,
  } = usePilotFAA()

  // Quiz state — embedded inline
  const [quizPhase,    setQuizPhase]    = useState<'idle' | 'loading' | 'active' | 'results'>('idle')
  const [questions,    setQuestions]    = useState<Question[]>([])
  const [attempt,      setAttempt]      = useState<QuizAttempt | null>(null)
  const [currentIdx,   setCurrentIdx]   = useState(0)
  const [selected,     setSelected]     = useState<string | null>(null)
  const [revealed,     setRevealed]     = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [secs,         setSecs]         = useState(0)

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
  const question     = questions[currentIdx]
  const isLast       = currentIdx === questions.length - 1

  async function startQuiz() {
    if (!activeEnrollment || !chapterBank) return
    setQuizPhase('loading')
    try {
      const [qs, att] = await Promise.all([
        quizApi.getBankQuestions(chapterBank.id),
        quizApi.startAttempt({
          bank_id:       chapterBank.id,
          enrollment_id: activeEnrollment.id,
          attempt_type:  'chapter_quiz',
        }),
      ])
      setQuestions(qs)
      setAttempt(att)
      setCurrentIdx(0)
      setSelected(null)
      setRevealed(false)
      setCorrectCount(0)
      setSecs(0)
      setQuizPhase('active')
    } catch {
      setQuizPhase('idle')
    }
  }

  async function handleSelect(letter: string) {
    if (revealed || !attempt || !question) return
    setSelected(letter)
    setRevealed(true)
    const isCorrect = letter === question.correct_letter
    if (isCorrect) setCorrectCount(c => c + 1)
    await quizApi.submitResponse(attempt.id, {
      question_id:     question.id,
      selected_letter: letter,
      time_seconds:    secs,
    })
  }

  async function handleNext() {
    if (isLast) {
      if (attempt) await quizApi.completeAttempt(attempt.id, secs)
      setQuizPhase('results')
    } else {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setRevealed(false)
    }
  }

  const scorePct   = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0
  const passed     = scorePct >= (chapterBank?.pass_threshold_pct ?? 70)

  // Option styling
  function optionStyle(letter: string) {
    const base: React.CSSProperties = {
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '13px 16px', borderRadius: 8, marginBottom: 8,
      border: '1.5px solid var(--pf-rule)', cursor: revealed ? 'default' : 'pointer',
      transition: 'all 0.15s', fontSize: 14,
    }
    if (!revealed) return { ...base, background: selected === letter ? 'var(--pf-cobalt-lt)' : '#fff' }
    if (letter === question?.correct_letter) return { ...base, background: '#f0fdf4', border: '1.5px solid #16a34a', color: '#15803d' }
    if (letter === selected && letter !== question?.correct_letter) return { ...base, background: '#fff0f0', border: '1.5px solid #dc2626', color: '#dc2626' }
    return { ...base, background: '#fff', opacity: 0.5 }
  }

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
      <div className="pf-card pf-card-p" style={{ marginBottom: 32, background: 'linear-gradient(130deg,#0F1F3A,#1756C8)', color: '#fff', border: 'none' }}>
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

      {/* ── Lessons ─────────────────────────────────────────────────── */}
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
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--pf-sky)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 9,
                  background: 'var(--pf-cobalt-lt)', color: 'var(--pf-cobalt)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'monospace', fontSize: 11, fontWeight: 700, flexShrink: 0,
                }}>
                  {lesson.lesson_number}
                </div>
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
                <div style={{ color: 'var(--pf-ink-dim)', fontSize: 18 }}>›</div>
              </div>
            ))
          )}
        </div>

      {/* ── Quiz section ─────────────────────────────────────────────── */}
      {chapterBank && activeEnrollment && (
        <div style={{ marginTop: 32 }}>

          {/* Quiz header — always visible */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px',
            background: 'var(--pf-cobalt-lt)',
            border: '1.5px solid var(--pf-cobalt)',
            borderBottom: quizPhase !== 'idle' ? '1px solid var(--pf-rule)' : '1.5px solid var(--pf-cobalt)',
            borderRadius: quizPhase === 'idle' ? 12 : '12px 12px 0 0',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--pf-cobalt)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, flexShrink: 0,
            }}>✏️</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--pf-ink)' }}>
                Q{activeChapterData.chapter_number} — Chapter {activeChapterData.chapter_number} Quiz
              </div>
              <div style={{ fontSize: 12, color: 'var(--pf-ink-dim)', marginTop: 2 }}>
                {chapterBank.question_count} questions · Pass at {chapterBank.pass_threshold_pct}%
              </div>
            </div>
            {quizPhase === 'idle' && (
              <button className="pf-btn-primary" onClick={startQuiz}>
                Start Quiz →
              </button>
            )}
            {quizPhase === 'loading' && (
              <span style={{ fontSize: 13, color: 'var(--pf-ink-dim)' }}>Loading…</span>
            )}
            {quizPhase === 'active' && (
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--pf-ink-dim)' }}>
                {currentIdx + 1} / {questions.length}
              </span>
            )}
            {quizPhase === 'results' && (
              <span style={{
                fontWeight: 700, fontSize: 14,
                color: passed ? '#16a34a' : '#dc2626',
              }}>
                {scorePct}% — {passed ? 'Passed ✓' : 'Try again'}
              </span>
            )}
          </div>

          {/* ── Active quiz ──────────────────────────────────────────── */}
          {quizPhase === 'active' && question && (
            <div style={{
              border: '1.5px solid var(--pf-cobalt)', borderTop: 'none',
              borderRadius: '0 0 12px 12px', padding: 24, background: '#fff',
            }}>
              {/* Progress bar */}
              <div style={{ height: 4, background: 'var(--pf-rule)', borderRadius: 2, marginBottom: 20, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: 'var(--pf-cobalt)',
                  width: `${((currentIdx + 1) / questions.length) * 100}%`,
                  transition: 'width 0.3s',
                }} />
              </div>

              {/* Question */}
              <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--pf-ink)', lineHeight: 1.6, marginBottom: 20 }}>
                {question.question_text}
              </div>

              {/* Options */}
              <div style={{ marginBottom: 20 }}>
                {question.options.map((opt: any) => (
                  <div key={opt.letter} onClick={() => handleSelect(opt.letter)} style={optionStyle(opt.letter)}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      background: revealed && opt.letter === question.correct_letter
                        ? '#16a34a'
                        : revealed && opt.letter === selected && opt.letter !== question.correct_letter
                          ? '#dc2626'
                          : 'var(--pf-sky)',
                      color: revealed && (opt.letter === question.correct_letter || opt.letter === selected)
                        ? '#fff' : 'var(--pf-ink)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: 12, fontFamily: 'monospace',
                      transition: 'all 0.15s',
                    }}>
                      {opt.letter}
                    </div>
                    <span style={{ paddingTop: 3 }}>{opt.text}</span>
                  </div>
                ))}
              </div>

              {/* Rationale */}
              {revealed && question.rationale && (
                <div style={{
                  background: selected === question.correct_letter ? '#f0fdf4' : '#fff8e6',
                  border: `1px solid ${selected === question.correct_letter ? '#16a34a' : '#f59e0b'}`,
                  borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: 13.5, lineHeight: 1.7,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    {selected === question.correct_letter ? '✓ Correct' : '✗ Incorrect'} — Explanation
                  </div>
                  <div style={{ color: 'var(--pf-ink-mid)' }}>{question.rationale}</div>
                  {question.rationale_source_ref && (
                    <div style={{ marginTop: 8, fontSize: 11, fontFamily: 'monospace', color: 'var(--pf-ink-dim)' }}>
                      📄 {question.rationale_source_ref}
                    </div>
                  )}
                </div>
              )}

              {revealed && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="pf-btn-primary" onClick={handleNext}>
                    {isLast ? 'See Results →' : 'Next Question →'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Results ──────────────────────────────────────────────── */}
          {quizPhase === 'results' && (
            <div style={{
              border: '1.5px solid var(--pf-cobalt)', borderTop: 'none',
              borderRadius: '0 0 12px 12px', padding: 32, background: '#fff',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>
                {passed ? '🎉' : '📚'}
              </div>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--pf-ink)' }}>
                {passed ? 'Chapter Quiz Passed!' : 'Keep Studying'}
              </div>
              <div style={{ fontSize: 44, fontWeight: 800, color: passed ? '#16a34a' : '#dc2626', marginBottom: 6 }}>
                {scorePct}%
              </div>
              <div style={{ fontSize: 14, color: 'var(--pf-ink-dim)', marginBottom: 28 }}>
                {correctCount} of {questions.length} correct · Need {chapterBank.pass_threshold_pct}% to pass
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                {!passed && (
                  <button className="pf-btn-outline" onClick={startQuiz}>
                    Retry Quiz
                  </button>
                )}
                {passed && (
                  <button className="pf-btn-primary" onClick={() => setActiveView('dashboard')}>
                    Back to Course →
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* No quiz available */}
      {!chapterBank && (
        <div style={{ marginTop: 32, padding: '20px 24px', background: 'var(--pf-sky)', borderRadius: 10, fontSize: 13, color: 'var(--pf-ink-dim)', textAlign: 'center' }}>
          Quiz for this chapter coming soon.
        </div>
      )}

    </div>
  )
}
