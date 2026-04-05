import { LessonWorkspace } from './features/course/LessonWorkspace'
import { useLessonWorkspace } from './hooks/useLessonWorkspace'
import { LearningLayout } from './layouts/LearningLayout'
import { SubmissionResultModal } from './components/SubmissionResultModal'

function App() {
  const {
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
    completedCount,
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
  } = useLessonWorkspace()

  const handleSelectLesson = (lessonId: string) => {
    void loadLessonById(lessonId)
  }

  if (isLoading || !lesson) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-600">
        Loading workspace...
      </main>
    )
  }

  return (
    <LearningLayout
      xp={xp}
      courseTitle={courseTitle}
      sections={lesson.sections}
      activeLessonId={lesson.id}
      onSelectLesson={handleSelectLesson}
    >
      {submitError ? (
        <div className="border-b border-rose-300/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">{submitError}</div>
      ) : null}

      <LessonWorkspace
        lesson={lesson}
        runResult={runResult}
        isSubmitting={isSubmitting}
        aiHint={aiHint}
        canSubmit={canSubmit}
        completedCount={completedCount}
        totalSteps={totalSteps}
        onSelectFile={setActiveFile}
        onUpdateCode={updateCode}
        onRun={runCurrentCode}
        onReset={resetCode}
        onSubmit={submitTask}
        onToggleStep={toggleStep}
        onRequestHint={getHint}
      />

      {isCompletionModalOpen && completionResult ? (
        <SubmissionResultModal
          result={completionResult}
          onClose={closeCompletionModal}
          onNextLesson={() => {
            void goToNextLesson()
          }}
        />
      ) : null}
    </LearningLayout>
  )
}

export default App
