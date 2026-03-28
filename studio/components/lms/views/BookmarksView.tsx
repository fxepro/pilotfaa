'use client'
import { useState } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'

const CATEGORIES = ['all','lesson','phak','faraim','acs','quiz'] as const

export default function BookmarksView() {
  const { bookmarks, removeBookmark, openLesson } = usePilotFAA()
  const [cat, setCat] = useState<string>('all')

  const filtered = cat === 'all' ? bookmarks : bookmarks.filter(b => b.category === cat)

  return (
    <div className="pf-view-pad">
      <div className="pf-section-heading">Bookmarks</div>
      {/* Filter tabs */}
      <div style={{display:'flex',gap:6,marginBottom:20,flexWrap:'wrap'}}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={cat===c ? 'pf-btn-primary' : 'pf-btn-outline'}
            style={{fontSize:11,padding:'5px 12px',textTransform:'capitalize'}}>
            {c === 'all' ? `All (${bookmarks.length})` : c.toUpperCase()}
          </button>
        ))}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {filtered.map(bm => (
          <div key={bm.id} className="pf-card pf-card-p" style={{display:'flex',gap:12,alignItems:'flex-start'}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',gap:8,marginBottom:4}}>
                {bm.tag_label && <span className={`pf-tag pf-tag-${bm.tag_variant||'blue'}`}>{bm.tag_label}</span>}
              </div>
              <div style={{fontWeight:600,fontSize:14,marginBottom:4,cursor:bm.lesson?'pointer':undefined,color:bm.lesson?'var(--pf-cobalt)':undefined}}
                onClick={() => bm.lesson && openLesson(bm.lesson)}>
                {bm.title}
              </div>
              {bm.source_ref && <div style={{fontSize:11.5,color:'var(--pf-ink-dim)',fontFamily:'JetBrains Mono,monospace'}}>{bm.source_ref}</div>}
              {bm.excerpt && <div style={{fontSize:13,color:'var(--pf-ink-mid)',marginTop:6,fontStyle:'italic'}}>&ldquo;{bm.excerpt}&rdquo;</div>}
            </div>
            <button onClick={() => removeBookmark(bm.id)}
              style={{background:'none',border:'none',cursor:'pointer',color:'var(--pf-ink-dim)',fontSize:16,flexShrink:0}}
              title="Remove bookmark">×</button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'48px 20px',color:'var(--pf-ink-dim)'}}>No bookmarks yet.</div>
        )}
      </div>
    </div>
  )
}
