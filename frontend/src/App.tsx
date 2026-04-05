import { LessonWorkspace } from './features/course/LessonWorkspace'
import { useLessonWorkspace } from './hooks/useLessonWorkspace'
import { LearningLayout } from './layouts/LearningLayout'
import { SubmissionResultModal } from './components/SubmissionResultModal'
import { CodeComparisonPanel } from './components/CodeComparisonPanel'
import { TrackRecommendationBanner } from './components/TrackRecommendationBanner'
import { getBranchedLessonIds } from './data/mockLesson'

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
    learningTrack,
    activeBranchOption,
    selectedBranchId,
    showCodeComparison,
    activeFile,
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
    handleShowSolution,
    handleCloseSolution,
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
      learningTrack={learningTrack}
      onChangeLearningTrack={(track) => {
        void updateLearningTrack(track)
      }}
      sections={lesson.sections}
      activeLessonId={lesson.id}
      onSelectLesson={handleSelectLesson}
      branchedLessonIds={getBranchedLessonIds()}
    >
      {submitError ? (
        <div className="border-b border-rose-300/60 bg-rose-50 px-4 py-2 text-sm text-rose-700">{submitError}</div>
      ) : null}

      {lesson.branchPoint && activeBranchOption ? (
        <TrackRecommendationBanner
          learningTrack={learningTrack}
          branchOption={activeBranchOption}
          selectedBranchId={selectedBranchId}
        />
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
        onShowSolution={handleShowSolution}
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

      {showCodeComparison && activeFile ? (
        <CodeComparisonPanel
          userCode={activeFile.content}
          referenceCode={
            activeFile.path === 'src/main.js'
              ? `const scores = [12, 30, 18, 42]\n\nfunction buildSummary(values) {\n  let result = []\n  for (let i = 0; i < values.length; i++) {\n    result.push(\`\${i + 1}. Score: \${values[i]}\`)\n  }\n  return result.join('\\n')\n}\n\nconsole.log(buildSummary(scores))`
              : activeFile.starterContent
          }
          onClose={handleCloseSolution}
        />
      ) : null}
    </LearningLayout>
  )
}

export default App
