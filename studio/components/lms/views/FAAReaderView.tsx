'use client'

import { useState, useEffect } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { useValidToken } from '@/hooks/useValidToken'

type Chapter = { num: number; title: string; pages: string; pdfPage: number }

interface BookConfig {
  shortCode: string
  pubRef: string
  title: string
  color: string
  chapters: Chapter[]
}

const BOOK_CONFIGS: BookConfig[] = [
  {
    shortCode: 'PHAK',
    pubRef: 'FAA-H-8083-25C',
    title: "Pilot's Handbook of Aeronautical Knowledge",
    color: '#1756C8',
    chapters: [
      { num: 1,  title: 'Introduction to Flying',          pages: '1-1 to 1-18',   pdfPage: 13  },
      { num: 2,  title: 'Aeronautical Decision-Making',    pages: '2-1 to 2-30',   pdfPage: 31  },
      { num: 3,  title: 'Flight Instruments',              pages: '3-1 to 3-52',   pdfPage: 61  },
      { num: 4,  title: 'Aircraft Systems',                pages: '4-1 to 4-50',   pdfPage: 113 },
      { num: 5,  title: 'Aerodynamics of Flight',          pages: '5-1 to 5-60',   pdfPage: 163 },
      { num: 6,  title: 'Flight Controls',                 pages: '6-1 to 6-30',   pdfPage: 223 },
      { num: 7,  title: 'Aircraft Performance',            pages: '7-1 to 7-40',   pdfPage: 253 },
      { num: 8,  title: 'Weight and Balance',              pages: '8-1 to 8-30',   pdfPage: 293 },
      { num: 9,  title: 'Flight Navigation',               pages: '9-1 to 9-60',   pdfPage: 323 },
      { num: 10, title: 'Aviation Weather',                pages: '10-1 to 10-60', pdfPage: 383 },
      { num: 11, title: 'Aviation Weather Services',       pages: '11-1 to 11-50', pdfPage: 443 },
      { num: 12, title: 'Airport Operations',              pages: '12-1 to 12-40', pdfPage: 493 },
      { num: 13, title: 'Airspace',                        pages: '13-1 to 13-40', pdfPage: 533 },
      { num: 14, title: 'Air Traffic Control',             pages: '14-1 to 14-40', pdfPage: 573 },
      { num: 15, title: 'Emergency Procedures',            pages: '15-1 to 15-30', pdfPage: 613 },
      { num: 16, title: 'Night Operations',                pages: '16-1 to 16-20', pdfPage: 643 },
      { num: 17, title: 'High-Altitude and Aeromedical',  pages: '17-1 to 17-30', pdfPage: 663 },
    ],
  },
  {
    shortCode: 'IFH',
    pubRef: 'FAA-H-8083-15B',
    title: 'Instrument Flying Handbook',
    color: '#C8860A',
    chapters: [
      { num: 1,  title: 'The National Airspace System',   pages: '1-1 to 1-14',   pdfPage: 9   },
      { num: 2,  title: 'The Air Traffic Control System', pages: '2-1 to 2-28',   pdfPage: 23  },
      { num: 3,  title: 'Human Factors',                  pages: '3-1 to 3-26',   pdfPage: 51  },
      { num: 4,  title: 'Aerodynamic Factors',            pages: '4-1 to 4-22',   pdfPage: 77  },
      { num: 5,  title: 'Flight Instruments',             pages: '5-1 to 5-50',   pdfPage: 99  },
      { num: 6,  title: 'Section I: Airplane Attitude Instrument Flying', pages: '6-1 to 6-46', pdfPage: 149 },
      { num: 7,  title: 'Section II: Airplane Basic Flight Maneuvers', pages: '7-1 to 7-54', pdfPage: 195 },
      { num: 8,  title: 'Navigation Systems',             pages: '8-1 to 8-56',   pdfPage: 249 },
      { num: 9,  title: 'The IFR Flight',                 pages: '9-1 to 9-40',   pdfPage: 305 },
      { num: 10, title: 'IFR Flight — Decision Making',  pages: '10-1 to 10-30',  pdfPage: 345 },
    ],
  },
  {
    shortCode: 'RFH',
    pubRef: 'FAA-H-8083-21B',
    title: 'Rotorcraft Flying Handbook',
    color: '#127A48',
    chapters: [
      { num: 1,  title: 'Introduction to the Helicopter',     pages: '1-1 to 1-14',   pdfPage: 9   },
      { num: 2,  title: 'Aerodynamics of Flight',             pages: '2-1 to 2-30',   pdfPage: 23  },
      { num: 3,  title: 'Helicopter Systems',                 pages: '3-1 to 3-28',   pdfPage: 53  },
      { num: 4,  title: 'Helicopter Flight Controls',         pages: '4-1 to 4-20',   pdfPage: 81  },
      { num: 5,  title: 'Basic Maneuvers',                    pages: '5-1 to 5-30',   pdfPage: 101 },
      { num: 6,  title: 'Advanced Maneuvers',                 pages: '6-1 to 6-34',   pdfPage: 131 },
      { num: 7,  title: 'Helicopter Navigation',              pages: '7-1 to 7-16',   pdfPage: 165 },
      { num: 8,  title: 'Helicopter Emergencies',             pages: '8-1 to 8-28',   pdfPage: 181 },
      { num: 9,  title: 'Autorotation',                       pages: '9-1 to 9-16',   pdfPage: 209 },
      { num: 10, title: 'Special Operations',                 pages: '10-1 to 10-24', pdfPage: 225 },
      { num: 11, title: 'Night Operations',                   pages: '11-1 to 11-10', pdfPage: 249 },
      { num: 12, title: 'Attitude Instrument Flying',         pages: '12-1 to 12-14', pdfPage: 259 },
    ],
  },
  {
    shortCode: 'AIM',
    pubRef: 'AIM',
    title: 'Aeronautical Information Manual',
    color: '#B91C1C',
    chapters: [
      { num: 1,  title: 'Air Navigation',                     pages: 'Ch. 1',  pdfPage: 1   },
      { num: 2,  title: 'Aeronautical Lighting & Aids',       pages: 'Ch. 2',  pdfPage: 60  },
      { num: 3,  title: 'Airspace',                           pages: 'Ch. 3',  pdfPage: 120 },
      { num: 4,  title: 'Air Traffic Control',                pages: 'Ch. 4',  pdfPage: 200 },
      { num: 5,  title: 'Air Traffic Procedures',             pages: 'Ch. 5',  pdfPage: 340 },
      { num: 6,  title: 'Emergency Procedures',               pages: 'Ch. 6',  pdfPage: 480 },
      { num: 7,  title: 'Safety of Flight',                   pages: 'Ch. 7',  pdfPage: 530 },
      { num: 8,  title: 'Medical Facts for Pilots',           pages: 'Ch. 8',  pdfPage: 650 },
      { num: 9,  title: 'Aeronautical Charts & Publications', pages: 'Ch. 9',  pdfPage: 700 },
    ],
  },
  {
    shortCode: 'ACS_PPL',
    pubRef: 'FAA-S-ACS-6C',
    title: 'Private Pilot ACS',
    color: '#1756C8',
    chapters: [
      { num: 1, title: 'Preflight Preparation',              pages: 'Area I',   pdfPage: 10 },
      { num: 2, title: 'Preflight Procedures',               pages: 'Area II',  pdfPage: 20 },
      { num: 3, title: 'Airport & Seaplane Operations',      pages: 'Area III', pdfPage: 28 },
      { num: 4, title: 'Takeoffs, Landings & Go-Arounds',   pages: 'Area IV',  pdfPage: 34 },
      { num: 5, title: 'Performance & Ground Maneuvers',     pages: 'Area V',   pdfPage: 48 },
      { num: 6, title: 'Navigation',                         pages: 'Area VI',  pdfPage: 56 },
      { num: 7, title: 'Slow Flight & Stalls',               pages: 'Area VII', pdfPage: 62 },
      { num: 8, title: 'Basic Instrument Maneuvers',         pages: 'Area VIII',pdfPage: 68 },
      { num: 9, title: 'Emergency Operations',               pages: 'Area IX',  pdfPage: 72 },
    ],
  },
  {
    shortCode: 'ACS_IFR',
    pubRef: 'FAA-S-ACS-8C',
    title: 'Instrument Rating ACS',
    color: '#C8860A',
    chapters: [
      { num: 1, title: 'Preflight Preparation',              pages: 'Area I',   pdfPage: 10 },
      { num: 2, title: 'Preflight Procedures',               pages: 'Area II',  pdfPage: 18 },
      { num: 3, title: 'Air Traffic Control Clearances',     pages: 'Area III', pdfPage: 24 },
      { num: 4, title: 'Flight by Reference to Instruments', pages: 'Area IV',  pdfPage: 30 },
      { num: 5, title: 'Navigation Systems',                 pages: 'Area V',   pdfPage: 38 },
      { num: 6, title: 'Instrument Approach Procedures',     pages: 'Area VI',  pdfPage: 46 },
      { num: 7, title: 'Emergency Operations',               pages: 'Area VII', pdfPage: 60 },
      { num: 8, title: 'Postflight Procedures',              pages: 'Area VIII',pdfPage: 66 },
    ],
  },
]

export default function FAAReaderView() {
  const { faaReaderBook, setActiveView } = usePilotFAA()
  const token = useValidToken()

  const bookConfig = BOOK_CONFIGS.find(b => b.shortCode === faaReaderBook) ?? BOOK_CONFIGS[0]

  const [search,        setSearch]        = useState('')
  const [activeChapter, setActiveChapter] = useState(1)
  const [sidebarOpen,   setSidebarOpen]   = useState(true)
  const [pdfReady,      setPdfReady]      = useState(false)
  const [pdfError,      setPdfError]      = useState(false)

  // Reset state when book changes
  useEffect(() => {
    setPdfReady(false)
    setPdfError(false)
    setActiveChapter(1)
    setSearch('')
  }, [faaReaderBook])

  // Check PDF availability
  useEffect(() => {
    if (!token) { setPdfReady(false); return }
    fetch(`/api/pilotfaa/faa/pdf/${bookConfig.shortCode}/?token=${token}`, { method: 'HEAD' })
      .then(r => { if (r.ok) setPdfReady(true); else setPdfError(true) })
      .catch(() => setPdfError(true))
  }, [token, bookConfig.shortCode])

  const filtered = bookConfig.chapters.filter(ch =>
    search === '' ||
    ch.title.toLowerCase().includes(search.toLowerCase()) ||
    String(ch.num).includes(search)
  )

  const chapter = bookConfig.chapters.find(c => c.num === activeChapter) ?? bookConfig.chapters[0]
  const totalChapters = bookConfig.chapters.length

  const pdfSrc = pdfReady
    ? `/api/pilotfaa/faa/pdf/${bookConfig.shortCode}/?token=${token}#page=${chapter.pdfPage}`
    : null

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>

      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div style={{
          width: 270, flexShrink: 0,
          borderRight: '1px solid var(--pf-rule)',
          background: 'var(--pf-white)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Back + Book header */}
          <div style={{ padding: '12px 14px 10px', borderBottom: '1px solid var(--pf-rule-light)' }}>
            <button
              onClick={() => setActiveView('faaLibrary')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--pf-cobalt)', fontSize: 12, fontWeight: 600,
                padding: '0 0 8px', display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              ← FAA Library
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--pf-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {bookConfig.shortCode} Reference
                </div>
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'var(--pf-ink-dim)', marginTop: 2 }}>
                  {bookConfig.pubRef}
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-ink-dim)', fontSize: 16, padding: 4, flexShrink: 0 }}>
                ←
              </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginTop: 10 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--pf-ink-dim)' }}>🔍</span>
              <input
                type="text"
                placeholder="Search chapters…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%', padding: '6px 10px 6px 30px',
                  border: '1.5px solid var(--pf-rule)', borderRadius: 7,
                  fontSize: 12, color: 'var(--pf-ink)', background: 'var(--pf-sky)',
                  outline: 'none', boxSizing: 'border-box' as const,
                }}
              />
              {search && (
                <button onClick={() => setSearch('')}
                  style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-ink-dim)', fontSize: 15 }}>
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Chapter list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '24px 14px', textAlign: 'center', color: 'var(--pf-ink-dim)', fontSize: 12 }}>
                No chapters match &ldquo;{search}&rdquo;
              </div>
            ) : filtered.map(ch => (
              <div
                key={ch.num}
                onClick={() => setActiveChapter(ch.num)}
                style={{
                  padding: '10px 14px',
                  borderBottom: '1px solid var(--pf-rule-light)',
                  cursor: 'pointer',
                  background: activeChapter === ch.num ? 'var(--pf-cobalt-lt)' : 'transparent',
                  borderLeft: activeChapter === ch.num ? `3px solid ${bookConfig.color}` : '3px solid transparent',
                }}
                onMouseEnter={e => { if (activeChapter !== ch.num) e.currentTarget.style.background = 'var(--pf-sky)' }}
                onMouseLeave={e => { if (activeChapter !== ch.num) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ fontSize: 10, fontFamily: 'monospace', color: activeChapter === ch.num ? bookConfig.color : 'var(--pf-ink-dim)', marginBottom: 2 }}>
                  {ch.num <= 9 ? 'CHAPTER' : 'AREA / PART'} {ch.num}
                </div>
                <div style={{ fontSize: 12, fontWeight: activeChapter === ch.num ? 600 : 400, color: activeChapter === ch.num ? 'var(--pf-ink)' : 'var(--pf-ink-mid)', lineHeight: 1.3 }}>
                  {ch.title}
                </div>
                <div style={{ fontSize: 10, color: 'var(--pf-ink-dim)', fontFamily: 'monospace', marginTop: 2 }}>
                  {ch.pages}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PDF viewer ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Topbar */}
        <div style={{
          height: 44, flexShrink: 0,
          background: 'var(--pf-white)', borderBottom: '1px solid var(--pf-rule)',
          display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10,
        }}>
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--pf-cobalt)', fontSize: 12, fontWeight: 600, padding: '4px 8px', borderRadius: 5 }}>
              ☰ Chapters
            </button>
          )}

          {/* Chapter pills */}
          <div style={{ display: 'flex', gap: 4, overflowX: 'auto', flex: 1, paddingBottom: 2 }}>
            {bookConfig.chapters.map(ch => (
              <button key={ch.num} onClick={() => setActiveChapter(ch.num)} style={{
                flexShrink: 0, padding: '2px 8px', borderRadius: 20, fontSize: 10,
                fontFamily: 'monospace', fontWeight: 600, cursor: 'pointer', border: 'none',
                background: activeChapter === ch.num ? bookConfig.color : 'var(--pf-sky)',
                color: activeChapter === ch.num ? '#fff' : 'var(--pf-ink-dim)',
              }}>
                {ch.num}
              </button>
            ))}
          </div>

          {/* Prev / Next */}
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
            <button
              onClick={() => setActiveChapter(Math.max(1, activeChapter - 1))}
              disabled={activeChapter === 1}
              style={{ background: 'var(--pf-sky)', border: '1px solid var(--pf-rule)', color: 'var(--pf-ink-mid)', padding: '3px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, opacity: activeChapter === 1 ? 0.4 : 1 }}>
              ← Prev
            </button>
            <button
              onClick={() => setActiveChapter(Math.min(totalChapters, activeChapter + 1))}
              disabled={activeChapter === totalChapters}
              style={{ background: 'var(--pf-sky)', border: '1px solid var(--pf-rule)', color: 'var(--pf-ink-mid)', padding: '3px 10px', borderRadius: 6, cursor: 'pointer', fontSize: 11, opacity: activeChapter === totalChapters ? 0.4 : 1 }}>
              Next →
            </button>
          </div>
        </div>

        {/* Chapter title bar */}
        <div style={{
          padding: '8px 18px',
          background: `linear-gradient(130deg, #0F1F3A, ${bookConfig.color})`,
          display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: 7,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#fff',
          }}>
            {chapter.num}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: 14, color: '#fff' }}>
              {chapter.title}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontFamily: 'monospace', marginTop: 1 }}>
              {bookConfig.pubRef} · {chapter.pages}
            </div>
          </div>
        </div>

        {/* PDF or placeholder */}
        {pdfSrc ? (
          <iframe
            key={`${bookConfig.shortCode}-${activeChapter}-${token}`}
            src={pdfSrc}
            style={{ flex: 1, border: 'none', background: '#525659' }}
            title={`${bookConfig.shortCode} — ${chapter.title}`}
          />
        ) : (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 14,
            background: '#f8fafc', color: 'var(--pf-ink-dim)',
          }}>
            <div style={{ fontSize: 44 }}>📄</div>
            {pdfError ? (
              <>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--pf-ink)' }}>
                  {bookConfig.shortCode} PDF not yet uploaded
                </div>
                <div style={{ fontSize: 12, textAlign: 'center', maxWidth: 400, lineHeight: 1.7, color: 'var(--pf-ink-dim)' }}>
                  Download the PDF from FAA.gov, then run:
                </div>
                <div style={{ background: '#0F1F3A', color: '#90cdf4', fontFamily: 'monospace', fontSize: 12, padding: '10px 18px', borderRadius: 7 }}>
                  python upload_pdf.py {bookConfig.shortCode} {bookConfig.shortCode.toLowerCase()}.pdf
                </div>
                <button
                  onClick={() => setActiveView('faaLibrary')}
                  style={{ marginTop: 8, background: 'none', border: '1px solid var(--pf-rule)', borderRadius: 6, padding: '6px 14px', fontSize: 12, cursor: 'pointer', color: 'var(--pf-cobalt)' }}
                >
                  ← Back to FAA Library
                </button>
              </>
            ) : (
              <div style={{ fontSize: 13 }}>Loading PDF viewer…</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
