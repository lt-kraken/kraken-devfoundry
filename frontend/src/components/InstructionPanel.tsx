import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Sparkles, Check } from 'lucide-react'
import clsx from 'clsx'
import type { LessonStep } from '../types/learning'

type InstructionPanelProps = {
  title: string
  description: string
  steps: LessonStep[]
  xpReward: number
  aiHint: string
  onToggleStep: (stepId: string) => void
  onRequestHint: (stepId: string) => void
}

export function InstructionPanel({
  title,
  description,
  steps,
  xpReward,
  aiHint,
  onToggleStep,
  onRequestHint,
}: InstructionPanelProps) {
  const [isHintOpen, setIsHintOpen] = useState(true)
  const [hintLevels, setHintLevels] = useState<Record<string, number>>({})
  const [recentlyCompletedStepId, setRecentlyCompletedStepId] = useState<string | null>(null)
  const previousCompletionRef = useRef<Record<string, boolean>>({})
  const currentStep = steps[0]
  const currentHintLevel = currentStep ? hintLevels[currentStep.id] ?? 0 : 0

  useEffect(() => {
    const nextCompletionState = Object.fromEntries(steps.map((step) => [step.id, step.completed]))
    const newlyCompletedStep = steps.find(
      (step) => !previousCompletionRef.current[step.id] && step.completed,
    )

    if (newlyCompletedStep) {
      setRecentlyCompletedStepId(newlyCompletedStep.id)
      const timer = window.setTimeout(() => setRecentlyCompletedStepId(null), 2200)
      previousCompletionRef.current = nextCompletionState
      return () => window.clearTimeout(timer)
    }

    previousCompletionRef.current = nextCompletionState
    return undefined
  }, [steps])

  const handleRequestHint = () => {
    if (!currentStep) return
    const newLevel = Math.min((hintLevels[currentStep.id] ?? 0) + 1, 3)
    setHintLevels((prev) => ({ ...prev, [currentStep.id]: newLevel }))
    onRequestHint(currentStep.id)
  }

  const getHintButtonText = () => {
    if (currentHintLevel === 0) return 'Ask AI Hint'
    if (currentHintLevel === 1) return 'Show Code Snippet'
    if (currentHintLevel === 2) return 'Deep Explanation'
    return 'Hint Complete'
  }

  return (
    <aside className="w-full border-l border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:w-[340px]">
      <div className="border-b border-[var(--border-subtle)] px-4 py-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{description}</p>
      </div>

      <div className="space-y-6 p-4">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Steps</h3>
          </div>

          <p className="mb-3 rounded-md border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/8 px-3 py-2 text-xs text-[var(--accent-cyan)]">
            Steps auto-complete as you code. Review and adjust manually if needed before submitting.
          </p>

          {recentlyCompletedStepId ? (
            <p className="mb-3 rounded-md border border-[var(--accent-emerald)]/25 bg-[var(--accent-emerald)]/8 px-3 py-2 text-xs font-medium text-[var(--accent-emerald)]">
              Nice progress. A step just validated from your latest code update.
            </p>
          ) : null}

          <div className="space-y-2">
            {steps.map((step) => (
              <label
                key={step.id}
                className={clsx(
                  'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 transition',
                  recentlyCompletedStepId === step.id
                    ? 'border-[var(--accent-emerald)]/25 bg-[var(--accent-emerald)]/8'
                    : step.completed
                    ? 'border-[var(--accent-emerald)]/25 bg-[var(--accent-emerald)]/8'
                    : 'border-[var(--border-default)] bg-[var(--bg-surface-raised)] hover:border-[var(--border-active)]',
                )}
              >
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => onToggleStep(step.id)}
                  className="h-4 w-4 rounded border-[var(--border-default)]"
                />
                <span className={clsx('flex-1 text-sm', step.completed ? 'font-medium text-[var(--accent-emerald)]' : 'text-[var(--text-secondary)]')}>
                  {step.label}
                </span>
                {step.completed && <Check className="h-4 w-4 text-[var(--accent-emerald)]" />}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-raised)]">
          <button
            type="button"
            onClick={() => setIsHintOpen((current) => !current)}
            className="flex w-full items-center justify-between px-3 py-2"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Hint</span>
            <ChevronDown className={clsx('h-4 w-4 text-[var(--text-muted)] transition', isHintOpen && 'rotate-180')} />
          </button>

          {isHintOpen ? (
            <div className="space-y-3 border-t border-[var(--border-default)] px-3 py-3">
              <button
                type="button"
                onClick={handleRequestHint}
                disabled={currentHintLevel >= 3}
                className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-cyan)] px-2 py-1 text-xs font-medium text-slate-950 disabled:opacity-40"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {getHintButtonText()}
              </button>

              {currentHintLevel > 0 && aiHint ? (
                <div className="rounded-md border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/8 p-2">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[10px] font-semibold uppercase text-[var(--accent-cyan)]">
                      Level {currentHintLevel} of 3
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--text-primary)]">{aiHint}</p>
                </div>
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">
                  {currentHintLevel === 0
                    ? 'Reveal a focused nudge if you are blocked on one specific step.'
                    : 'Request more detailed help as you work through this step.'}
                </p>
              )}

              {currentHintLevel > 0 && (
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <div
                      key={level}
                      className={clsx(
                        'h-1.5 flex-1 rounded-full transition',
                        level <= currentHintLevel ? 'bg-[var(--accent-cyan)]' : 'bg-[var(--bg-surface-overlay)]',
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section className="rounded-lg border border-[var(--accent-amber)]/20 bg-[var(--accent-amber)]/8 px-3 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent-amber)]">Reward</p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">+{xpReward} XP</p>
        </section>
      </div>
    </aside>
  )
}
