import { Play, RotateCcw, SendHorizontal, Eye } from 'lucide-react'

type ActionBarProps = {
  onRun: () => void
  onReset: () => void
  onSubmit: () => void
  onShowSolution?: () => void
  isSubmitting: boolean
  canSubmit: boolean
  completedCount: number
  totalSteps: number
}

export function ActionBar({
  onRun,
  onReset,
  onSubmit,
  onShowSolution,
  isSubmitting,
  canSubmit,
  completedCount,
  totalSteps,
}: ActionBarProps) {
  const remainingSteps = Math.max(totalSteps - completedCount, 0)
  const submitDisabledReason =
    isSubmitting || canSubmit
      ? ''
      : remainingSteps > 0
        ? `Complete ${remainingSteps} more step${remainingSteps === 1 ? '' : 's'} to enable submit.`
        : 'Submit is unavailable right now.'

  return (
    <div className="flex flex-col gap-2 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-2 shadow-[var(--shadow-panel)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRun}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-cyan)] px-3 py-2 text-xs font-semibold text-slate-950 transition hover:shadow-[var(--glow-cyan)] active:scale-[0.97]"
        >
          <Play className="h-3.5 w-3.5" />
          Run
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        {onShowSolution && (
          <button
            type="button"
            onClick={onShowSolution}
            className="inline-flex items-center gap-1 rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            <Eye className="h-3.5 w-3.5" />
            Solution
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !canSubmit}
          title={submitDisabledReason || undefined}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-amber)] px-3 py-2 text-xs font-semibold text-slate-950 transition hover:shadow-[var(--glow-amber)] disabled:cursor-not-allowed disabled:opacity-40 active:scale-[0.97]"
        >
          <SendHorizontal className="h-3.5 w-3.5" />
          {isSubmitting ? 'Submitting...' : 'Submit Task'}
        </button>
      </div>

      <div className="text-right sm:ml-auto">
        {submitDisabledReason ? (
          <p className="text-[11px] text-[var(--accent-amber)]">{submitDisabledReason}</p>
        ) : null}
        <p className="hidden text-[11px] text-[var(--text-muted)] md:block">Shortcuts: Run Ctrl+Enter, Reset Ctrl+R</p>
        <p className="text-[11px] font-medium text-[var(--text-secondary)]">
          Steps: {completedCount}/{totalSteps}
        </p>
      </div>
    </div>
  )
}
