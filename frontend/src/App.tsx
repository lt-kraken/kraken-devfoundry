import { LessonWorkspace } from './features/course/LessonWorkspace'
import { useLessonWorkspace } from './hooks/useLessonWorkspace'
import { LearningLayout } from './layouts/LearningLayout'

function App() {
  const {
    lesson,
    xp,
    runResult,
    isSubmitting,
    isLoading,
    aiHint,
    setActiveFile,
    updateCode,
    toggleStep,
    resetCode,
    runCurrentCode,
    submitTask,
    getHint,
  } = useLessonWorkspace()

  const handleSelectLesson = () => {
    // The MVP seed includes one lesson; lesson navigation UI is present for future backend data.
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
      courseTitle="JavaScript Foundations"
      sections={lesson.sections}
      activeLessonId={lesson.id}
      onSelectLesson={handleSelectLesson}
    >
      <LessonWorkspace
        lesson={lesson}
        runResult={runResult}
        isSubmitting={isSubmitting}
        aiHint={aiHint}
        onSelectFile={setActiveFile}
        onUpdateCode={updateCode}
        onRun={runCurrentCode}
        onReset={resetCode}
        onSubmit={submitTask}
        onToggleStep={toggleStep}
        onRequestHint={getHint}
      />
    </LearningLayout>
  )
}

export default App
