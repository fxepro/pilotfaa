'use client'
import { usePilotFAA } from '@/contexts/PilotFAAContext'

export default function CoursesView() {
  const { courses, enrollments, setActiveCourseSlug, setActiveView, enroll } = usePilotFAA()
  const enrolledIds = new Set(enrollments.map(e => e.course))

  return (
    <div className="pf-view-pad">
      <div className="pf-section-heading">Course Catalog</div>
      <div className="pf-grid-3">
        {courses.map(course => {
          const enrolled = enrolledIds.has(course.id)
          return (
            <div key={course.id} className="pf-card pf-card-p" style={{display:'flex',flexDirection:'column',gap:10}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                <div style={{fontSize:32}}>{course.icon_emoji}</div>
                {enrolled && <span className="pf-tag pf-tag-green">Enrolled</span>}
              </div>
              <div style={{fontWeight:700,fontSize:15}}>{course.name}</div>
              <div style={{fontSize:12,color:'var(--pf-ink-dim)',flex:1}}>{course.description}</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:4}}>
                <span className="pf-tag pf-tag-blue">{course.primary_source_ref}</span>
                {course.acs_code && <span className="pf-tag pf-tag-gold">{course.acs_code}</span>}
              </div>
              <div style={{fontSize:12,color:'var(--pf-ink-dim)'}}>
                {course.total_lessons} lessons{course.estimated_hours && ` · ~${course.estimated_hours}h`}
              </div>
              <button className="pf-btn-primary" style={{justifyContent:'center',fontSize:12}}
                onClick={async () => { await setActiveCourseSlug(course.slug); if (!enrolled) await enroll(course.id); setActiveView('dashboard') }}>
                {enrolled ? 'Continue →' : 'Enroll →'}
              </button>
            </div>
          )
        })}
        {courses.length === 0 && (
          <div style={{gridColumn:'1/-1',textAlign:'center',padding:'48px 20px',color:'var(--pf-ink-dim)'}}>No courses available yet.</div>
        )}
      </div>
    </div>
  )
}
