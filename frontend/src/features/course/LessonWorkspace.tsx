import { Suspense, lazy } from 'react'
import { ActionBar } from '../../components/ActionBar'
import { FileExplorer } from '../../components/FileExplorer'
import { InstructionPanel } from '../../components/InstructionPanel'
import { StatusConsole } from '../../components/StatusConsole'
import type { LessonDetail, RunResult } from '../../types/learning'

const CodeEditorPanel = lazy(async () => {
  const module = await import('../../components/CodeEditorPanel')
  return { default: module.CodeEditorPanel }
})

type LessonWorkspaceProps = {
  lesson: LessonDetail
  runResult: RunResult
  isSubmitting: boolean
  aiHint: string
  canSubmit: boolean
  completedCount: number
  totalSteps: number
  canMarkStepsFromRun: boolean
  onSelectFile: (fileId: string) => void
  onUpdateCode: (value: string) => void
  onRun: () => void
  onReset: () => void
  onSubmit: () => void
  onToggleStep: (stepId: string) => void
  onRequestHint: (stepId: string) => void
  onMarkFromPassingRun: () => void
}

export function LessonWorkspace({
  lesson,
  runResult,
  isSubmitting,
  aiHint,
  canSubmit,
  completedCount,
  totalSteps,
  canMarkStepsFromRun,
  onSelectFile,
  onUpdateCode,
  onRun,
  onReset,
  onSubmit,
  onToggleStep,
  onRequestHint,
  onMarkFromPassingRun,
}: LessonWorkspaceProps) {
  const activeFile = lesson.files.find((file) => file.id === lesson.activeFileId)

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="min-h-0 border-b border-slate-300/70 lg:border-b-0">
        <div className="flex min-h-0 flex-1">
          <FileExplorer
            files={lesson.files}
            activeFileId={lesson.activeFileId}
            onSelect={onSelectFile}
          />

          <div className="flex min-h-0 flex-1 flex-col bg-white">
            <div className="h-[52vh] min-h-[360px] flex-1">
              <Suspense
                fallback={
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    Loading editor...
                  </div>
                }
              >
                <CodeEditorPanel
                  language={activeFile?.language ?? 'javascript'}
                  value={activeFile?.content ?? ''}
                  onChange={onUpdateCode}
                />
              </Suspense>
            </div>
            <ActionBar
              onRun={onRun}
              onReset={onReset}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
              canSubmit={canSubmit}
              completedCount={completedCount}
              totalSteps={totalSteps}
            />
            <StatusConsole runResult={runResult} />
          </div>
        </div>
      </div>

      <InstructionPanel
        title={lesson.title}
        description={lesson.description}
        steps={lesson.steps}
        xpReward={lesson.xpReward}
        aiHint={aiHint}
        canMarkStepsFromRun={canMarkStepsFromRun}
        onToggleStep={onToggleStep}
        onRequestHint={onRequestHint}
        onMarkFromPassingRun={onMarkFromPassingRun}
      />
    </div>
  )
}
