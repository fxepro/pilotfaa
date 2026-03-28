'use client'

import { useState, useRef, useEffect } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { tutorApi } from '@/lib/api/pilotfaa'

const QUICK_CHIPS = [
  'Explain simpler',
  'Give me an exam question',
  'Summarize this chapter',
  'Quiz me on this topic',
  'Compare these concepts',
]

export default function TutorView() {
  const {
    tutorSession, tutorMessages, tutorLoading,
    startTutorSession, askTutor,
    weakTopics, setActiveView,
  } = usePilotFAA()

  const [inputVal, setInputVal] = useState('')
  const msgsEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to latest message
  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [tutorMessages])

  // Start a session if none exists
  useEffect(() => {
    if (!tutorSession) {
      startTutorSession()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function send(text?: string) {
    const msg = (text ?? inputVal).trim()
    if (!msg || tutorLoading) return
    setInputVal('')
    await askTutor(msg)
  }

  async function handleFeedback(messageId: number, rating: 'helpful' | 'not_helpful') {
    try {
      await tutorApi.submitFeedback(messageId, rating)
    } catch {
      // non-fatal
    }
  }

  return (
    <div className="pf-view-pad" style={{ paddingBottom: 0 }}>
      <div className="pf-tutor-grid">

        {/* Chat pane */}
        <div className="pf-chat-pane">
          {/* Header */}
          <div className="pf-chat-hdr">
            <div className="pf-tutor-av">🧑‍✈️</div>
            <div style={{ flex: 1 }}>
              <div className="pf-tutor-name">Captain FAA — AI Ground Instructor</div>
              <div className="pf-tutor-status">
                <span className="pf-status-dot" />
                {tutorSession ? 'Online · Grounded to PHAK & FAR/AIM' : 'Starting session…'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="pf-chat-msgs">
            {tutorMessages.length === 0 && !tutorLoading && (
              <div className="pf-msg">
                <div className="pf-msg-av pf-ai-av">🧑‍✈️</div>
                <div className="pf-msg-bbl">
                  <strong>Welcome to your FAA ground training session.</strong>{' '}
                  I answer only from official FAA materials — PHAK, FAR/AIM, and the Private Pilot ACS.
                  All answers include source citations.
                  <div className="pf-msg-cite">
                    📄 Session: PHAK FAA-H-8083-25C · ACS-6C · 14 CFR Parts 61 &amp; 91
                  </div>
                </div>
              </div>
            )}

            {tutorMessages.map(msg => (
              <div
                key={msg.id}
                className={`pf-msg${msg.role === 'user' ? ' pf-user' : ''}`}
              >
                <div className={`pf-msg-av ${msg.role === 'assistant' ? 'pf-ai-av' : 'pf-user-av'}`}>
                  {msg.role === 'assistant' ? '🧑‍✈️' : 'AJ'}
                </div>
                <div className="pf-msg-bbl">
                  <span dangerouslySetInnerHTML={{ __html: msg.content }} />
                  {msg.citations?.length > 0 && (
                    <div className="pf-msg-cite">
                      {msg.citations.map((c, i) => (
                        <span key={i}>
                          📄 {c.source_doc_ref}
                          {c.chapter_ref && ` · ${c.chapter_ref}`}
                          {c.page_ref    && ` · ${c.page_ref}`}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Feedback buttons for AI messages */}
                  {msg.role === 'assistant' && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleFeedback(msg.id, 'helpful')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--pf-green)' }}
                        title="Helpful"
                      >👍</button>
                      <button
                        onClick={() => handleFeedback(msg.id, 'not_helpful')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--pf-ink-dim)' }}
                        title="Not helpful"
                      >👎</button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {tutorLoading && (
              <div className="pf-msg">
                <div className="pf-msg-av pf-ai-av">🧑‍✈️</div>
                <div className="pf-msg-bbl" style={{ color: 'var(--pf-ink-dim)', fontStyle: 'italic' }}>
                  Researching FAA materials…
                </div>
              </div>
            )}
            <div ref={msgsEndRef} />
          </div>

          {/* Input */}
          <div className="pf-chat-input-zone">
            <div className="pf-quick-chips">
              {QUICK_CHIPS.map(chip => (
                <div key={chip} className="pf-qchip" onClick={() => send(chip)}>
                  {chip}
                </div>
              ))}
            </div>
            <div className="pf-chat-row">
              <input
                className="pf-chat-input-box"
                placeholder="Ask any aviation concept…"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                disabled={tutorLoading || !tutorSession}
              />
              <button
                className="pf-btn-send"
                onClick={() => send()}
                disabled={tutorLoading || !tutorSession}
              >
                ↑
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto' }}>
          {/* Knowledge base */}
          <div className="pf-panel-block">
            <div className="pf-pb-hdr"><div className="pf-pb-title">Knowledge Base</div></div>
            <div style={{ padding: 12 }}>
              {['PHAK FAA-H-8083-25C', 'Private Pilot ACS-6C', '14 CFR Part 61 & 91', 'AIM 2024'].map(kb => (
                <div key={kb} style={{ display: 'flex', gap: 7, fontSize: 12.5, color: 'var(--pf-ink-mid)', marginBottom: 6 }}>
                  <span style={{ color: 'var(--pf-green)' }}>●</span> {kb}
                </div>
              ))}
            </div>
          </div>

          {/* Weak topics */}
          {weakTopics.length > 0 && (
            <div className="pf-panel-block">
              <div className="pf-pb-hdr"><div className="pf-pb-title">Weak Topics</div></div>
              <div style={{ padding: 12 }}>
                {weakTopics.slice(0, 5).map(wt => (
                  <div key={wt.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                    <span style={{ color: 'var(--pf-ink-mid)' }}>{wt.chapter_title}</span>
                    <span className="pf-tag pf-tag-red">{wt.mastery_pct}%</span>
                  </div>
                ))}
                <button
                  className="pf-btn-outline"
                  style={{ width: '100%', fontSize: 12, marginTop: 4 }}
                  onClick={() => setActiveView('quiz')}
                >
                  Study weak areas →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
