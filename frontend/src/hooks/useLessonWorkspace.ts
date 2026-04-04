import { useEffect, useMemo, useState } from 'react'
import {
  getActiveCourseTitle,
  getActiveSections,
  getActiveTotalXp,
  getLesson,
  requestHint,
  runCode,
  submitProgress,
} from '../services/learningService'
import type { LessonDetail, RunResult, SubmitProgressResult } from '../types/learning'

const idleResult: RunResult = {
  status: 'idle',
  output: ['Press Run to execute your current file.'],
}

export function useLessonWorkspace() {
  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [courseTitle, setCourseTitle] = useState('JavaScript Foundations')
  const [xp, setXp] = useState(240)
  const [runResult, setRunResult] = useState<RunResult>(idleResult)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiHint, setAiHint] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [submitError, setSubmitError] = useState<string>('')
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false)
  const [completionResult, setCompletionResult] = useState<SubmitProgressResult | null>(null)

  useEffect(() => {
    getLesson()
      .then((nextLesson) => {
        setLesson(nextLesson)
        setCourseTitle(getActiveCourseTitle())
        setXp(getActiveTotalXp())
      })
      .finally(() => setIsLoading(false))
  }, [])

  const activeFile = useMemo(
    () => lesson?.files.find((file) => file.id === lesson.activeFileId),
    [lesson],
  )

  const completedCount = lesson?.steps.filter((step) => step.completed).length ?? 0
  const totalSteps = lesson?.steps.length ?? 0
  const canSubmit = totalSteps > 0 && completedCount === totalSteps && !isSubmitting
  const canMarkStepsFromRun = runResult.status === 'success' && completedCount < totalSteps

  const setActiveFile = (fileId: string) => {
    setLesson((current) => (current ? { ...current, activeFileId: fileId } : current))
  }

  const updateCode = (value: string) => {
    setLesson((current) => {
      if (!current) return current

      return {
        ...current,
        files: current.files.map((file) =>
          file.id === current.activeFileId ? { ...file, content: value } : file,
        ),
      }
    })
  }

  const toggleStep = (stepId: string) => {
    setLesson((current) => {
      if (!current) return current

      return {
        ...current,
        steps: current.steps.map((step) =>
          step.id === stepId ? { ...step, completed: !step.completed } : step,
        ),
      }
    })
  }

  const resetCode = () => {
    setLesson((current) => {
      if (!current) return current

      return {
        ...current,
        files: current.files.map((file) =>
          file.id === current.activeFileId ? { ...file, content: file.starterContent } : file,
        ),
      }
    })

    setRunResult(idleResult)
    setSubmitError('')
  }

  const runCurrentCode = async () => {
    if (!activeFile || !lesson) return
    setRunResult({ status: 'running', output: ['Running...'] })
    setRunResult(await runCode(lesson.id, activeFile.content))
  }

  const submitTask = async () => {
    if (!lesson) return
    if (!canSubmit) {
      setSubmitError('Complete all steps before submitting your task.')
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    const completedStepIds = lesson.steps.filter((step) => step.completed).map((step) => step.id)
    try {
      const result = await submitProgress(lesson.id, completedStepIds)
      setXp((current) => (result.totalXp > 0 ? result.totalXp : current + result.xpDelta))

      setLesson((current) =>
        current
          ? {
              ...current,
              sections: getActiveSections(),
            }
          : current,
      )

      setCompletionResult({
        ...result,
        totalXp: result.totalXp > 0 ? result.totalXp : getActiveTotalXp(),
      })
      setIsCompletionModalOpen(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to submit progress right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const markAllStepsFromPassingRun = () => {
    if (!lesson || runResult.status !== 'success') return

    setLesson((current) => {
      if (!current) return current
      return {
        ...current,
        steps: current.steps.map((step) => ({ ...step, completed: true })),
      }
    })
    setSubmitError('')
  }

  const loadLessonById = async (lessonId: string) => {
    setIsLoading(true)
    setSubmitError('')
    setAiHint('')
    setRunResult(idleResult)
    setIsCompletionModalOpen(false)

    try {
      const nextLesson = await getLesson(lessonId)
      setLesson(nextLesson)
      setCourseTitle(getActiveCourseTitle())
      setXp(getActiveTotalXp())
    } finally {
      setIsLoading(false)
    }
  }

  const goToNextLesson = async () => {
    const nextLessonId = completionResult?.nextLessonId
    setIsCompletionModalOpen(false)

    if (!nextLessonId) {
      return
    }

    await loadLessonById(nextLessonId)
  }

  const closeCompletionModal = () => {
    setIsCompletionModalOpen(false)
  }

  const getHint = async (stepId: string) => {
    const currentCode = activeFile?.content ?? ''
    const lessonId = lesson?.id ?? ''
    setAiHint(await requestHint(lessonId, stepId, currentCode))
  }

  return {
    lesson,
    courseTitle,
    xp,
    runResult,
    isSubmitting,
    isLoading,
    aiHint,
    submitError,
    canSubmit,
    totalSteps,
    canMarkStepsFromRun,
    isCompletionModalOpen,
    completionResult,
    activeFile,
    completedCount,
    setActiveFile,
    updateCode,
    toggleStep,
    resetCode,
    runCurrentCode,
    submitTask,
    getHint,
    markAllStepsFromPassingRun,
    loadLessonById,
    goToNextLesson,
    closeCompletionModal,
  }
}
