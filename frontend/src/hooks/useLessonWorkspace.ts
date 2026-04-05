import { useEffect, useMemo, useState } from 'react'
import {
  getActiveLearningTrack,
  getActiveCourseTitle,
  getActiveSections,
  getActiveTotalXp,
  getLesson,
  getRecommendedBranch,
  loadLearningTrackPreference,
  persistLearningTrackPreference,
  requestHint,
  runCode,
  selectBranch,
  submitProgress,
  validateStep,
} from '../services/learningService'
import type { BranchOption, LearningTrack, LessonDetail, RunResult, SubmitProgressResult } from '../types/learning'

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
  const [learningTrack, setLearningTrackState] = useState<LearningTrack>(() => getActiveLearningTrack())
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null)
  const [showCodeComparison, setShowCodeComparison] = useState(false)

  const applyLearningTrack = async (nextLesson: LessonDetail, nextTrack: LearningTrack) => {
    if (!nextLesson.branchPoint) {
      setSelectedBranchId(null)
      return
    }

    const recommendedBranch = getRecommendedBranch(nextLesson.branchPoint, nextTrack)
    if (!recommendedBranch) {
      setSelectedBranchId(null)
      return
    }

    setSelectedBranchId(recommendedBranch.id)
    await selectBranch(nextLesson.id, recommendedBranch.id)
  }

  useEffect(() => {
    loadLearningTrackPreference()
      .then(async (storedTrack) => {
        setLearningTrackState(storedTrack)
        const nextLesson = await getLesson()
        setLesson({
          ...nextLesson,
          sections: getActiveSections(),
        })
        setCourseTitle(getActiveCourseTitle())
        setXp(getActiveTotalXp())
        await applyLearningTrack(nextLesson, storedTrack)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const activeFile = useMemo(
    () => lesson?.files.find((file) => file.id === lesson.activeFileId),
    [lesson],
  )

  const activeBranchOption = useMemo<BranchOption | null>(() => {
    if (!lesson?.branchPoint || !selectedBranchId) {
      return null
    }

    return lesson.branchPoint.options.find((option) => option.id === selectedBranchId) ?? null
  }, [lesson, selectedBranchId])

  const completedCount = lesson?.steps.filter((step) => step.completed).length ?? 0
  const totalSteps = lesson?.steps.length ?? 0
  const canSubmit = totalSteps > 0 && completedCount === totalSteps && !isSubmitting

  const setActiveFile = (fileId: string) => {
    setLesson((current) => (current ? { ...current, activeFileId: fileId } : current))
  }

  const updateCode = (value: string) => {
    setLesson((current) => {
      if (!current) return current

      // Real-time step validation as user types
      const updatedSteps = current.steps.map((step) => {
        const isValid = validateStep(step.id, value, current.id)
        // Only auto-mark as complete if validation passes AND it wasn't already completed
        return {
          ...step,
          completed: step.completed || isValid,
        }
      })

      return {
        ...current,
        files: current.files.map((file) =>
          file.id === current.activeFileId ? { ...file, content: value } : file,
        ),
        steps: updatedSteps,
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
    const result = await runCode(lesson.id, activeFile.content)
    setRunResult(result)

    if (result.status === 'success') {
      setLesson((current) => {
        if (!current) return current

        return {
          ...current,
          steps: current.steps.map((step) => ({ ...step, completed: true })),
        }
      })
      setSubmitError('')
    }
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

  const loadLessonById = async (lessonId: string) => {
    setIsLoading(true)
    setSubmitError('')
    setAiHint('')
    setRunResult(idleResult)
    setIsCompletionModalOpen(false)
    setSelectedBranchId(null)

    try {
      const nextLesson = await getLesson(lessonId)
      setLesson({
        ...nextLesson,
        sections: getActiveSections(),
      })
      setCourseTitle(getActiveCourseTitle())
      setXp(getActiveTotalXp())
      await applyLearningTrack(nextLesson, learningTrack)
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

  const handleBranchSelected = (branchId: string) => {
    setSelectedBranchId(branchId)
  }

  const updateLearningTrack = async (track: LearningTrack) => {
    const nextTrack = await persistLearningTrackPreference(track)
    setLearningTrackState(nextTrack)

    if (!lesson) {
      return
    }

    setAiHint('')
    setRunResult(idleResult)
    setSubmitError('')

    const nextLesson = await getLesson(lesson.id)
    setLesson({
      ...nextLesson,
      sections: getActiveSections(),
    })
    await applyLearningTrack(nextLesson, nextTrack)
  }

  const handleShowSolution = () => {
    setShowCodeComparison(true)
  }

  const handleCloseSolution = () => {
    setShowCodeComparison(false)
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
    isCompletionModalOpen,
    completionResult,
    activeFile,
    completedCount,
    learningTrack,
    activeBranchOption,
    selectedBranchId,
    showCodeComparison,
    setActiveFile,
    updateCode,
    toggleStep,
    resetCode,
    runCurrentCode,
    submitTask,
    getHint,
    loadLessonById,
    goToNextLesson,
    closeCompletionModal,
    updateLearningTrack,
    handleBranchSelected,
    handleShowSolution,
    handleCloseSolution,
  }
}
