import { Suspense, lazy } from 'react'
import { m, LazyMotion, domAnimation } from 'motion/react'
import { ActionBar } from '../../components/ActionBar'
import { FileExplorer } from '../../components/FileExplorer'
import { InstructionPanel } from '../../components/InstructionPanel'
import { StatusConsole } from '../../components/StatusConsole'
import type { LessonDetail, RunResult } from '../../types/learning'
import type { ResolvedTheme } from '../../hooks/useTheme'

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
  resolvedTheme: ResolvedTheme
  onSelectFile: (fileId: string) => void
  onUpdateCode: (value: string) => void
  onRun: () => void
  onReset: () => void
  onSubmit: () => void
  onShowSolution?: () => void
  onToggleStep: (stepId: string) => void
  onRequestHint: (stepId: string) => void
}

export function LessonWorkspace({
  lesson,
  runResult,
  isSubmitting,
  aiHint,
  canSubmit,
  completedCount,
  totalSteps,
  resolvedTheme,
  onSelectFile,
  onUpdateCode,
  onRun,
  onReset,
  onSubmit,
  onShowSolution,
  onToggleStep,
  onRequestHint,
}: LessonWorkspaceProps) {
  const activeFile = lesson.files.find((file) => file.id === lesson.activeFileId)

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid min-h-0 min-w-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]"
      >
        <div className="min-h-0 min-w-0 border-b border-[var(--border-subtle)] lg:border-b-0">
          <div className="flex min-h-0 flex-1">
            <FileExplorer
              files={lesson.files}
              activeFileId={lesson.activeFileId}
              onSelect={onSelectFile}
            />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--bg-surface)]">
              <div className="h-[42vh] min-h-[260px] flex-1 sm:h-[46vh] md:min-h-[300px] lg:h-[52vh]">
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center text-sm text-[var(--text-muted)]">
                      Loading editor...
                    </div>
                  }
                >
                  <CodeEditorPanel
                    language={activeFile?.language ?? 'javascript'}
                    value={activeFile?.content ?? ''}
                    onChange={onUpdateCode}
                    resolvedTheme={resolvedTheme}
                  />
                </Suspense>
              </div>
              <ActionBar
                onRun={onRun}
                onReset={onReset}
                onSubmit={onSubmit}
                onShowSolution={onShowSolution}
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
          onToggleStep={onToggleStep}
          onRequestHint={onRequestHint}
        />
      </m.div>
    </LazyMotion>
  )
}
