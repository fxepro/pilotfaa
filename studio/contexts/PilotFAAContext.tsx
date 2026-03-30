'use client'

import React, {
  createContext, useContext, useState, useCallback,
  useEffect, useRef, type ReactNode,
} from 'react'
import {
  contentApi, progressApi, quizApi, tutorApi,
  type Course, type CourseDetail, type Chapter, type LessonDetail,
  type Enrollment, type DashboardStats, type Bookmark,
  type Note, type TutorSession, type TutorMessage,
  type QuizAttempt, type TopicMastery, type QuestionBank,
} from '@/lib/api/pilotfaa'

// ─── View IDs ─────────────────────────────────────────────────────────────────

export type ViewId =
  | 'dashboard' | 'courses'     | 'courseDetail' | 'chapter'
  | 'lesson'    | 'tutor'       | 'quiz'
  | 'bookmarks' | 'notes'       | 'phak'
  | 'faraim'    | 'acs'         | 'progress'

// ─── Context shape ────────────────────────────────────────────────────────────

interface PilotFAAContextValue {
  // Navigation
  activeView: ViewId
  setActiveView: (v: ViewId) => void
  activeLessonId: number | null
  openLesson: (lessonId: number) => void

  // Chapter drill-down
  activeChapterId: number | null
  openChapter: (chapterId: number) => void
  activeChapterData: Chapter | null

  // Courses
  courses: Course[]
  activeCourse: CourseDetail | null
  activeCourseSlug: string
  setActiveCourseSlug: (slug: string) => void
  loadingCourses: boolean

  // Enrollment
  enrollments: Enrollment[]
  activeEnrollment: Enrollment | null
  enroll: (courseId: number) => Promise<void>

  // Current lesson
  activeLesson: LessonDetail | null
  loadingLesson: boolean

  // Dashboard stats
  stats: DashboardStats | null

  // Study session
  studySessionId: number | null
  startStudySession: (lessonId: number) => Promise<void>
  endStudySession: () => Promise<void>

  // Bookmarks
  bookmarks: Bookmark[]
  addBookmark: (b: Omit<Bookmark, 'id' | 'created_at'>) => Promise<void>
  removeBookmark: (id: number) => Promise<void>
  bookmarkCount: number

  // Notes
  notes: Note[]
  activeNoteId: number | null
  setActiveNoteId: (id: number | null) => void
  createNote: (data?: Partial<Note>) => Promise<void>
  updateNote: (id: number, data: Partial<Note>) => Promise<void>
  deleteNote: (id: number) => Promise<void>
  noteCount: number

  // AI Tutor
  tutorSession: TutorSession | null
  tutorMessages: TutorMessage[]
  tutorLoading: boolean
  startTutorSession: () => Promise<void>
  askTutor: (message: string) => Promise<void>

  // Quiz
  quizBanks: QuestionBank[]
  activeAttempt: QuizAttempt | null
  setActiveAttempt: (a: QuizAttempt | null) => void

  // Topic mastery
  topicMastery: TopicMastery[]
  weakTopics: TopicMastery[]
}

const PilotFAAContext = createContext<PilotFAAContextValue | null>(null)

export function PilotFAAProvider({ children }: { children: ReactNode }) {
  // Navigation
  const [activeView,     setActiveView]     = useState<ViewId>('dashboard')
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null)

  // Chapter drill-down
  const [activeChapterId,   setActiveChapterId]   = useState<number | null>(null)
  const [activeChapterData, setActiveChapterData] = useState<Chapter | null>(null)

  // Courses
  const [courses,          setCourses]          = useState<Course[]>([])
  const [activeCourse,     setActiveCourse]     = useState<CourseDetail | null>(null)
  const [activeCourseSlug, setActiveCourseSlug_] = useState<string>('private-pilot')
  const [loadingCourses,   setLoadingCourses]   = useState(false)

  // Enrollment
  const [enrollments,      setEnrollments]      = useState<Enrollment[]>([])
  const [activeEnrollment, setActiveEnrollment] = useState<Enrollment | null>(null)

  // Lesson
  const [activeLesson,  setActiveLesson]  = useState<LessonDetail | null>(null)
  const [loadingLesson, setLoadingLesson] = useState(false)

  // Stats
  const [stats, setStats] = useState<DashboardStats | null>(null)

  // Study session
  const [studySessionId, setStudySessionId] = useState<number | null>(null)
  const sessionTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  // Notes
  const [notes,        setNotes]        = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null)

  // Tutor
  const [tutorSession,  setTutorSession]  = useState<TutorSession | null>(null)
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([])
  const [tutorLoading,  setTutorLoading]  = useState(false)

  // Quiz
  const [quizBanks,     setQuizBanks]     = useState<QuestionBank[]>([])
  const [activeAttempt, setActiveAttempt] = useState<QuizAttempt | null>(null)

  // Mastery
  const [topicMastery, setTopicMastery] = useState<TopicMastery[]>([])

  // ── Initial load ─────────────────────────────────────────────────────────────

  useEffect(() => { loadInitialData() }, []) // eslint-disable-line

  async function loadInitialData() {
    try {
      const [coursesData, enrollmentsData, bookmarksData, notesData, statsData, masteryData] =
        await Promise.allSettled([
          contentApi.getCourses(),
          progressApi.getEnrollments(),
          progressApi.getBookmarks(),
          progressApi.getNotes(),
          progressApi.getStats(),
          quizApi.getMastery(),
        ])
      if (coursesData.status     === 'fulfilled') setCourses(coursesData.value)
      if (enrollmentsData.status === 'fulfilled') setEnrollments(enrollmentsData.value)
      if (bookmarksData.status   === 'fulfilled') setBookmarks(bookmarksData.value)
      if (notesData.status       === 'fulfilled') setNotes(notesData.value)
      if (statsData.status       === 'fulfilled') setStats(statsData.value)
      if (masteryData.status     === 'fulfilled') setTopicMastery(masteryData.value)
    } catch { /* non-fatal */ }
  }

  // ── Active course ─────────────────────────────────────────────────────────────

  const setActiveCourseSlug = useCallback(async (slug: string) => {
    setActiveCourseSlug_(slug)
    setLoadingCourses(true)
    try {
      const detail = await contentApi.getCourse(slug)
      setActiveCourse(detail)
      const banks = await quizApi.getBanks(detail.id)
      setQuizBanks(banks)
      const enr = enrollments.find(e => e.course_slug === slug) ?? null
      setActiveEnrollment(enr)
    } catch { /* keep previous state */ }
    finally { setLoadingCourses(false) }
  }, [enrollments])

  // ── Open chapter ──────────────────────────────────────────────────────────────

  const openChapter = useCallback(async (chapterId: number) => {
    setActiveChapterId(chapterId)
    setActiveView('chapter')
    // Find chapter data from the already-loaded activeCourse
    if (activeCourse) {
      for (const mod of activeCourse.modules) {
        const ch = mod.chapters.find(c => c.id === chapterId)
        if (ch) { setActiveChapterData(ch); return }
      }
    }
    // Fallback: fetch from API
    try {
      const ch = await contentApi.getChapter(chapterId)
      setActiveChapterData(ch)
    } catch { /* stay on current chapter */ }
  }, [activeCourse])

  // ── Open lesson ───────────────────────────────────────────────────────────────

  const openLesson = useCallback(async (lessonId: number) => {
    setActiveLessonId(lessonId)
    setActiveView('lesson')
    setLoadingLesson(true)
    try {
      const lesson = await contentApi.getLesson(lessonId)
      setActiveLesson(lesson)
    } finally { setLoadingLesson(false) }
  }, [])

  // ── Enroll ────────────────────────────────────────────────────────────────────

  const enroll = useCallback(async (courseId: number) => {
    const enrollment = await progressApi.enroll(courseId)
    setEnrollments(prev => {
      const exists = prev.find(e => e.id === enrollment.id)
      return exists ? prev.map(e => e.id === enrollment.id ? enrollment : e) : [enrollment, ...prev]
    })
    setActiveEnrollment(enrollment)
  }, [])

  // ── Study sessions ────────────────────────────────────────────────────────────

  const startStudySession = useCallback(async (lessonId: number) => {
    if (!activeEnrollment) return
    const { session_id } = await progressApi.startSession({
      enrollment_id: activeEnrollment.id,
      lesson_id: lessonId,
      activity_type: 'lesson',
      device_type: window.innerWidth < 768 ? 'mobile' : 'desktop',
    })
    setStudySessionId(session_id)
  }, [activeEnrollment])

  const endStudySession = useCallback(async () => {
    if (!studySessionId) return
    await progressApi.endSession(studySessionId)
    setStudySessionId(null)
    const updated = await progressApi.getStats()
    setStats(updated)
  }, [studySessionId])

  useEffect(() => {
    const handler = () => { if (studySessionId) progressApi.endSession(studySessionId) }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [studySessionId])

  // ── Bookmarks ─────────────────────────────────────────────────────────────────

  const addBookmark = useCallback(async (data: Omit<Bookmark, 'id' | 'created_at'>) => {
    const bm = await progressApi.addBookmark(data)
    setBookmarks(prev => [bm, ...prev])
  }, [])

  const removeBookmark = useCallback(async (id: number) => {
    await progressApi.deleteBookmark(id)
    setBookmarks(prev => prev.filter(b => b.id !== id))
  }, [])

  // ── Notes ─────────────────────────────────────────────────────────────────────

  const createNote = useCallback(async (data?: Partial<Note>) => {
    const note = await progressApi.createNote({ title: 'New Note', source_ref: '', body: '', ...data })
    setNotes(prev => [note, ...prev])
    setActiveNoteId(note.id)
  }, [])

  const updateNote = useCallback(async (id: number, data: Partial<Note>) => {
    const updated = await progressApi.updateNote(id, data)
    setNotes(prev => prev.map(n => n.id === id ? updated : n))
  }, [])

  const deleteNote = useCallback(async (id: number) => {
    await progressApi.deleteNote(id)
    setNotes(prev => prev.filter(n => n.id !== id))
    if (activeNoteId === id) setActiveNoteId(notes.find(n => n.id !== id)?.id ?? null)
  }, [activeNoteId, notes])

  // ── AI Tutor ──────────────────────────────────────────────────────────────────

  const startTutorSession = useCallback(async () => {
    if (!activeCourse || !activeEnrollment) return
    const session = await tutorApi.startSession({
      course_id:     activeCourse.id,
      enrollment_id: activeEnrollment.id,
      lesson_id:     activeLessonId ?? undefined,
      study_mode:    'learn',
    })
    setTutorSession(session)
    const msgs = await tutorApi.getMessages(session.id)
    setTutorMessages(msgs)
  }, [activeCourse, activeEnrollment, activeLessonId])

  const askTutor = useCallback(async (message: string) => {
    if (!tutorSession) return
    setTutorLoading(true)
    try {
      const { user_message, ai_message } = await tutorApi.ask(tutorSession.id, message)
      setTutorMessages(prev => [...prev, user_message, ai_message])
    } finally { setTutorLoading(false) }
  }, [tutorSession])

  // ── Derived ───────────────────────────────────────────────────────────────────

  const weakTopics = topicMastery.filter(t => t.is_weak)

  const value: PilotFAAContextValue = {
    activeView, setActiveView,
    activeLessonId, openLesson,
    activeChapterId, openChapter, activeChapterData,
    courses, activeCourse, activeCourseSlug, setActiveCourseSlug, loadingCourses,
    enrollments, activeEnrollment, enroll,
    activeLesson, loadingLesson,
    stats,
    studySessionId, startStudySession, endStudySession,
    bookmarks, addBookmark, removeBookmark, bookmarkCount: bookmarks.length,
    notes, activeNoteId, setActiveNoteId, createNote, updateNote, deleteNote, noteCount: notes.length,
    tutorSession, tutorMessages, tutorLoading, startTutorSession, askTutor,
    quizBanks, activeAttempt, setActiveAttempt,
    topicMastery, weakTopics,
  }

  return (
    <PilotFAAContext.Provider value={value}>
      {children}
    </PilotFAAContext.Provider>
  )
}

export function usePilotFAA() {
  const ctx = useContext(PilotFAAContext)
  if (!ctx) throw new Error('usePilotFAA must be used inside PilotFAAProvider')
  return ctx
}
