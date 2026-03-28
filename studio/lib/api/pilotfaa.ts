/**
 * lib/api/pilotfaa.ts
 *
 * Typed API client for all PilotFAA Django endpoints.
 * Uses the existing axiosInstance from axios-config.ts — same Bearer
 * token from localStorage.access_token that the admin studio already uses.
 *
 * Base URL: process.env.NEXT_PUBLIC_API_BASE_URL (e.g. http://localhost:8000)
 * All routes are prefixed /api/pilotfaa/
 */

import axiosInstance from '@/lib/axios-config'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Course {
  id: number
  slug: string
  name: string
  short_name: string
  category: string
  description: string
  icon_emoji: string
  banner_gradient: string
  total_lessons: number
  estimated_hours: number | null
  sort_order: number
  status: string
  primary_source_ref: string
  acs_code: string
}

export interface CourseDetail extends Course {
  modules: Module[]
}

export interface Module {
  id: number
  title: string
  description: string
  sort_order: number
  status: string
  chapters: Chapter[]
}

export interface Chapter {
  id: number
  chapter_number: number
  title: string
  source_page_start: number | null
  source_page_end: number | null
  sort_order: number
  status: string
  lessons: LessonSummary[]
}

export interface LessonSummary {
  id: number
  lesson_number: string
  title: string
  type: 'video' | 'text' | 'video_text' | 'reference'
  duration_minutes: number | null
  sort_order: number
  is_preview: boolean
  status: string
}

export interface LessonDetail extends LessonSummary {
  content: LessonContent | null
  acs_mappings: ACSMapping[]
  active_video: VideoAsset | null
}

export interface LessonContent {
  id: number
  teaching_text: string
  key_terms: Array<{ word: string; definition: string }>
  callouts: Array<{ variant: string; label: string; body: string }>
  source_page_ref: string
  source_section_ref: string
}

export interface VideoAsset {
  id: number
  asset_version: number
  generation_status: string
  video_url: string
  caption_url: string
  thumbnail_url: string
  duration_seconds: number | null
  source_refs: Array<{ document: string; chapter: string; page: string }>
  is_active: boolean
}

export interface ACSMapping {
  id: number
  acs_area_code: string
  acs_task_code: string
  knowledge_type: string
  knowledge_ref: string
  is_primary: boolean
}

export interface Enrollment {
  id: number
  course: number
  course_name: string
  course_slug: string
  status: string
  progress_pct: number
  total_time_seconds: number
  last_lesson: number | null
  last_lesson_title: string | null
  enrolled_at: string
  trial_ends_at: string | null
  completed_at: string | null
}

export interface LessonCompletion {
  id: number
  lesson: number
  watch_pct: number
  read_pct: number
  completed: boolean
  time_spent_seconds: number
  first_accessed_at: string | null
  completed_at: string | null
}

export interface DashboardStats {
  hours_studied: number
  lessons_done: number
  quiz_avg_pct: number
  weak_topics: number
}

export interface HeatmapDay {
  day: string       // ISO date
  total_seconds: number
}

export interface Bookmark {
  id: number
  lesson: number | null
  title: string
  source_ref: string
  excerpt: string
  category: 'lesson' | 'phak' | 'faraim' | 'acs' | 'quiz'
  tag_label: string
  tag_variant: string
  created_at: string
}

export interface Note {
  id: number
  lesson: number | null
  title: string
  source_ref: string
  body: string
  updated_at: string
  created_at: string
}

export interface QuestionBank {
  id: number
  name: string
  bank_type: 'chapter' | 'mock_exam' | 'remediation' | 'custom'
  question_count: number
  time_limit_seconds: number | null
  pass_threshold_pct: number
  chapter: number | null
  chapter_title: string | null
  is_active: boolean
}

export interface Question {
  id: number
  question_text: string
  question_type: string
  options: Array<{ letter: string; text: string; is_correct: boolean }>
  difficulty: 'easy' | 'medium' | 'hard'
  acs_task_code: string
}

export interface QuizAttempt {
  id: number
  bank: number
  bank_name: string
  attempt_type: string
  score_pct: number | null
  correct_count: number
  total_questions: number
  time_seconds: number | null
  passed: boolean | null
  completed: boolean
  started_at: string
  completed_at: string | null
}

export interface AnswerResult {
  is_correct: boolean
  correct_letter: string
  rationale: string
  rationale_source_ref: string
}

export interface TopicMastery {
  id: number
  chapter: number
  chapter_title: string
  acs_task_code: string
  attempts_count: number
  correct_count: number
  mastery_pct: string  // decimal string from Django
  is_weak: boolean
  last_attempted_at: string | null
}

export interface TutorSession {
  id: number
  course: number
  lesson: number | null
  study_mode: string
  message_count: number
  started_at: string
  ended_at: string | null
}

export interface TutorMessage {
  id: number
  role: 'system' | 'user' | 'assistant'
  content: string
  intent_type: string
  confidence_score: string | null
  grounded: boolean | null
  citations: Array<{
    id: number
    source_doc_ref: string
    chapter_ref: string
    section_ref: string
    page_ref: string
    sort_order: number
  }>
  created_at: string
}

export interface AskResponse {
  user_message: TutorMessage
  ai_message: TutorMessage
}


// ─── Content API ──────────────────────────────────────────────────────────────

export const contentApi = {
  /** List all published courses */
  getCourses: (): Promise<Course[]> =>
    axiosInstance.get('/api/pilotfaa/content/courses/').then(r => r.data),

  /** Full course detail including module/chapter/lesson tree */
  getCourse: (slug: string): Promise<CourseDetail> =>
    axiosInstance.get(`/api/pilotfaa/content/courses/${slug}/`).then(r => r.data),

  /** Chapter with lesson list */
  getChapter: (chapterId: number): Promise<Chapter> =>
    axiosInstance.get(`/api/pilotfaa/content/chapters/${chapterId}/`).then(r => r.data),

  /** Full lesson detail: content, video, ACS mappings */
  getLesson: (lessonId: number): Promise<LessonDetail> =>
    axiosInstance.get(`/api/pilotfaa/content/lessons/${lessonId}/`).then(r => r.data),
}


// ─── Progress API ─────────────────────────────────────────────────────────────

export const progressApi = {
  /** All active enrollments for current user */
  getEnrollments: (): Promise<Enrollment[]> =>
    axiosInstance.get('/api/pilotfaa/progress/enrollments/').then(r => r.data),

  /** Single enrollment by course slug */
  getEnrollment: (courseSlug: string): Promise<Enrollment> =>
    axiosInstance.get(`/api/pilotfaa/progress/enrollments/${courseSlug}/`).then(r => r.data),

  /** Enroll in a course */
  enroll: (courseId: number): Promise<Enrollment> =>
    axiosInstance.post('/api/pilotfaa/progress/enroll/', { course_id: courseId }).then(r => r.data),

  /** Get all completions for an enrollment */
  getCompletions: (enrollmentId: number): Promise<LessonCompletion[]> =>
    axiosInstance.get(`/api/pilotfaa/progress/enrollments/${enrollmentId}/completions/`).then(r => r.data),

  /** Update lesson progress (watch/read %) */
  updateCompletion: (
    enrollmentId: number,
    data: { lesson_id: number; watch_pct?: number; read_pct?: number; time_spent_seconds?: number }
  ): Promise<LessonCompletion> =>
    axiosInstance.post(`/api/pilotfaa/progress/enrollments/${enrollmentId}/completions/`, data).then(r => r.data),

  /** Open a study session */
  startSession: (data: {
    enrollment_id: number
    lesson_id?: number
    activity_type?: string
    device_type?: string
  }): Promise<{ session_id: number }> =>
    axiosInstance.post('/api/pilotfaa/progress/sessions/start/', data).then(r => r.data),

  /** Close a study session */
  endSession: (sessionId: number): Promise<void> =>
    axiosInstance.patch(`/api/pilotfaa/progress/sessions/${sessionId}/end/`).then(r => r.data),

  /** Study activity heatmap */
  getHeatmap: (weeks = 17): Promise<HeatmapDay[]> =>
    axiosInstance.get(`/api/pilotfaa/progress/heatmap/?weeks=${weeks}`).then(r => r.data),

  /** Dashboard stat cards */
  getStats: (): Promise<DashboardStats> =>
    axiosInstance.get('/api/pilotfaa/progress/stats/').then(r => r.data),

  // Bookmarks
  getBookmarks: (category?: string): Promise<Bookmark[]> =>
    axiosInstance.get('/api/pilotfaa/progress/bookmarks/', {
      params: category ? { category } : {}
    }).then(r => r.data),

  addBookmark: (data: Omit<Bookmark, 'id' | 'created_at'>): Promise<Bookmark> =>
    axiosInstance.post('/api/pilotfaa/progress/bookmarks/', data).then(r => r.data),

  deleteBookmark: (id: number): Promise<void> =>
    axiosInstance.delete(`/api/pilotfaa/progress/bookmarks/${id}/`).then(r => r.data),

  // Notes
  getNotes: (): Promise<Note[]> =>
    axiosInstance.get('/api/pilotfaa/progress/notes/').then(r => r.data),

  createNote: (data: Partial<Note>): Promise<Note> =>
    axiosInstance.post('/api/pilotfaa/progress/notes/', data).then(r => r.data),

  updateNote: (id: number, data: Partial<Note>): Promise<Note> =>
    axiosInstance.patch(`/api/pilotfaa/progress/notes/${id}/`, data).then(r => r.data),

  deleteNote: (id: number): Promise<void> =>
    axiosInstance.delete(`/api/pilotfaa/progress/notes/${id}/`).then(r => r.data),
}


// ─── Quiz API ─────────────────────────────────────────────────────────────────

export const quizApi = {
  /** Get question banks for a course */
  getBanks: (courseId: number): Promise<QuestionBank[]> =>
    axiosInstance.get(`/api/pilotfaa/quiz/banks/?course_id=${courseId}`).then(r => r.data),

  /** Questions for a bank (no correct answers) */
  getBankQuestions: (bankId: number): Promise<Question[]> =>
    axiosInstance.get(`/api/pilotfaa/quiz/banks/${bankId}/questions/`).then(r => r.data),

  /** Start a quiz attempt */
  startAttempt: (data: {
    bank_id: number
    enrollment_id: number
    attempt_type?: string
  }): Promise<QuizAttempt> =>
    axiosInstance.post('/api/pilotfaa/quiz/attempts/', data).then(r => r.data),

  /** Submit one answer — returns correctness + rationale */
  submitResponse: (
    attemptId: number,
    data: { question_id: number; selected_letter: string; time_seconds?: number }
  ): Promise<AnswerResult> =>
    axiosInstance.post(`/api/pilotfaa/quiz/attempts/${attemptId}/respond/`, data).then(r => r.data),

  /** Finalize attempt */
  completeAttempt: (attemptId: number, timeSeconds?: number): Promise<QuizAttempt> =>
    axiosInstance.post(`/api/pilotfaa/quiz/attempts/${attemptId}/complete/`, {
      time_seconds: timeSeconds
    }).then(r => r.data),

  /** Attempt history */
  getHistory: (): Promise<QuizAttempt[]> =>
    axiosInstance.get('/api/pilotfaa/quiz/attempts/history/').then(r => r.data),

  /** Topic mastery for current user */
  getMastery: (weakOnly = false): Promise<TopicMastery[]> =>
    axiosInstance.get(`/api/pilotfaa/quiz/mastery/?weak_only=${weakOnly}`).then(r => r.data),
}


// ─── Tutor API ────────────────────────────────────────────────────────────────

export const tutorApi = {
  /** Open a new tutor session */
  startSession: (data: {
    course_id: number
    enrollment_id: number
    lesson_id?: number
    study_mode?: string
  }): Promise<TutorSession> =>
    axiosInstance.post('/api/pilotfaa/tutor/sessions/', data).then(r => r.data),

  /** Close a session */
  endSession: (sessionId: number): Promise<void> =>
    axiosInstance.patch(`/api/pilotfaa/tutor/sessions/${sessionId}/end/`).then(r => r.data),

  /** Get session message history (no system messages) */
  getMessages: (sessionId: number): Promise<TutorMessage[]> =>
    axiosInstance.get(`/api/pilotfaa/tutor/sessions/${sessionId}/messages/`).then(r => r.data),

  /** Send a message to Captain FAA */
  ask: (sessionId: number, message: string): Promise<AskResponse> =>
    axiosInstance.post(`/api/pilotfaa/tutor/sessions/${sessionId}/ask/`, { message }).then(r => r.data),

  /** Rate an AI message */
  submitFeedback: (
    messageId: number,
    rating: 'helpful' | 'not_helpful' | 'incorrect' | 'missing_citation',
    comment?: string
  ): Promise<void> =>
    axiosInstance.post(`/api/pilotfaa/tutor/messages/${messageId}/feedback/`, {
      rating, comment
    }).then(r => r.data),
}
