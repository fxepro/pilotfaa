'use client'

import { usePilotFAA } from '@/contexts/PilotFAAContext'
import { lazy, Suspense } from 'react'

// Lazy-load each view so the initial bundle stays small
const DashboardView  = lazy(() => import('./views/DashboardView'))
const CoursesView    = lazy(() => import('./views/CoursesView'))
const LessonView     = lazy(() => import('./views/LessonView'))
const TutorView      = lazy(() => import('./views/TutorView'))
const QuizView       = lazy(() => import('./views/QuizView'))
const BookmarksView  = lazy(() => import('./views/BookmarksView'))
const NotesView      = lazy(() => import('./views/NotesView'))
const PhakView       = lazy(() => import('./views/PhakView'))
const FarAimView     = lazy(() => import('./views/FarAimView'))
const AcsView        = lazy(() => import('./views/AcsView'))
const ProgressView   = lazy(() => import('./views/ProgressView'))

function ViewLoader() {
  return (
    <div style={{ padding: 48, textAlign: 'center', color: 'var(--pf-ink-dim)' }}>
      Loading…
    </div>
  )
}

export default function LMSRouter() {
  const { activeView } = usePilotFAA()

  return (
    <Suspense fallback={<ViewLoader />}>
      {activeView === 'dashboard'  && <DashboardView />}
      {activeView === 'courses'    && <CoursesView />}
      {activeView === 'lesson'     && <LessonView />}
      {activeView === 'tutor'      && <TutorView />}
      {activeView === 'quiz'       && <QuizView />}
      {activeView === 'bookmarks'  && <BookmarksView />}
      {activeView === 'notes'      && <NotesView />}
      {activeView === 'phak'       && <PhakView />}
      {activeView === 'faraim'     && <FarAimView />}
      {activeView === 'acs'        && <AcsView />}
      {activeView === 'progress'   && <ProgressView />}
    </Suspense>
  )
}
