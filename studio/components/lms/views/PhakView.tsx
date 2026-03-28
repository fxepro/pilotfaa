'use client'
import { usePilotFAA } from '@/contexts/PilotFAAContext'

export default function PhakView() {
  const { activeCourse, openLesson, setActiveView } = usePilotFAA()
  const chapters = activeCourse?.modules.flatMap(m => m.chapters) ?? []

  return (
    <div className="pf-view-pad">
      <div className="pf-section-heading">
        PHAK Reference
        <span className="pf-tag pf-tag-blue">{activeCourse?.primary_source_ref ?? 'FAA-H-8083-25C'}</span>
      </div>
      <div className="pf-card" style={{marginBottom:20}}>
        {chapters.map(ch => (
          <div key={ch.id}>
            <div style={{padding:'12px 20px',background:'var(--pf-sky)',borderBottom:'1px solid var(--pf-rule-light)',fontWeight:700,fontSize:13}}>
              Chapter {ch.chapter_number} — {ch.title}
              {ch.source_page_start && (
                <span style={{fontSize:11,color:'var(--pf-ink-dim)',fontFamily:'JetBrains Mono,monospace',marginLeft:10}}>
                  pp.{ch.source_page_start}–{ch.source_page_end}
                </span>
              )}
            </div>
            {ch.lessons.map(lesson => (
              <div key={lesson.id} onClick={() => { openLesson(lesson.id); setActiveView('lesson') }}
                style={{padding:'10px 24px',borderBottom:'1px solid var(--pf-rule-light)',display:'flex',
                  alignItems:'center',gap:10,cursor:'pointer',fontSize:13.5,color:'var(--pf-ink-mid)'}}
                className="pf-chap-row">
                <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:11,color:'var(--pf-cobalt)',minWidth:36}}>{lesson.lesson_number}</span>
                {lesson.title}
                {lesson.duration_minutes && (
                  <span style={{marginLeft:'auto',fontSize:11,color:'var(--pf-ink-dim)'}}>{lesson.duration_minutes}m</span>
                )}
              </div>
            ))}
          </div>
        ))}
        {chapters.length === 0 && (
          <div style={{padding:32,textAlign:'center',color:'var(--pf-ink-dim)'}}>Select a course to browse the PHAK.</div>
        )}
      </div>
    </div>
  )
}
