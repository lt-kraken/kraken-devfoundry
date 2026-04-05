import type { SubmitProgressResult } from '../types/learning'

type SubmissionResultModalProps = {
  result: SubmitProgressResult
  onClose: () => void
  onNextLesson: () => void
}

export function SubmissionResultModal({ result, onClose, onNextLesson }: SubmissionResultModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] p-5 shadow-[var(--shadow-elevated)]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-cyan)]">Task Submitted</p>
        <h3 className="mt-2 text-lg font-semibold text-[var(--text-primary)]">{result.courseCompleted ? 'Course complete!' : 'Lesson complete!'}</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{result.message}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Earned XP</p>
            <p className="mt-1 text-base font-semibold text-[var(--accent-amber)]">+{result.xpDelta}</p>
          </div>
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Total XP</p>
            <p className="mt-1 text-base font-semibold text-[var(--text-primary)]">{result.totalXp}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-3 py-2 text-xs font-semibold text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onNextLesson}
            disabled={!result.nextLessonId}
            className="rounded-md bg-[var(--accent-cyan)] px-3 py-2 text-xs font-semibold text-slate-950 transition hover:shadow-[var(--glow-cyan)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {result.nextLessonId ? 'Next Lesson' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
