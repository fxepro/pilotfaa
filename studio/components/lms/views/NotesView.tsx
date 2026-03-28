'use client'
import { useState } from 'react'
import { usePilotFAA } from '@/contexts/PilotFAAContext'

export default function NotesView() {
  const { notes, activeNoteId, setActiveNoteId, createNote, updateNote, deleteNote } = usePilotFAA()
  const activeNote = notes.find(n => n.id === activeNoteId) ?? notes[0] ?? null
  const [localBody, setLocalBody] = useState(activeNote?.body ?? '')
  const [localTitle, setLocalTitle] = useState(activeNote?.title ?? '')

  function selectNote(n: typeof activeNote) {
    if (!n) return
    setActiveNoteId(n.id)
    setLocalBody(n.body)
    setLocalTitle(n.title)
  }

  async function save() {
    if (!activeNote) return
    await updateNote(activeNote.id, { title: localTitle, body: localBody })
  }

  return (
    <div className="pf-view-pad" style={{padding:0}}>
      <div style={{display:'grid',gridTemplateColumns:'260px 1fr',height:'calc(100vh - 56px)'}}>
        {/* Note list */}
        <div style={{borderRight:'1px solid var(--pf-rule)',background:'var(--pf-white)',display:'flex',flexDirection:'column',overflow:'hidden'}}>
          <div style={{padding:'14px 16px',borderBottom:'1px solid var(--pf-rule-light)',display:'flex',gap:8}}>
            <button className="pf-btn-primary" style={{flex:1,justifyContent:'center',fontSize:12}} onClick={() => createNote()}>+ New Note</button>
          </div>
          <div style={{flex:1,overflowY:'auto'}}>
            {notes.map(n => (
              <div key={n.id} onClick={() => selectNote(n)}
                style={{padding:'12px 16px',borderBottom:'1px solid var(--pf-rule-light)',cursor:'pointer',
                  background:n.id===activeNoteId?'var(--pf-cobalt-lt)':undefined,transition:'background 0.12s'}}>
                <div style={{fontWeight:600,fontSize:13,marginBottom:2,color:n.id===activeNoteId?'var(--pf-cobalt)':undefined}}>{n.title}</div>
                <div style={{fontSize:11.5,color:'var(--pf-ink-dim)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{n.body.slice(0,60)||'Empty note'}</div>
              </div>
            ))}
            {notes.length === 0 && <div style={{padding:32,textAlign:'center',color:'var(--pf-ink-dim)',fontSize:13}}>No notes yet.</div>}
          </div>
        </div>

        {/* Editor */}
        {activeNote ? (
          <div style={{display:'flex',flexDirection:'column',overflow:'hidden',background:'var(--pf-white)'}}>
            <div style={{padding:'12px 20px',borderBottom:'1px solid var(--pf-rule-light)',display:'flex',gap:8,alignItems:'center'}}>
              <input value={localTitle} onChange={e => setLocalTitle(e.target.value)}
                style={{flex:1,border:'none',outline:'none',fontFamily:'Playfair Display,serif',fontSize:18,fontWeight:700,color:'var(--pf-ink)'}} />
              <button className="pf-btn-primary" style={{fontSize:12,padding:'5px 14px'}} onClick={save}>Save</button>
              <button className="pf-btn-outline" style={{fontSize:12,padding:'5px 14px',color:'var(--pf-red)',borderColor:'var(--pf-red)'}}
                onClick={() => deleteNote(activeNote.id)}>Delete</button>
            </div>
            <textarea value={localBody} onChange={e => setLocalBody(e.target.value)}
              style={{flex:1,border:'none',outline:'none',padding:'20px 24px',fontSize:14.5,lineHeight:1.75,
                color:'var(--pf-ink-mid)',fontFamily:'Outfit,sans-serif',resize:'none'}}
              placeholder="Start typing your notes…" />
          </div>
        ) : (
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',color:'var(--pf-ink-dim)'}}>
            Create or select a note
          </div>
        )}
      </div>
    </div>
  )
}
