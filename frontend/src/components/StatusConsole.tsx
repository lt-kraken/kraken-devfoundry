import type { RunResult } from '../types/learning'

type StatusConsoleProps = {
  runResult: RunResult
}

export function StatusConsole({ runResult }: StatusConsoleProps) {
  return (
    <div className="max-h-32 min-h-24 overflow-auto border-t border-slate-300/70 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200">
      <p className="mb-1 text-slate-400">
        status: {runResult.status}
        {runResult.runtimeMs ? ` | runtime: ${runResult.runtimeMs}ms` : ''}
      </p>
      {runResult.output.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}
