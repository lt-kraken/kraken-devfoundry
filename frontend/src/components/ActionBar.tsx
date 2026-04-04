import { Play, RotateCcw, SendHorizontal } from 'lucide-react'

type ActionBarProps = {
  onRun: () => void
  onReset: () => void
  onSubmit: () => void
  isSubmitting: boolean
  canSubmit: boolean
  completedCount: number
  totalSteps: number
}

export function ActionBar({
  onRun,
  onReset,
  onSubmit,
  isSubmitting,
  canSubmit,
  completedCount,
  totalSteps,
}: ActionBarProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-slate-300/70 bg-white px-3 py-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onRun}
          className="inline-flex items-center gap-1 rounded-md bg-cyan-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700"
        >
          <Play className="h-3.5 w-3.5" />
          Run
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !canSubmit}
          className="inline-flex items-center gap-1 rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <SendHorizontal className="h-3.5 w-3.5" />
          {isSubmitting ? 'Submitting...' : 'Submit Task'}
        </button>
      </div>

      <div className="text-right">
        <p className="hidden text-[11px] text-slate-500 md:block">Shortcuts: Run Ctrl+Enter, Reset Ctrl+R</p>
        <p className="text-[11px] text-slate-500">
          Steps: {completedCount}/{totalSteps}
        </p>
      </div>
    </div>
  )
}
