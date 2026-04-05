import { useState } from 'react'
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
  const completedCount = steps.filter((step) => step.completed).length
  const currentStep = steps[0]
  const currentHintLevel = currentStep ? hintLevels[currentStep.id] ?? 0 : 0

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
    <aside className="w-full border-l border-slate-300/70 bg-white lg:w-[340px]">
      <div className="border-b border-slate-300/70 px-4 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="space-y-6 p-4">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Steps</h3>
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
              {completedCount}/{steps.length}
            </span>
          </div>

          <p className="mb-3 rounded-md border border-cyan-700/30 bg-cyan-700/10 px-3 py-2 text-xs text-cyan-900">
            Steps auto-complete as you code. Review and adjust manually if needed before submitting.
          </p>

          <div className="space-y-2">
            {steps.map((step) => (
              <label
                key={step.id}
                className={clsx(
                  'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 transition',
                  step.completed
                    ? 'border-green-300 bg-green-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300',
                )}
              >
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => onToggleStep(step.id)}
                  className="h-4 w-4 rounded border-slate-400"
                />
                <span className={clsx('flex-1 text-sm', step.completed ? 'text-green-900 font-medium' : 'text-slate-700')}>
                  {step.label}
                </span>
                {step.completed && <Check className="h-4 w-4 text-green-600" />}
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-slate-50/70">
          <button
            type="button"
            onClick={() => setIsHintOpen((current) => !current)}
            className="flex w-full items-center justify-between px-3 py-2"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Hint</span>
            <ChevronDown className={clsx('h-4 w-4 text-slate-500 transition', isHintOpen && 'rotate-180')} />
          </button>

          {isHintOpen ? (
            <div className="space-y-3 border-t border-slate-200 px-3 py-3">
              <button
                type="button"
                onClick={handleRequestHint}
                disabled={currentHintLevel >= 3}
                className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white disabled:bg-slate-400"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {getHintButtonText()}
              </button>

              {currentHintLevel > 0 && aiHint ? (
                <div className="rounded-md bg-blue-50 p-2 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold uppercase text-blue-900">
                      Level {currentHintLevel} of 3
                    </span>
                  </div>
                  <p className="text-sm text-blue-900 leading-relaxed">{aiHint}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-600">
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
                        level <= currentHintLevel ? 'bg-blue-500' : 'bg-slate-300',
                      )}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </section>

        <section className="rounded-lg border border-cyan-800/20 bg-cyan-800/10 px-3 py-3">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-800">Reward</p>
          <p className="mt-1 text-sm font-semibold text-cyan-950">+{xpReward} XP</p>
        </section>
      </div>
    </aside>
  )
}
