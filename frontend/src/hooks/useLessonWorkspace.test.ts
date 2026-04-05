import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useLessonWorkspace } from './useLessonWorkspace'
import type { LessonDetail, RunResult, SubmitProgressResult } from '../types/learning'

const serviceMocks = vi.hoisted(() => ({
  getLesson: vi.fn<() => Promise<LessonDetail>>(),
  getActiveCourseTitle: vi.fn<() => string>(),
  getActiveSections: vi.fn<() => LessonDetail['sections']>(),
  getActiveTotalXp: vi.fn<() => number>(),
  requestHint: vi.fn<() => Promise<string>>(),
  runCode: vi.fn<(lessonId: string, code: string) => Promise<RunResult>>(),
  submitProgress: vi.fn<(lessonId: string, completedSteps: string[]) => Promise<SubmitProgressResult>>(),
}))

vi.mock('../services/learningService', () => ({
  getLesson: serviceMocks.getLesson,
  getActiveCourseTitle: serviceMocks.getActiveCourseTitle,
  getActiveSections: serviceMocks.getActiveSections,
  getActiveTotalXp: serviceMocks.getActiveTotalXp,
  requestHint: serviceMocks.requestHint,
  runCode: serviceMocks.runCode,
  submitProgress: serviceMocks.submitProgress,
}))

const baseLesson: LessonDetail = {
  id: 'lesson-1',
  title: 'JavaScript Loops: Controlled Repetition',
  description: 'Loop and summarize values.',
  xpReward: 120,
  sections: [
    {
      id: 'guided-path',
      title: 'Guided Path',
      items: [{ id: 'lesson-1', title: 'Controlled Repetition', completed: false }],
    },
  ],
  steps: [
    { id: 'step-1', label: 'Create a loop over scores', completed: false },
    { id: 'step-2', label: 'Build a summary string from each value', completed: false },
    { id: 'step-3', label: 'Return the final output', completed: false },
  ],
  hints: [{ id: 'hint-1', title: 'Hint', content: 'Use loop + join.' }],
  files: [
    {
      id: 'file-1',
      path: 'src/main.js',
      language: 'javascript',
      starterContent: 'function buildSummary(values) { return values.join("\\n") }',
      content: 'function buildSummary(values) { return values.join("\\n") }',
    },
  ],
  activeFileId: 'file-1',
}

describe('useLessonWorkspace', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    serviceMocks.getLesson.mockResolvedValue(structuredClone(baseLesson))
    serviceMocks.getActiveCourseTitle.mockReturnValue('JavaScript Foundations')
    serviceMocks.getActiveTotalXp.mockReturnValue(240)
    serviceMocks.getActiveSections.mockReturnValue(structuredClone(baseLesson.sections))
    serviceMocks.requestHint.mockResolvedValue('Try using map and join.')
  })

  it('auto-completes all steps after a successful run', async () => {
    serviceMocks.runCode.mockResolvedValue({
      status: 'success',
      output: ['Execution complete.'],
      runtimeMs: 9,
    })

    const { result } = renderHook(() => useLessonWorkspace())

    await waitFor(() => {
      expect(result.current.lesson).not.toBeNull()
    })

    expect(result.current.completedCount).toBe(0)
    expect(result.current.canSubmit).toBe(false)

    await act(async () => {
      await result.current.runCurrentCode()
    })

    expect(result.current.runResult.status).toBe('success')
    expect(result.current.completedCount).toBe(3)
    expect(result.current.canSubmit).toBe(true)
  })

  it('does not auto-complete steps after a failed run', async () => {
    serviceMocks.runCode.mockResolvedValue({
      status: 'failure',
      output: ['Validation failed.'],
      runtimeMs: 15,
    })

    const { result } = renderHook(() => useLessonWorkspace())

    await waitFor(() => {
      expect(result.current.lesson).not.toBeNull()
    })

    await act(async () => {
      await result.current.runCurrentCode()
    })

    expect(result.current.runResult.status).toBe('failure')
    expect(result.current.completedCount).toBe(0)
    expect(result.current.canSubmit).toBe(false)
  })

  it('keeps submit explicit and sends all completed steps after successful run', async () => {
    serviceMocks.runCode.mockResolvedValue({
      status: 'success',
      output: ['Execution complete.'],
      runtimeMs: 10,
    })

    serviceMocks.submitProgress.mockResolvedValue({
      xpDelta: 120,
      totalXp: 360,
      nextLessonId: 'lesson-2',
      lessonCompleted: true,
      courseCompleted: false,
      message: 'Lesson complete. Ready for the next task.',
    })

    const { result } = renderHook(() => useLessonWorkspace())

    await waitFor(() => {
      expect(result.current.lesson).not.toBeNull()
    })

    await act(async () => {
      await result.current.runCurrentCode()
    })

    expect(result.current.canSubmit).toBe(true)

    await act(async () => {
      await result.current.submitTask()
    })

    expect(serviceMocks.submitProgress).toHaveBeenCalledWith('lesson-1', ['step-1', 'step-2', 'step-3'])
    expect(result.current.isCompletionModalOpen).toBe(true)
    expect(result.current.completionResult?.nextLessonId).toBe('lesson-2')
  })
})
