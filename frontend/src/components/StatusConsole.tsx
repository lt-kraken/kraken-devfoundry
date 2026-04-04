import clsx from 'clsx'
import type { RunResult } from '../types/learning'

type StatusConsoleProps = {
  runResult: RunResult
}

export function StatusConsole({ runResult }: StatusConsoleProps) {
  const tone =
    runResult.status === 'success'
      ? 'border-emerald-500/40 text-emerald-300'
      : runResult.status === 'failure'
        ? 'border-rose-500/40 text-rose-300'
        : runResult.status === 'running'
          ? 'border-amber-500/40 text-amber-300'
          : 'border-slate-600 text-slate-300'

  return (
    <div className="max-h-40 min-h-24 overflow-auto border-t border-slate-300/70 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200">
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
          <p key={`${index}-${line}`} className="whitespace-pre-wrap text-slate-200">
            <span className="mr-2 text-slate-500">{String(index + 1).padStart(2, '0')}</span>
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}
