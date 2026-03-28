'use client'
import { usePilotFAA } from '@/contexts/PilotFAAContext'

const ACS_AREAS = [
  {code:'I',   title:'Preflight Preparation',       tasks:['A','B','C','D','E','F','G']},
  {code:'II',  title:'Preflight Procedures',        tasks:['A','B','C']},
  {code:'III', title:'Airport & Airspace Operations',tasks:['A','B','C']},
  {code:'IV',  title:'Takeoffs, Landings & Go-Arounds',tasks:['A','B','C','D','E','F']},
  {code:'V',   title:'Performance Maneuvers',       tasks:['A','B']},
  {code:'VI',  title:'Ground Reference Maneuvers',  tasks:['A','B']},
  {code:'VII', title:'Navigation',                  tasks:['A','B','C']},
  {code:'VIII','title':'Slow Flight & Stalls',      tasks:['A','B','C','D']},
  {code:'IX',  title:'Basic Instrument Maneuvers',  tasks:['A','B','C','D','E']},
  {code:'X',   title:'Emergency Operations',        tasks:['A','B','C']},
  {code:'XI',  title:'Postflight Procedures',       tasks:['A']},
]

export default function AcsView() {
  const { topicMastery, activeCourse } = usePilotFAA()

  const masteryMap: Record<string,number> = {}
  topicMastery.forEach(tm => {
    if (tm.acs_task_code) masteryMap[tm.acs_task_code] = Number(tm.mastery_pct)
  })

  return (
    <div className="pf-view-pad">
      <div className="pf-section-heading">
        ACS Standards
        <span className="pf-tag pf-tag-gold">{activeCourse?.acs_code ?? 'FAA-S-ACS-6C'}</span>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {ACS_AREAS.map(area => (
          <div key={area.code} className="pf-card" style={{overflow:'hidden'}}>
            <div style={{padding:'11px 18px',background:'var(--pf-sky)',borderBottom:'1px solid var(--pf-rule-light)',fontWeight:700,fontSize:13}}>
              Area {area.code} — {area.title}
            </div>
            <div style={{display:'flex',flexWrap:'wrap',gap:8,padding:14}}>
              {area.tasks.map(task => {
                const code = `PA.${area.code}.${task}`
                const pct = masteryMap[code]
                return (
                  <div key={task} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,
                    padding:'8px 14px',background:'var(--pf-sky)',borderRadius:8,border:'1.5px solid var(--pf-rule)',
                    minWidth:72,cursor:'pointer'}}>
                    <span style={{fontFamily:'JetBrains Mono,monospace',fontWeight:700,fontSize:12,color:'var(--pf-cobalt)'}}>{code}</span>
                    <span style={{fontSize:10,color:'var(--pf-ink-dim)'}}>Task {task}</span>
                    {pct !== undefined && (
                      <span className={`pf-tag pf-tag-${pct>=70?'green':'red'}`} style={{fontSize:10}}>{pct}%</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
