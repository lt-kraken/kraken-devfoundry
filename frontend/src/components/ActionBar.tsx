type ActionBarProps = {
  onRun: () => void
  onReset: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function ActionBar({ onRun, onReset, onSubmit, isSubmitting }: ActionBarProps) {
  return (
    <div className="flex items-center gap-2 border-t border-slate-300/70 bg-white px-3 py-2">
      <button
        type="button"
        onClick={onRun}
        className="rounded-md bg-cyan-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-700"
      >
        Run
      </button>
      <button
        type="button"
        onClick={onReset}
        className="rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="rounded-md bg-amber-500 px-3 py-2 text-xs font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Task'}
      </button>
    </div>
  )
}
