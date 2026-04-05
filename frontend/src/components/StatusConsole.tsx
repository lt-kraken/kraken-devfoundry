import clsx from 'clsx'
import type { RunResult } from '../types/learning'

type StatusConsoleProps = {
  runResult: RunResult
}

export function StatusConsole({ runResult }: StatusConsoleProps) {
  const hasOverflowHint = runResult.output.length > 5
  const tone =
    runResult.status === 'success'
      ? 'border-emerald-400/40 text-emerald-400'
      : runResult.status === 'failure'
        ? 'border-rose-400/40 text-rose-400'
        : runResult.status === 'running'
          ? 'border-amber-400/40 text-amber-400'
          : 'border-slate-600 text-slate-400'

  return (
    <div className="relative border-t border-[var(--border-subtle)] bg-slate-950 font-mono text-xs text-slate-100">
      <div className="max-h-40 min-h-24 overflow-auto px-3 py-2">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className={clsx('rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]', tone)}>
            {runResult.status}
          </span>
          <span className="text-[11px] text-slate-400">
            {runResult.runtimeMs ? `Runtime: ${runResult.runtimeMs}ms` : 'Runtime: --'}
          </span>
        </div>

        <div className="space-y-1">
          {runResult.output.map((line, index) => (
            <p key={`${index}-${line}`} className="whitespace-pre-wrap text-slate-100">
              <span className="mr-2 text-slate-600">{String(index + 1).padStart(2, '0')}</span>
              {line}
            </p>
          ))}
        </div>
      </div>

      {hasOverflowHint ? (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent" />
          <p className="pointer-events-none absolute bottom-1 right-3 text-[10px] uppercase tracking-[0.12em] text-cyan-300/90">
            Scroll for more
          </p>
        </>
      ) : null}
    </div>
  )
}
