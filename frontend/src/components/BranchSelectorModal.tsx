import type { BranchPoint } from '../types/learning'
import clsx from 'clsx'
import { X } from 'lucide-react'

interface BranchSelectorModalProps {
  branchPoint: BranchPoint
  selectedBranchId: string | null
  onBranchSelected: (branchId: string) => Promise<void> | void
  onClose: () => void
}

export function BranchSelectorModal({
  branchPoint,
  selectedBranchId,
  onBranchSelected,
  onClose,
}: BranchSelectorModalProps) {
  const getDifficultyTone = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
      case 'intermediate':
        return 'border-amber-400/30 bg-amber-400/10 text-amber-400'
      case 'advanced':
        return 'border-rose-400/30 bg-rose-400/10 text-rose-400'
      default:
        return 'border-[var(--border-default)] bg-[var(--bg-surface-raised)] text-[var(--text-muted)]'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0" aria-label="Close branch selection" onClick={onClose} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevated)]">
        <div className="border-b border-[var(--border-subtle)] p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">{branchPoint.question}</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Pick a route that fits your momentum. You can switch approaches later.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close branch selector"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-[var(--border-default)] text-[var(--text-muted)] transition hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90vh-96px)] space-y-3 overflow-auto p-6">
          {branchPoint.options.map((option) => {
            const isSelected = selectedBranchId === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onBranchSelected(option.id)}
                className={clsx(
                  'w-full rounded-lg border p-5 text-left transition',
                  isSelected
                    ? 'border-[var(--accent-cyan)]/40 bg-[var(--accent-cyan)]/10 shadow-[var(--glow-cyan)]'
                    : 'border-[var(--border-default)] bg-[var(--bg-surface-raised)] hover:border-[var(--border-active)]',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-[var(--text-primary)]">{option.label}</h3>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">{option.description}</p>
                  </div>
                  {option.difficulty ? (
                    <span
                      className={clsx(
                        'whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold capitalize',
                        getDifficultyTone(option.difficulty),
                      )}
                    >
                      {option.difficulty}
                    </span>
                  ) : null}
                </div>

                <div className={clsx(
                  'mt-4 inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold',
                  isSelected
                    ? 'bg-[var(--accent-cyan)] text-slate-950'
                    : 'bg-[var(--bg-surface-overlay)] text-[var(--text-secondary)]',
                )}>
                  {isSelected ? 'Current path' : 'Choose this path'}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
