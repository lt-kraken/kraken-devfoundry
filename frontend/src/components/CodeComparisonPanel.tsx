import { X } from 'lucide-react'

interface CodeComparisonPanelProps {
  userCode: string
  referenceCode: string
  onClose: () => void
}

export function CodeComparisonPanel({ userCode, referenceCode, onClose }: CodeComparisonPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevated)]">
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] p-6">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Code Comparison</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Your code vs. reference solution</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-[var(--bg-surface-raised)]"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="flex flex-1 gap-1 overflow-hidden p-4">
          {/* User's Code */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-raised)]">
            <div className="border-b border-[var(--border-default)] bg-[var(--accent-cyan)]/8 px-4 py-2">
              <h3 className="text-sm font-semibold text-[var(--accent-cyan)]">Your Code</h3>
            </div>
            <pre className="flex-1 overflow-auto bg-[var(--bg-surface)] p-3 font-mono text-xs text-[var(--text-primary)]">
              <code>{userCode || '// Your code appears here'}</code>
            </pre>
          </div>

          {/* Reference Code */}
          <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-raised)]">
            <div className="border-b border-[var(--border-default)] bg-[var(--accent-emerald)]/8 px-4 py-2">
              <h3 className="text-sm font-semibold text-[var(--accent-emerald)]">Reference Solution</h3>
            </div>
            <pre className="flex-1 overflow-auto bg-[var(--bg-surface)] p-3 font-mono text-xs text-[var(--text-primary)]">
              <code>{referenceCode || '// Reference code'}</code>
            </pre>
          </div>
        </div>

        <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-surface-raised)] p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="mt-1 h-3 w-3 rounded bg-[var(--accent-cyan)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Your Implementation</p>
                <p className="text-xs text-[var(--text-secondary)]">Shows your current code</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="mt-1 h-3 w-3 rounded bg-[var(--accent-emerald)]" />
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Reference Solution</p>
                <p className="text-xs text-[var(--text-secondary)]">Professional approach with best practices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
