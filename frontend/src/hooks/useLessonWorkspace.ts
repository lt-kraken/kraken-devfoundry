import { useEffect, useMemo, useState } from 'react'
import { getLesson, requestHint, runCode, submitProgress } from '../services/learningService'
import type { LessonDetail, RunResult } from '../types/learning'

const idleResult: RunResult = {
  status: 'idle',
  output: ['Press Run to execute your current file.'],
}

export function useLessonWorkspace() {
  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [xp, setXp] = useState(240)
  const [runResult, setRunResult] = useState<RunResult>(idleResult)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [aiHint, setAiHint] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getLesson()
      .then(setLesson)
      .finally(() => setIsLoading(false))
  }, [])

  const activeFile = useMemo(
    () => lesson?.files.find((file) => file.id === lesson.activeFileId),
    [lesson],
  )

  const completedCount = lesson?.steps.filter((step) => step.completed).length ?? 0

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
  }

  const runCurrentCode = async () => {
    if (!activeFile) return
    setRunResult({ status: 'running', output: ['Running...'] })
    setRunResult(await runCode(activeFile.content))
  }

  const submitTask = async () => {
    if (!lesson) return
    setIsSubmitting(true)

    const completedStepIds = lesson.steps.filter((step) => step.completed).map((step) => step.id)
    const result = await submitProgress(completedStepIds)
    setXp((current) => current + result.xpDelta)

    setIsSubmitting(false)
  }

  const getHint = async (stepId: string) => {
    setAiHint(await requestHint(stepId))
  }

  return {
    lesson,
    xp,
    runResult,
    isSubmitting,
    isLoading,
    aiHint,
    activeFile,
    completedCount,
    setActiveFile,
    updateCode,
    toggleStep,
    resetCode,
    runCurrentCode,
    submitTask,
    getHint,
  }
}
