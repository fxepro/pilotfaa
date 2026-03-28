'use client'
import { useState, useEffect } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { progressApi, type HeatmapDay } from '@/lib/api/pilotfaa'

export default function ProgressView() {
  const { enrollments, stats, topicMastery, weakTopics } = usePilotFAA()
  const [heatmap, setHeatmap] = useState<HeatmapDay[]>([])

  useEffect(() => {
    progressApi.getHeatmap(17).then(setHeatmap).catch(() => {})
  }, [])

  const maxSeconds = Math.max(...heatmap.map(d => d.total_seconds), 1)

  return (
    <div className="pf-view-pad">
      {/* Stat cards */}
      <div className="pf-stats-row" style={{marginBottom:24}}>
        {[
          {label:'Hours Studied', value:`${stats?.hours_studied??0}h`},
          {label:'Lessons Done',  value:String(stats?.lessons_done??0)},
          {label:'Quiz Average',  value:`${stats?.quiz_avg_pct??0}%`},
          {label:'Weak Topics',   value:String(stats?.weak_topics??0)},
        ].map(s => (
          <div key={s.label} className="pf-card pf-card-p" style={{textAlign:'center'}}>
            <div style={{fontSize:28,fontWeight:700,fontFamily:'Playfair Display,serif',marginBottom:4}}>{s.value}</div>
            <div style={{fontSize:12,color:'var(--pf-ink-dim)'}}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Study heatmap */}
      <div className="pf-section-heading">Study Activity</div>
      <div className="pf-card pf-card-p" style={{marginBottom:24}}>
        <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
          {heatmap.map(d => {
            const intensity = d.total_seconds / maxSeconds
            const alpha = 0.12 + intensity * 0.88
            return (
              <div key={d.day} title={`${d.day}: ${Math.round(d.total_seconds/60)} min`}
                style={{width:14,height:14,borderRadius:3,background:`rgba(23,86,200,${alpha.toFixed(2)})`}} />
            )
          })}
          {heatmap.length === 0 && <div style={{color:'var(--pf-ink-dim)',fontSize:13}}>No study data yet. Start a lesson to track your progress.</div>}
        </div>
      </div>

      {/* Enrollments */}
      <div className="pf-section-heading">Enrolled Courses</div>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:24}}>
        {enrollments.map(e => (
          <div key={e.id} className="pf-card pf-card-p" style={{display:'flex',alignItems:'center',gap:16}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,marginBottom:4}}>{e.course_name}</div>
              <div style={{height:6,background:'var(--pf-rule)',borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',background:'var(--pf-cobalt)',borderRadius:3,width:`${e.progress_pct}%`,transition:'width 0.5s'}} />
              </div>
            </div>
            <div style={{fontSize:22,fontWeight:700,fontFamily:'Playfair Display,serif',color:'var(--pf-cobalt)',minWidth:52,textAlign:'right'}}>
              {e.progress_pct}%
            </div>
          </div>
        ))}
      </div>

      {/* Weak topics */}
      {weakTopics.length > 0 && (
        <>
          <div className="pf-section-heading">Topics Needing Review</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {weakTopics.map(wt => (
              <div key={wt.id} className="pf-card pf-card-p" style={{display:'flex',alignItems:'center',gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:13}}>{wt.chapter_title}</div>
                  {wt.acs_task_code && <div style={{fontSize:11,color:'var(--pf-ink-dim)',fontFamily:'JetBrains Mono,monospace'}}>{wt.acs_task_code}</div>}
                </div>
                <span className="pf-tag pf-tag-red">{wt.mastery_pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
