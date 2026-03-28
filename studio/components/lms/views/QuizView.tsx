'use client'

import { useState, useEffect } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { quizApi, type Question, type QuizAttempt, type AnswerResult } from '@/lib/api/pilotfaa'

export default function QuizView() {
  const { quizBanks, activeEnrollment, setActiveAttempt: setCtxAttempt } = usePilotFAA()

  const [phase, setPhase] = useState<'select' | 'quiz' | 'results'>('select')
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null)
  const [questions,      setQuestions]       = useState<Question[]>([])
  const [attempt,        setAttempt]         = useState<QuizAttempt | null>(null)
  const [currentIdx,     setCurrentIdx]      = useState(0)
  const [answerResult,   setAnswerResult]    = useState<AnswerResult | null>(null)
  const [answered,       setAnswered]        = useState(false)
  const [secs,           setSecs]            = useState(0)
  const [qSecs,          setQSecs]           = useState(0)
  const [loading,        setLoading]         = useState(false)

  // Global timer
  useEffect(() => {
    if (phase !== 'quiz') return
    const t = setInterval(() => setSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  async function startQuiz(bankId: number) {
    if (!activeEnrollment) return
    setLoading(true)
    try {
      const [qs, att] = await Promise.all([
        quizApi.getBankQuestions(bankId),
        quizApi.startAttempt({
          bank_id:       bankId,
          enrollment_id: activeEnrollment.id,
          attempt_type:  'chapter_quiz',
        }),
      ])
      setQuestions(qs)
      setAttempt(att)
      setCtxAttempt(att)
      setCurrentIdx(0)
      setAnswered(false)
      setAnswerResult(null)
      setSecs(0)
      setQSecs(0)
      setPhase('quiz')
    } finally {
      setLoading(false)
    }
  }

  async function submitAnswer(letter: string) {
    if (!attempt || answered || !questions[currentIdx]) return
    setAnswered(true)
    const result = await quizApi.submitResponse(attempt.id, {
      question_id:     questions[currentIdx].id,
      selected_letter: letter,
      time_seconds:    qSecs,
    })
    setAnswerResult(result)
    // Refresh attempt
    const history = await quizApi.getHistory()
    const updated = history.find(a => a.id === attempt.id)
    if (updated) { setAttempt(updated); setCtxAttempt(updated) }
  }

  async function nextQuestion() {
    if (currentIdx >= questions.length - 1) {
      // Finalize
      if (attempt) {
        const final = await quizApi.completeAttempt(attempt.id, secs)
        setAttempt(final)
        setCtxAttempt(final)
      }
      setPhase('results')
    } else {
      setCurrentIdx(i => i + 1)
      setAnswered(false)
      setAnswerResult(null)
      setQSecs(0)
    }
  }

  // ── Bank selector ──────────────────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="pf-view-pad">
        <div className="pf-section-heading">Available Quizzes</div>
        {!activeEnrollment && (
          <div style={{ color: 'var(--pf-ink-dim)', padding: '24px 0' }}>
            Enroll in a course first to access quizzes.
          </div>
        )}
        <div className="pf-grid-3">
          {quizBanks.map(bank => (
            <div key={bank.id} className="pf-card pf-card-p" style={{ cursor: 'pointer' }}>
              <span className={`pf-tag pf-tag-${bank.bank_type === 'chapter' ? 'blue' : bank.bank_type === 'mock_exam' ? 'gold' : 'red'}`}
                    style={{ marginBottom: 8, display: 'inline-block' }}>
                {bank.bank_type.replace('_', ' ').toUpperCase()}
              </span>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 3 }}>{bank.name}</div>
              <div style={{ fontSize: 12, color: 'var(--pf-ink-dim)', marginBottom: 12 }}>
                {bank.question_count} questions
                {bank.time_limit_seconds && ` · ${Math.round(bank.time_limit_seconds / 60)} min`}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--pf-ink-dim)' }}>
                  Pass: {bank.pass_threshold_pct}%
                </span>
                <button
                  className="pf-btn-primary"
                  style={{ fontSize: 11, padding: '5px 12px' }}
                  disabled={loading || !activeEnrollment}
                  onClick={() => startQuiz(bank.id)}
                >
                  {loading ? '…' : 'Start'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── Results ────────────────────────────────────────────────────────────────
  if (phase === 'results' && attempt) {
    return (
      <div className="pf-view-pad">
        <div style={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>
            {attempt.passed ? '🎉' : '📚'}
          </div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 28, marginBottom: 8 }}>
            {attempt.passed ? 'Quiz Passed!' : 'Keep Studying'}
          </div>
          <div style={{ fontSize: 48, fontWeight: 700, color: attempt.passed ? 'var(--pf-green)' : 'var(--pf-amber)', marginBottom: 8 }}>
            {attempt.score_pct}%
          </div>
          <div style={{ fontSize: 14, color: 'var(--pf-ink-dim)', marginBottom: 32 }}>
            {attempt.correct_count} of {attempt.total_questions} correct
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button className="pf-btn-primary" onClick={() => setPhase('select')}>
              Back to Quizzes
            </button>
            {!attempt.passed && (
              <button className="pf-btn-outline" onClick={() => attempt && startQuiz(attempt.bank)}>
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── Active question ────────────────────────────────────────────────────────
  const question = questions[currentIdx]
  if (!question) return null
  const m = Math.floor(secs / 60), s = String(secs % 60).padStart(2, '0')

  return (
    <div className="pf-view-pad">
      <div className="pf-quiz-wrap">
        {/* Progress bar */}
        <div className="pf-quiz-topbar">
          <span className="pf-mono" style={{ fontSize: 12, color: 'var(--pf-ink-dim)' }}>
            {attempt?.bank_name}
          </span>
          <div className="pf-quiz-segs">
            {questions.map((_, i) => (
              <div key={i} className={`pf-seg${i < currentIdx ? ' done' : i === currentIdx ? ' curr' : ''}`} />
            ))}
          </div>
          <div className="pf-quiz-timer">{m}:{s}</div>
        </div>

        {/* Question card */}
        <div className="pf-q-card">
          <div className="pf-q-meta">
            <div className="pf-q-num">
              Question {currentIdx + 1} of {questions.length}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {question.acs_task_code && (
                <span className="pf-tag pf-tag-blue">{question.acs_task_code}</span>
              )}
              <span className={`pf-tag pf-tag-${question.difficulty === 'easy' ? 'green' : question.difficulty === 'hard' ? 'red' : 'amber'}`}>
                {question.difficulty.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="pf-q-text">{question.question_text}</div>

          <div className="pf-answer-opts">
            {question.options.map(opt => {
              let cls = ''
              if (answered && answerResult) {
                if (opt.letter === answerResult.correct_letter) cls = ' correct'
                else if (opt.letter !== answerResult.correct_letter && opt.is_correct === false && answerResult && !answerResult.is_correct) cls = ' incorrect'
              }
              return (
                <div
                  key={opt.letter}
                  className={`pf-ans-opt${cls}`}
                  onClick={() => !answered && submitAnswer(opt.letter)}
                  style={{ pointerEvents: answered ? 'none' : 'auto' }}
                >
                  <div className="pf-opt-ltr">{opt.letter}</div>
                  <div>{opt.text}</div>
                </div>
              )
            })}
          </div>

          {/* Rationale */}
          {answered && answerResult && (
            <div className="pf-rationale show">
              <div className="pf-rat-lbl">
                {answerResult.is_correct ? '✓ Correct' : '✗ Incorrect'} — Explanation
              </div>
              {answerResult.rationale}
              <div className="pf-rat-cite">{answerResult.rationale_source_ref}</div>
            </div>
          )}
        </div>

        <div className="pf-quiz-nav">
          <button className="pf-btn-outline" onClick={() => setPhase('select')}>
            ← Exit Quiz
          </button>
          <span style={{ fontSize: 12, color: 'var(--pf-ink-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
            {attempt?.correct_count ?? 0} correct
          </span>
          <button
            className="pf-btn-primary"
            onClick={nextQuestion}
            disabled={!answered}
          >
            {currentIdx >= questions.length - 1 ? 'Finish →' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}
