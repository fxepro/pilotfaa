'use client'

import { usePilotFAA, type ViewId } from '@/contexts/PilotFAAContext'
import LMSSidebar  from './LMSSidebar'
import LMSTopbar   from './LMSTopbar'
import LMSRouter   from './LMSRouter'

export default function LMSShell() {
  return (
    <div className="pf-app">
      <LMSSidebar />
      <main className="pf-main">
        <LMSTopbar />
        <div className="pf-content">
          <LMSRouter />
        </div>
      </main>
    </div>
  )
}
