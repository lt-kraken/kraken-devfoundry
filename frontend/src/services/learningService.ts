import { getMockHint, getMockLessonById, getMockNextLessonId, mockLesson, mockLessons } from '../data/mockLesson'
import type {
  BranchOption,
  BranchPoint,
  LearningTrack,
  LessonDetail,
  RunResult,
  SubmitProgressResult,
} from '../types/learning'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const useApi = import.meta.env.VITE_USE_API === 'true'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5282'
const learningTrackStorageKey = 'devfoundry-learning-track'

type CourseResponse = {
  id: string
  title: string
  firstLessonId?: string
  lessons: { id: string; title: string }[]
}

type LessonResponse = {
  id: string
  title: string
  description: string
  xpReward: number
  steps: { id: string; label: string; completed: boolean }[]
  hints: { id: string; title: string; content: string }[]
  files: { path: string; language: 'javascript' | 'typescript' | 'html' | 'css' | 'json'; starterCode: string }[]
  referenceCode: string
  branchPoint?: BranchPoint
}

type ProgressResponse = {
  totalXp: number
  earnedXp: number
  nextLessonId?: string
  lessonCompleted: boolean
  courseCompleted: boolean
  message: string
}

type CourseProgressResponse = {
  totalXp: number
  completedLessonIds: string[]
}

type LearningTrackPreferenceResponse = {
  learningTrack: LearningTrack
}

const activeUserId = '00000000-0000-0000-0000-000000000001'
let activeCourseId = 'mock-course-js-foundations'
let activeCourseTitle = 'JavaScript Foundations'
let activeTotalXp = 240
let activeSections = structuredClone(mockLesson.sections)

const isLearningTrack = (value: string | null): value is LearningTrack =>
  value === 'beginner' || value === 'intermediate' || value === 'advanced'

const readStoredLearningTrack = (): LearningTrack => {
  if (typeof window === 'undefined') {
    return 'intermediate'
  }

  const storedTrack = window.localStorage.getItem(learningTrackStorageKey)
  return isLearningTrack(storedTrack) ? storedTrack : 'intermediate'
}

let activeLearningTrack = readStoredLearningTrack()

const persistLearningTrack = (track: LearningTrack) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(learningTrackStorageKey, track)
  }
}

const syncCompletionInSections = (completedLessonId: string) => {
  activeSections = activeSections.map((section) => ({
    ...section,
    items: section.items.map((item) =>
      item.id === completedLessonId ? { ...item, completed: true } : item,
    ),
  }))
}

const buildApiSections = (
  courses: CourseResponse[],
  courseId: string,
  completedLessonIdsFromProgress: Set<string>,
) => {
  const selectedCourse = courses.find((course) => course.id === courseId) ?? courses[0]
  if (!selectedCourse) {
    return structuredClone(mockLesson.sections)
  }

  const completedLessonIds = new Set([
    ...activeSections.flatMap((section) =>
      section.items.filter((item) => item.completed).map((item) => item.id),
    ),
    ...completedLessonIdsFromProgress,
  ])

  activeCourseId = selectedCourse.id
  activeCourseTitle = selectedCourse.title
  activeSections = [
    {
      id: 'guided-path',
      title: 'Guided Path',
      items: selectedCourse.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        completed: completedLessonIds.has(lesson.id),
      })),
    },
  ]

  return structuredClone(activeSections)
}

export async function getLesson(lessonId?: string): Promise<LessonDetail> {
  if (useApi) {
    try {
      const coursesResponse = await fetch(`${apiBaseUrl}/courses`)
      if (!coursesResponse.ok) throw new Error(`Failed to fetch courses: ${coursesResponse.status}`)
      const courses = (await coursesResponse.json()) as CourseResponse[]
      const firstCourse = courses[0]
      const selectedCourseId = firstCourse?.id ?? activeCourseId

      let progress: CourseProgressResponse | null = null
      if (selectedCourseId) {
        const progressResponse = await fetch(`${apiBaseUrl}/progress/${activeUserId}/${selectedCourseId}`)
        if (progressResponse.ok) {
          progress = (await progressResponse.json()) as CourseProgressResponse
        }
      }

      activeTotalXp = progress?.totalXp ?? activeTotalXp
      const completedLessonIds = new Set(progress?.completedLessonIds ?? [])

      const targetLessonId = lessonId ?? firstCourse?.firstLessonId
      const sections = buildApiSections(courses, selectedCourseId, completedLessonIds)

      if (targetLessonId) {
        const lessonResponse = await fetch(`${apiBaseUrl}/lessons/${targetLessonId}/${activeLearningTrack}`)
        if (!lessonResponse.ok) throw new Error(`Failed to fetch lesson: ${lessonResponse.status}`)
        const lesson = (await lessonResponse.json()) as LessonResponse

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          xpReward: lesson.xpReward,
          sections,
          steps: lesson.steps,
          hints: lesson.hints,
          files: lesson.files.map((file, index) => ({
            id: `file-${index + 1}`,
            path: file.path,
            language: file.language,
            starterContent: file.starterCode,
            content: file.starterCode,
          })),
          activeFileId: 'file-1',
          referenceSolution: lesson.referenceCode,
          branchPoint: lesson.branchPoint,
        }
      }
    } catch (error) {
      console.error('[learningService] Failed to fetch lesson from API, falling back to mock:', error)
    }
  }

  await wait(180)
  const nextMockLesson = getMockLessonById(lessonId ?? mockLesson.id, activeLearningTrack)
  return {
    ...nextMockLesson,
    sections: structuredClone(activeSections),
  }
}

export async function runCode(lessonId: string, code: string): Promise<RunResult> {
  if (useApi) {
    try {
      const response = await fetch(`${apiBaseUrl}/code/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          lessonId,
          language: 'javascript',
          sourceCode: code,
        }),
      })

      if (!response.ok) throw new Error(`Code run failed: ${response.status}`)

      const payload = (await response.json()) as {
        passed: boolean
        runtimeMs: number
        logs: string[]
      }

      return {
        status: payload.passed ? 'success' : 'failure',
        output: payload.logs,
        runtimeMs: payload.runtimeMs,
      }
    } catch (error) {
      console.error('[learningService] Failed to run code via API, falling back to mock:', error)
    }
  }

  await wait(500)

  const hasLoop = /for\s*\(|for\s+\w+\s+of/.test(code)
  const hasReturn = /return\s+/.test(code)

  if (!hasLoop || !hasReturn) {
    return {
      status: 'failure',
      output: ['Validation failed.', 'Expected a loop and a return value in buildSummary().'],
      runtimeMs: 16,
    }
  }

  return {
    status: 'success',
    output: ['Execution complete.', '1. Score: 12', '2. Score: 30', '3. Score: 18', '4. Score: 42'],
    runtimeMs: 11,
  }
}

export async function submitProgress(lessonId: string, completedSteps: string[]): Promise<SubmitProgressResult> {
  if (useApi) {
    try {
      const response = await fetch(`${apiBaseUrl}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: activeUserId,
          courseId: activeCourseId,
          lessonId,
          completedStepIds: completedSteps,
        }),
      })

      if (!response.ok) {
        const errorPayload = (await response.json()) as { message?: string }
        throw new Error(errorPayload.message ?? `Progress submission failed: ${response.status}`)
      }

      const payload = (await response.json()) as ProgressResponse
      syncCompletionInSections(lessonId)
      activeTotalXp = payload.totalXp

      return {
        xpDelta: payload.earnedXp,
        totalXp: payload.totalXp,
        nextLessonId: payload.nextLessonId,
        lessonCompleted: payload.lessonCompleted,
        courseCompleted: payload.courseCompleted,
        message: payload.message,
      }
    } catch (error) {
      console.error('[learningService] Failed to submit progress via API, falling back to mock:', error)
      throw error
    }
  }

  await wait(280)
  const hasAllSteps = completedSteps.length >= 3
  if (!hasAllSteps) {
    throw new Error('Complete all required steps before submitting.')
  }

  const nextLessonId = getMockNextLessonId(lessonId)
  syncCompletionInSections(lessonId)

  activeTotalXp += 120

  return {
    xpDelta: 120,
    totalXp: activeTotalXp,
    nextLessonId,
    lessonCompleted: true,
    courseCompleted: !nextLessonId,
    message: nextLessonId
      ? 'Lesson complete. Ready for the next task.'
      : 'Lesson complete. Course complete!',
  }
}

export function getActiveCourseTitle(): string {
  return activeCourseTitle
}

export function getActiveSections(): LessonDetail['sections'] {
  return structuredClone(activeSections)
}

export function getMockLessonIds(): string[] {
  return mockLessons.map((lesson) => lesson.id)
}

export function getActiveTotalXp(): number {
  return activeTotalXp
}

export function getActiveLearningTrack(): LearningTrack {
  return activeLearningTrack
}

export function setActiveLearningTrack(track: LearningTrack): LearningTrack {
  activeLearningTrack = track
  persistLearningTrack(track)
  return activeLearningTrack
}

export async function loadLearningTrackPreference(): Promise<LearningTrack> {
  if (useApi) {
    try {
      const response = await fetch(`${apiBaseUrl}/users/${activeUserId}/preferences/learning-track`)
      if (!response.ok) throw new Error(`Learning track fetch failed: ${response.status}`)

      const payload = (await response.json()) as LearningTrackPreferenceResponse
      return setActiveLearningTrack(payload.learningTrack)
    } catch (error) {
      console.error('[learningService] Failed to fetch learning track preference via API, falling back to local storage:', error)
    }
  }

  return activeLearningTrack
}

export async function persistLearningTrackPreference(track: LearningTrack): Promise<LearningTrack> {
  const nextTrack = setActiveLearningTrack(track)

  if (useApi) {
    try {
      const response = await fetch(`${apiBaseUrl}/users/${activeUserId}/preferences/learning-track`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ learningTrack: nextTrack }),
      })

      if (!response.ok) throw new Error(`Learning track update failed: ${response.status}`)

      const payload = (await response.json()) as LearningTrackPreferenceResponse
      return setActiveLearningTrack(payload.learningTrack)
    } catch (error) {
      console.error('[learningService] Failed to persist learning track via API, falling back to local storage:', error)
    }
  }

  return nextTrack
}

export function getRecommendedBranch(
  branchPoint: BranchPoint,
  learningTrack: LearningTrack,
): BranchOption | undefined {
  const fallbackOrder: Record<LearningTrack, LearningTrack[]> = {
    beginner: ['beginner', 'intermediate', 'advanced'],
    intermediate: ['intermediate', 'beginner', 'advanced'],
    advanced: ['advanced', 'intermediate', 'beginner'],
  }

  for (const difficulty of fallbackOrder[learningTrack]) {
    const match = branchPoint.options.find((option) => option.difficulty === difficulty)
    if (match) {
      return match
    }
  }

  return branchPoint.options[0]
}

export async function requestHint(lessonId: string, stepId: string, currentCode: string): Promise<string> {
  if (useApi) {
    try {
      const response = await fetch(`${apiBaseUrl}/ai/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          stepId,
          currentCode,
          learningTrack: activeLearningTrack,
        }),
      })

      if (!response.ok) throw new Error(`Hint request failed: ${response.status}`)

      const payload = (await response.json()) as { hint: string }
      return payload.hint
    } catch (error) {
      console.error('[learningService] Failed to fetch hint via API, falling back to mock:', error)
    }
  }

  await wait(320)
  return getMockHint(lessonId, stepId, activeLearningTrack)
}

export async function selectBranch(lessonId: string, branchId: string): Promise<void> {
  if (useApi) {
    try {
      const response = await fetch(`${apiBaseUrl}/progress/branch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          branchId,
          userId: activeUserId,
          courseId: activeCourseId,
        }),
      })

      if (!response.ok) throw new Error(`Branch selection failed: ${response.status}`)
    } catch (error) {
      console.error('[learningService] Failed to save branch selection via API:', error)
      // Continue with mock fallback
    }
  }

  await wait(100)
  // Branch selection is saved to progress tracking
  console.log(`[learningService] Branch selected: ${branchId} for lesson: ${lessonId}`)
}

export function validateStep(stepId: string, code: string, lessonId: string): boolean {
  const lessonValidators: Record<string, Record<string, RegExp>> = {
    'lesson-js-loops-1': {
      'step-1': /for\s*\(|for\s+\w+\s+of|forEach|map\s*\(/,
      'step-2': /\.push\(|\.concat\(|`[^`]*\$\{|join\(|\.join/,
      'step-3': /return\s+\w+|return\s+`|return\s+\[/,
    },
    'lesson-js-loops-2': {
      'step-1': /for\s*\(|for\s+\w+\s+of|map\s*\(|reduce\s*\(/,
      'step-2': /total|sum|\+=|reduce\s*\(|\.push\(/,
      'step-3': /return\s+\w+|return\s+`|return\s+\[/,
    },
    'lesson-js-loops-3': {
      'step-1': /sort\s*\(|toSorted\s*\(/,
      'step-2': /rank|score|name|map\s*\(|`[^`]*\$\{|join\(/,
      'step-3': /return\s+\w+|return\s+`|return\s+\[/,
    },
  }

  const lessonStepValidators = lessonValidators[lessonId]
  if (lessonStepValidators?.[stepId]) {
    return lessonStepValidators[stepId].test(code)
  }

  return code.trim().length > 0
}
