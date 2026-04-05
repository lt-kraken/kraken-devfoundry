import { LessonWorkspace } from './features/course/LessonWorkspace'
import { useLessonWorkspace } from './hooks/useLessonWorkspace'
import { useTheme } from './hooks/useTheme'
import { LearningLayout } from './layouts/LearningLayout'
import { SubmissionResultModal } from './components/SubmissionResultModal'
import { CodeComparisonPanel } from './components/CodeComparisonPanel'
import { TrackRecommendationBanner } from './components/TrackRecommendationBanner'
import { BranchSelectorModal } from './components/BranchSelectorModal'
import { getBranchedLessonIds } from './data/mockLesson'

function App() {
  const { theme, resolvedTheme, setTheme } = useTheme()
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
    isBranchModalOpen,
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
    openBranchModal,
    closeBranchModal,
    handleBranchSelected,
    handleShowSolution,
    handleCloseSolution,
  } = useLessonWorkspace()

  const handleSelectLesson = (lessonId: string) => {
    void loadLessonById(lessonId)
  }

  if (isLoading || !lesson) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--bg-base)] text-sm text-[var(--text-muted)]">
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
      theme={theme}
      onChangeTheme={setTheme}
    >
      {submitError ? (
        <div className="border-b border-[var(--accent-rose)]/30 bg-[var(--accent-rose)]/8 px-4 py-2 text-sm text-[var(--accent-rose)]">{submitError}</div>
      ) : null}

      {lesson.branchPoint && activeBranchOption ? (
        <TrackRecommendationBanner
          learningTrack={learningTrack}
          branchOption={activeBranchOption}
          selectedBranchId={selectedBranchId}
          onPickDifferentApproach={openBranchModal}
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
        resolvedTheme={resolvedTheme}
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
              ? (lesson.referenceSolution ?? activeFile.starterContent)
              : activeFile.starterContent
          }
          onClose={handleCloseSolution}
        />
      ) : null}

      {lesson.branchPoint && isBranchModalOpen ? (
        <BranchSelectorModal
          branchPoint={lesson.branchPoint}
          selectedBranchId={selectedBranchId}
          onClose={closeBranchModal}
          onBranchSelected={(branchId) => {
            void handleBranchSelected(branchId)
          }}
        />
      ) : null}
    </LearningLayout>
  )
}

export default App
