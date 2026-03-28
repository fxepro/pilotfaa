'use client'
import { useEffect } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { progressApi } from '@/lib/api/pilotfaa'

export default function LessonView() {
  const { activeLesson, loadingLesson, activeEnrollment, startStudySession, endStudySession, setActiveView } = usePilotFAA()

  useEffect(() => {
    if (activeLesson && activeEnrollment) startStudySession(activeLesson.id)
    return () => { endStudySession() }
  }, [activeLesson?.id]) // eslint-disable-line

  if (loadingLesson) return (
    <div className="pf-view-pad" style={{textAlign:'center',padding:64,color:'var(--pf-ink-dim)'}}>Loading lesson…</div>
  )
  if (!activeLesson) return (
    <div className="pf-view-pad" style={{textAlign:'center',padding:64}}>
      <div style={{fontSize:40,marginBottom:12}}>📖</div>
      <div style={{color:'var(--pf-ink-dim)',marginBottom:16}}>Select a lesson from the course to begin.</div>
      <button className="pf-btn-primary" onClick={() => setActiveView('courses')}>Browse Courses →</button>
    </div>
  )

  const content = activeLesson.content
  const video = activeLesson.active_video

  async function markProgress(field: 'watch_pct'|'read_pct', value: number) {
    if (!activeEnrollment) return
    await progressApi.updateCompletion(activeEnrollment.id, { lesson_id: activeLesson!.id, [field]: value })
  }

  return (
    <div className="pf-view-pad" style={{maxWidth:820,margin:'0 auto'}}>
      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{fontSize:11,color:'var(--pf-ink-dim)',fontFamily:'JetBrains Mono,monospace',marginBottom:4}}>
          Lesson {activeLesson.lesson_number}
        </div>
        <div style={{fontFamily:'Playfair Display,serif',fontSize:24,fontWeight:700,marginBottom:8}}>{activeLesson.title}</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <span className="pf-tag pf-tag-blue">{activeLesson.type.replace('_',' ').toUpperCase()}</span>
          {activeLesson.duration_minutes && <span className="pf-tag pf-tag-gold">{activeLesson.duration_minutes} min</span>}
          {activeLesson.acs_mappings.slice(0,3).map(m => (
            <span key={m.id} className="pf-tag pf-tag-green">{m.acs_task_code}</span>
          ))}
        </div>
      </div>

      {/* Video */}
      {video?.video_url && (
        <div style={{background:'#000',borderRadius:12,overflow:'hidden',marginBottom:24,aspectRatio:'16/9',position:'relative'}}>
          <video src={video.video_url} controls style={{width:'100%',height:'100%'}}
            onEnded={() => markProgress('watch_pct', 100)}
            onTimeUpdate={(e) => {
              const v = e.currentTarget
              const pct = Math.round((v.currentTime / v.duration) * 100)
              if (pct > 0 && pct % 20 === 0) markProgress('watch_pct', pct)
            }} />
        </div>
      )}

      {/* Teaching text */}
      {content?.teaching_text && (
        <div className="pf-card pf-card-p" style={{marginBottom:20,lineHeight:1.75,fontSize:14.5,color:'var(--pf-ink-mid)'}}>
          {content.teaching_text}
        </div>
      )}

      {/* Key terms */}
      {content?.key_terms && content.key_terms.length > 0 && (
        <div className="pf-card pf-card-p" style={{marginBottom:20}}>
          <div style={{fontWeight:700,marginBottom:12,fontSize:14}}>Key Terms</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {content.key_terms.map((t,i) => (
              <div key={i} style={{display:'flex',gap:10}}>
                <span style={{fontWeight:700,color:'var(--pf-cobalt)',minWidth:140,fontFamily:'JetBrains Mono,monospace',fontSize:13}}>{t.word}</span>
                <span style={{color:'var(--pf-ink-mid)',fontSize:13.5}}>{t.definition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Source citation */}
      {content?.source_page_ref && (
        <div style={{fontSize:11.5,color:'var(--pf-ink-dim)',fontFamily:'JetBrains Mono,monospace',borderTop:'1px solid var(--pf-rule-light)',paddingTop:12,marginTop:8}}>
          📄 Source: {content.source_page_ref} {content.source_section_ref && `· ${content.source_section_ref}`}
        </div>
      )}

      {/* Complete button */}
      <div style={{marginTop:24}}>
        <button className="pf-btn-primary" onClick={async () => {
          await markProgress('read_pct', 100)
          setActiveView('courses')
        }}>Mark Complete & Continue →</button>
      </div>
    </div>
  )
}
