import { mockLesson } from '../data/mockLesson'
import type { LessonDetail, RunResult } from '../types/learning'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const useApi = import.meta.env.VITE_USE_API === 'true'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5282'

type CourseResponse = {
  id: string
  firstLessonId?: string
}

type LessonResponse = {
  id: string
  title: string
  description: string
  xpReward: number
  steps: { id: string; label: string; completed: boolean }[]
  files: { path: string; language: 'javascript' | 'typescript' | 'html' | 'css' | 'json'; starterCode: string }[]
}

export async function getLesson(): Promise<LessonDetail> {
  if (useApi) {
    try {
      const coursesResponse = await fetch(`${apiBaseUrl}/courses`)
      if (!coursesResponse.ok) throw new Error(`Failed to fetch courses: ${coursesResponse.status}`)
      const courses = (await coursesResponse.json()) as CourseResponse[]
      const firstCourse = courses[0]

      if (firstCourse?.firstLessonId) {
        const lessonResponse = await fetch(`${apiBaseUrl}/lessons/${firstCourse.firstLessonId}`)
        if (!lessonResponse.ok) throw new Error(`Failed to fetch lesson: ${lessonResponse.status}`)
        const lesson = (await lessonResponse.json()) as LessonResponse

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          xpReward: lesson.xpReward,
          sections: [
            {
              id: 'api-section',
              title: 'Guided Path',
              items: [{ id: lesson.id, title: lesson.title, completed: false }],
            },
          ],
          steps: lesson.steps,
          hints: [
            {
              id: 'hint-api-1',
              title: 'Hint',
              content: 'Use the AI hint panel for contextual guidance.',
            },
          ],
          files: lesson.files.map((file, index) => ({
            id: `file-${index + 1}`,
            path: file.path,
            language: file.language,
            starterContent: file.starterCode,
            content: file.starterCode,
          })),
          activeFileId: 'file-1',
        }
      }
    } catch (error) {
      console.error('[learningService] Failed to fetch lesson from API, falling back to mock:', error)
    }
  }

  await wait(180)
  return structuredClone(mockLesson)
}

export async function runCode(code: string): Promise<RunResult> {
  if (useApi) {
    try {
      const response = await fetch(`${apiBaseUrl}/code/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000001',
          lessonId: '00000000-0000-0000-0000-000000000001',
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

export async function submitProgress(completedSteps: string[]): Promise<{ xpDelta: number }> {
  if (useApi) {
    try {
      const response = await fetch(`${apiBaseUrl}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: '00000000-0000-0000-0000-000000000001',
          courseId: '00000000-0000-0000-0000-000000000001',
          lessonId: '00000000-0000-0000-0000-000000000001',
          completedStepIds: completedSteps,
        }),
      })

      if (!response.ok) throw new Error(`Progress submission failed: ${response.status}`)

      const payload = (await response.json()) as { earnedXp: number }
      return { xpDelta: payload.earnedXp }
    } catch (error) {
      console.error('[learningService] Failed to submit progress via API, falling back to mock:', error)
    }
  }

  await wait(280)
  return { xpDelta: completedSteps.length >= 3 ? 120 : 40 }
}

export async function requestHint(stepId: string): Promise<string> {
  if (useApi) {
    try {
      const response = await fetch(`${apiBaseUrl}/ai/hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: '00000000-0000-0000-0000-000000000001',
          stepId,
          currentCode: '',
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
  return `AI hint for ${stepId}: keep your loop body focused, then combine the result once.`
}
