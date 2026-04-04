'use client'

import { useState, useEffect, useRef } from 'react'
import { useValidToken } from '@/hooks/useValidToken'
import { usePilotFAA } from '@/contexts/PilotFAAContext'

// Always use relative URLs for PDF — goes through Next.js proxy to avoid cross-origin iframe blocking

const CHAPTERS = [
  { num: 1,  title: 'Introduction to Flying',           pages: '1-1 to 1-18',   pdfPage: 13  },
  { num: 2,  title: 'Aeronautical Decision-Making',     pages: '2-1 to 2-30',   pdfPage: 31  },
  { num: 3,  title: 'Flight Instruments',               pages: '3-1 to 3-52',   pdfPage: 61  },
  { num: 4,  title: 'Aircraft Systems',                 pages: '4-1 to 4-50',   pdfPage: 113 },
  { num: 5,  title: 'Aerodynamics of Flight',           pages: '5-1 to 5-60',   pdfPage: 163 },
  { num: 6,  title: 'Flight Controls',                  pages: '6-1 to 6-30',   pdfPage: 223 },
  { num: 7,  title: 'Aircraft Performance',             pages: '7-1 to 7-40',   pdfPage: 253 },
  { num: 8,  title: 'Weight and Balance',               pages: '8-1 to 8-30',   pdfPage: 293 },
  { num: 9,  title: 'Flight Navigation',                pages: '9-1 to 9-60',   pdfPage: 323 },
  { num: 10, title: 'Aviation Weather',                 pages: '10-1 to 10-60', pdfPage: 383 },
  { num: 11, title: 'Aviation Weather Services',        pages: '11-1 to 11-50', pdfPage: 443 },
  { num: 12, title: 'Airport Operations',               pages: '12-1 to 12-40', pdfPage: 493 },
  { num: 13, title: 'Airspace',                         pages: '13-1 to 13-40', pdfPage: 533 },
  { num: 14, title: 'Air Traffic Control',              pages: '14-1 to 14-40', pdfPage: 573 },
  { num: 15, title: 'Emergency Procedures',             pages: '15-1 to 15-30', pdfPage: 613 },
  { num: 16, title: 'Night Operations',                 pages: '16-1 to 16-20', pdfPage: 643 },
  { num: 17, title: 'High-Altitude and Aeromedical',   pages: '17-1 to 17-30', pdfPage: 663 },
]

export default function PhakView() {
  const { activeCourse } = usePilotFAA()
  const [search,        setSearch]        = useState('')
  const [activeChapter, setActiveChapter] = useState(1)
  const [sidebarOpen,   setSidebarOpen]   = useState(true)
  const [pdfReady,      setPdfReady]      = useState(false)
  const [pdfError,      setPdfError]      = useState(false)

  const token = useValidToken()

  // Check PDF availability whenever we get a valid token
  useEffect(() => {
    if (!token) { setPdfReady(false); return }
    fetch(`/api/pilotfaa/faa/pdf/PHAK/?token=${token}`, { method: 'HEAD' })
      .then(r => { if (r.ok) setPdfReady(true); else setPdfError(true) })
      .catch(() => setPdfError(true))
  }, [token])

  const filtered = CHAPTERS.filter(ch =>
    search === '' ||
    ch.title.toLowerCase().includes(search.toLowerCase()) ||
    String(ch.num).includes(search)
  )

  const chapter = CHAPTERS.find(c => c.num === activeChapter) ?? CHAPTERS[0]

  // Build authenticated PDF URL — we pass the token as a query param
  // because iframes can't send custom headers
  const pdfSrc = pdfReady
    ? `/api/pilotfaa/faa/pdf/PHAK/?token=${token}#page=${chapter.pdfPage}`
    : null

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

      {/* ── Chapter index sidebar ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div style={{
          width: 260, flexShrink: 0,
          borderRight: '1px solid var(--pf-rule)',
          background: 'var(--pf-white)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--pf-rule-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--pf-ink)' }}>PHAK Reference</div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--pf-ink-dim)', marginTop: 2 }}>
                  FAA-H-8083-25C · Rev C 2023
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-ink-dim)', fontSize: 18, padding: 4 }}>
                ←
              </button>
            </div>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--pf-ink-dim)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search chapters…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '7px 10px 7px 32px',
                  border: '1.5px solid var(--pf-rule)', borderRadius: 7,
                  fontSize: 13, color: 'var(--pf-ink)', background: 'var(--pf-sky)',
                  outline: 'none', boxSizing: 'border-box' as const,
                }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-ink-dim)', fontSize: 16 }}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Chapter list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--pf-ink-dim)', fontSize: 13 }}>
                No chapters match &ldquo;{search}&rdquo;
              </div>
            ) : filtered.map(ch => (
              <div
                key={ch.num}
                onClick={() => setActiveChapter(ch.num)}
                style={{
                  padding: '11px 16px',
                  borderBottom: '1px solid var(--pf-rule-light)',
                  cursor: 'pointer',
                  background: activeChapter === ch.num ? 'var(--pf-cobalt-lt)' : 'transparent',
                  borderLeft: activeChapter === ch.num ? '3px solid var(--pf-cobalt)' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (activeChapter !== ch.num) e.currentTarget.style.background = 'var(--pf-sky)' }}
                onMouseLeave={e => { if (activeChapter !== ch.num) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: activeChapter === ch.num ? 'var(--pf-cobalt)' : 'var(--pf-ink-dim)', marginBottom: 3 }}>
                  CHAPTER {ch.num}
                </div>
                <div style={{ fontSize: 13, fontWeight: activeChapter === ch.num ? 600 : 400, color: activeChapter === ch.num ? 'var(--pf-cobalt)' : 'var(--pf-ink)', lineHeight: 1.4 }}>
                  {ch.title}
                </div>
                <div style={{ fontSize: 11, color: 'var(--pf-ink-dim)', fontFamily: 'monospace', marginTop: 3 }}>
                  {ch.pages}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PDF viewer area ────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{
          height: 44, flexShrink: 0,
          background: 'var(--pf-white)', borderBottom: '1px solid var(--pf-rule)',
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
        }}>
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-cobalt)', fontSize: 13, fontWeight: 600, padding: '4px 8px', borderRadius: 5 }}>
              ☰ Chapters
            </button>
          )}
          {/* Chapter number pills */}
          <div style={{ display: 'flex', gap: 5, overflowX: 'auto', flex: 1, paddingBottom: 2 }}>
            {CHAPTERS.map(ch => (
              <button key={ch.num} onClick={() => setActiveChapter(ch.num)} style={{
                flexShrink: 0, padding: '3px 9px', borderRadius: 20, fontSize: 11,
                fontFamily: 'monospace', fontWeight: 600, cursor: 'pointer', border: 'none',
                background: activeChapter === ch.num ? 'var(--pf-cobalt)' : 'var(--pf-sky)',
                color: activeChapter === ch.num ? '#fff' : 'var(--pf-ink-dim)',
              }}>
                {ch.num}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button onClick={() => setActiveChapter(Math.max(1, activeChapter - 1))} disabled={activeChapter === 1}
              style={{ background: 'var(--pf-sky)', border: '1px solid var(--pf-rule)', color: 'var(--pf-ink-mid)', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, opacity: activeChapter === 1 ? 0.4 : 1 }}>
              ← Prev
            </button>
            <button onClick={() => setActiveChapter(Math.min(17, activeChapter + 1))} disabled={activeChapter === 17}
              style={{ background: 'var(--pf-sky)', border: '1px solid var(--pf-rule)', color: 'var(--pf-ink-mid)', padding: '4px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 12, opacity: activeChapter === 17 ? 0.4 : 1 }}>
              Next →
            </button>
          </div>
        </div>

        {/* Chapter title bar */}
        <div style={{
          padding: '10px 20px', background: 'linear-gradient(130deg,#0F1F3A,#1756C8)',
          display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: '#fff' }}>
            {chapter.num}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>
              Chapter {chapter.num} — {chapter.title}
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', marginTop: 2 }}>
              PHAK FAA-H-8083-25C · {chapter.pages}
            </div>
          </div>
        </div>

        {/* PDF or placeholder */}
        {pdfSrc ? (
          <iframe
            key={`${activeChapter}-${token}`}
            src={pdfSrc}
            style={{ flex: 1, border: 'none', background: '#525659' }}
            title={`PHAK Chapter ${chapter.num} — ${chapter.title}`}
          />
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 16,
            background: '#f8fafc', color: 'var(--pf-ink-dim)',
          }}>
            <div style={{ fontSize: 48 }}>📄</div>
            {pdfError ? (
              <>
                <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--pf-ink)' }}>PHAK PDF not yet uploaded</div>
                <div style={{ fontSize: 13, textAlign: 'center', maxWidth: 420, lineHeight: 1.7 }}>
                  Download the PHAK PDF from <a href="https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/phak" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--pf-cobalt)' }}>FAA.gov</a>, save it as <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>phak.pdf</code> in your <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4 }}>backend/</code> folder, then run:
                </div>
                <div style={{ background: '#0F1F3A', color: '#90cdf4', fontFamily: 'monospace', fontSize: 13, padding: '12px 20px', borderRadius: 8 }}>
                  python upload_pdf.py PHAK phak.pdf
                </div>
              </>
            ) : (
              <div style={{ fontSize: 14 }}>Loading PDF viewer…</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
