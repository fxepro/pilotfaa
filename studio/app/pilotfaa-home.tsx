'use client'

import { PilotFAAProvider } from '@/contexts/PilotFAAContext'
import LMSShell from '@/components/lms/LMSShell'
import '@/styles/pilotfaa.css'

export function PilotFAAHome() {
  return (
    <PilotFAAProvider>
      <LMSShell />
    </PilotFAAProvider>
  )
}
