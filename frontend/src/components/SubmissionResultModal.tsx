import type { SubmitProgressResult } from '../types/learning'

type SubmissionResultModalProps = {
  result: SubmitProgressResult
  onClose: () => void
  onNextLesson: () => void
}

export function SubmissionResultModal({ result, onClose, onNextLesson }: SubmissionResultModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">Task Submitted</p>
        <h3 className="mt-2 text-lg font-semibold text-slate-900">{result.courseCompleted ? 'Course complete!' : 'Lesson complete!'}</h3>
        <p className="mt-2 text-sm text-slate-600">{result.message}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Earned XP</p>
            <p className="mt-1 text-base font-semibold text-slate-900">+{result.xpDelta}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Total XP</p>
            <p className="mt-1 text-base font-semibold text-slate-900">{result.totalXp}</p>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>
          <button
            type="button"
            onClick={onNextLesson}
            disabled={!result.nextLessonId}
            className="rounded-md bg-cyan-800 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {result.nextLessonId ? 'Next Lesson' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  )
}
