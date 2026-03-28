'use client'
export default function FarAimView() {
  return (
    <div className="pf-view-pad">
      <div className="pf-section-heading">FAR / AIM <span className="pf-tag pf-tag-blue">14 CFR · AIM 2024</span></div>
      <div className="pf-card pf-card-p" style={{marginBottom:16}}>
        <div style={{fontWeight:700,marginBottom:12}}>Quick Reference Links</div>
        {[
          ['14 CFR Part 61 — Certification', 'https://www.ecfr.gov/current/title-14/chapter-I/subchapter-D/part-61'],
          ['14 CFR Part 91 — Operating Rules', 'https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-91'],
          ['Aeronautical Information Manual (AIM)', 'https://www.faa.gov/air_traffic/publications/atpubs/aim_html/'],
          ['FAA Regulations Index', 'https://www.faa.gov/regulations_policies/faa_regulations/'],
        ].map(([label, url]) => (
          <a key={label} href={url} target="_blank" rel="noopener noreferrer"
            style={{display:'flex',alignItems:'center',gap:8,padding:'10px 0',borderBottom:'1px solid var(--pf-rule-light)',
              color:'var(--pf-cobalt)',textDecoration:'none',fontSize:14}}>
            ⚖️ {label} <span style={{marginLeft:'auto',fontSize:12,color:'var(--pf-ink-dim)'}}>eCFR.gov →</span>
          </a>
        ))}
      </div>
      <div style={{padding:20,background:'var(--pf-gold-lt)',border:'1px solid rgba(200,134,10,0.2)',borderRadius:10,fontSize:13,color:'var(--pf-ink-mid)'}}>
        <strong style={{color:'var(--pf-gold)'}}>Study tip:</strong> The AI Tutor can answer any FAR/AIM question with direct section citations.
        Try: &ldquo;What are the VFR weather minimums in Class E airspace?&rdquo;
      </div>
    </div>
  )
}
