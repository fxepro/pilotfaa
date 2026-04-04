'use client'

import { useState, useEffect } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { useValidToken } from '@/hooks/useValidToken'

const BOOKS = [
  {
    shortCode: 'PHAK',
    pubRef: 'FAA-H-8083-25C',
    title: "Pilot's Handbook of Aeronautical Knowledge",
    shortTitle: 'PHAK',
    emoji: '📗',
    color: '#1756C8',
    edition: 'Rev C · 2023',
    chapters: 17,
    pages: '~500 pages',
    description: 'The foundational ground-school text covering aerodynamics, aircraft systems, weather, navigation, and FARs. Required reading for every fixed-wing certification.',
    courses: ['Private Pilot', 'Commercial Pilot', 'Sport Pilot', 'CFI'],
  },
  {
    shortCode: 'IFH',
    pubRef: 'FAA-H-8083-15B',
    title: 'Instrument Flying Handbook',
    shortTitle: 'IFH',
    emoji: '📘',
    color: '#C8860A',
    edition: 'Rev B · 2012',
    chapters: 10,
    pages: '~350 pages',
    description: 'IFR procedures, approach charts, holding patterns, weather interpretation, and cockpit automation. Primary source for the Instrument Rating ground school.',
    courses: ['Instrument Rating'],
  },
  {
    shortCode: 'RFH',
    pubRef: 'FAA-H-8083-21B',
    title: 'Rotorcraft Flying Handbook',
    shortTitle: 'RFH',
    emoji: '📙',
    color: '#127A48',
    edition: 'Rev B · 2019',
    chapters: 12,
    pages: '~290 pages',
    description: 'Helicopter aerodynamics, systems, flight maneuvers, autorotation, and emergency procedures. The rotorcraft equivalent of the PHAK.',
    courses: ['Helicopter PPL'],
  },
  {
    shortCode: 'AIM',
    pubRef: 'AIM',
    title: 'Aeronautical Information Manual',
    shortTitle: 'AIM',
    emoji: '📕',
    color: '#B91C1C',
    edition: 'Current edition',
    chapters: 9,
    pages: '~900 pages',
    description: 'ATC procedures, airspace rules, NOTAMs, weather services, navigation aids, and emergency procedures. Referenced across every course.',
    courses: ['All courses'],
  },
  {
    shortCode: 'ACS_PPL',
    pubRef: 'FAA-S-ACS-6C',
    title: 'Private Pilot Airman Certification Standards',
    shortTitle: 'ACS — Private',
    emoji: '🎯',
    color: '#1756C8',
    edition: 'Rev C · 2023',
    chapters: 6,
    pages: '~80 pages',
    description: 'Every knowledge, risk management, and skill task required to pass the Private Pilot checkride. Every quiz question maps to an ACS task code.',
    courses: ['Private Pilot'],
  },
  {
    shortCode: 'ACS_IFR',
    pubRef: 'FAA-S-ACS-8C',
    title: 'Instrument Rating Airman Certification Standards',
    shortTitle: 'ACS — Instrument',
    emoji: '🎯',
    color: '#C8860A',
    edition: 'Rev C · 2022',
    chapters: 6,
    pages: '~80 pages',
    description: 'IFR checkride standard covering precision approaches, holds, partial-panel, and emergency instrument flight.',
    courses: ['Instrument Rating'],
  },
]

interface DocStatus {
  shortCode: string
  hasFile: boolean
}

export default function FAALibraryView() {
  const { openFaaReader } = usePilotFAA()
  const token = useValidToken()
  const [docStatus, setDocStatus] = useState<DocStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch('/api/pilotfaa/faa/documents/', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : [])
      .then((docs: Array<{ short_code: string; has_pdf: boolean }>) => {
        setDocStatus(docs.map(d => ({ shortCode: d.short_code, hasFile: d.has_pdf })))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [token])

  function hasPdf(shortCode: string): boolean {
    const found = docStatus.find(d => d.shortCode === shortCode)
    return found?.hasFile ?? false
  }

  const handbooks = BOOKS.filter(b => ['PHAK', 'IFH', 'RFH', 'AIM'].includes(b.shortCode))
  const standards = BOOKS.filter(b => !['PHAK', 'IFH', 'RFH', 'AIM'].includes(b.shortCode))

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>📚</span>
          <div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 700, color: 'var(--pf-ink)', margin: 0 }}>
              FAA Reference Library
            </h1>
            <p style={{ fontSize: 13, color: 'var(--pf-ink-dim)', margin: '4px 0 0' }}>
              All official FAA publications — click any book to open the full PDF reader with chapter navigation.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', gap: 20, marginTop: 16,
          padding: '12px 16px',
          background: 'var(--pf-sky)',
          borderRadius: 8,
          border: '1px solid var(--pf-rule)',
        }}>
          {[
            { n: BOOKS.length, label: 'total documents' },
            { n: loading ? '…' : docStatus.filter(d => d.hasFile).length, label: 'PDFs loaded' },
            { n: loading ? '…' : docStatus.filter(d => !d.hasFile).length, label: 'pending upload' },
          ].map(({ n, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 18, color: 'var(--pf-cobalt)' }}>{n}</span>
              <span style={{ fontSize: 12, color: 'var(--pf-ink-dim)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Handbooks */}
      <Section title="Handbooks & Manuals" count={handbooks.length}
        subtitle="Core reference texts — used directly inside lessons, quizzes, and AI tutor responses.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16 }}>
          {handbooks.map(book => (
            <BookCard
              key={book.shortCode}
              book={book}
              available={hasPdf(book.shortCode)}
              loading={loading}
              onOpen={() => openFaaReader(book.shortCode)}
            />
          ))}
        </div>
      </Section>

      {/* ACS Standards */}
      <Section title="Airman Certification Standards" count={standards.length}
        subtitle="One ACS per certification — every quiz question and lesson is tagged to an ACS task code.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
          {standards.map(book => (
            <BookCard
              key={book.shortCode}
              book={book}
              available={hasPdf(book.shortCode)}
              loading={loading}
              onOpen={() => openFaaReader(book.shortCode)}
              compact
            />
          ))}
        </div>
      </Section>

    </div>
  )
}

function Section({ title, subtitle, count, children }: {
  title: string
  subtitle: string
  count: number
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: 'var(--pf-ink)', margin: 0 }}>
          {title}
        </h2>
        <span style={{
          fontSize: 11, color: 'var(--pf-ink-dim)',
          background: 'var(--pf-sky)', padding: '1px 8px', borderRadius: 20,
          border: '1px solid var(--pf-rule)',
        }}>{count} documents</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--pf-ink-dim)', margin: '0 0 18px', lineHeight: 1.6 }}>
        {subtitle}
      </p>
      {children}
    </div>
  )
}

function BookCard({ book, available, loading, onOpen, compact }: {
  book: typeof BOOKS[0]
  available: boolean
  loading: boolean
  onOpen: () => void
  compact?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        background: 'var(--pf-white)',
        border: `1px solid ${hovered && available ? book.color + '60' : 'var(--pf-rule)'}`,
        borderTop: `3px solid ${available ? book.color : 'var(--pf-rule)'}`,
        borderRadius: 10,
        padding: compact ? '16px 18px' : '20px 22px',
        opacity: loading ? 0.7 : available ? 1 : 0.6,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: hovered && available ? `0 4px 16px ${book.color}18` : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: compact ? 6 : 8 }}>
            <span style={{ fontSize: compact ? 18 : 22 }}>{book.emoji}</span>
            <span style={{
              fontSize: 10, fontFamily: 'monospace', fontWeight: 700,
              color: book.color, background: book.color + '15',
              padding: '2px 7px', borderRadius: 4,
            }}>{book.pubRef}</span>
            <span style={{ fontSize: 11, color: 'var(--pf-ink-dim)' }}>{book.edition}</span>
          </div>

          <div style={{
            fontWeight: 700,
            fontSize: compact ? 13 : 15,
            color: 'var(--pf-ink)',
            lineHeight: 1.3,
            marginBottom: 6,
          }}>
            {book.title}
          </div>

          {!compact && (
            <p style={{ fontSize: 12, color: 'var(--pf-ink-dim)', lineHeight: 1.6, margin: '0 0 12px' }}>
              {book.description}
            </p>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4, marginBottom: 14 }}>
            {book.courses.map(c => (
              <span key={c} style={{
                fontSize: 10, fontWeight: 600,
                color: book.color,
                background: book.color + '12',
                padding: '2px 7px', borderRadius: 3,
                border: `1px solid ${book.color}25`,
              }}>{c}</span>
            ))}
            {!compact && (
              <span style={{ fontSize: 10, color: 'var(--pf-ink-dim)', marginLeft: 4, alignSelf: 'center' }}>
                {book.chapters} chapters · {book.pages}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action */}
      {loading ? (
        <div style={{ fontSize: 12, color: 'var(--pf-ink-dim)' }}>Checking…</div>
      ) : available ? (
        <button
          onClick={onOpen}
          style={{
            background: book.color,
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            padding: compact ? '6px 14px' : '8px 18px',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Open {book.shortTitle} →
        </button>
      ) : (
        <div style={{
          fontSize: 11, color: 'var(--pf-ink-dim)',
          background: 'var(--pf-sky)',
          border: '1px solid var(--pf-rule)',
          borderRadius: 6,
          padding: '6px 12px',
          textAlign: 'center' as const,
        }}>
          PDF not yet uploaded · run <code style={{ fontFamily: 'monospace', fontSize: 10 }}>upload_pdf.py {book.shortCode}</code>
        </div>
      )}
    </div>
  )
}
