import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
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

  return (
    <aside className="w-full border-l border-slate-300/70 bg-white lg:w-[340px]">
      <div className="border-b border-slate-300/70 px-4 py-4">
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <div className="space-y-6 p-4">
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Steps</h3>
          <div className="space-y-2">
            {steps.map((step) => (
              <label
                key={step.id}
                className="flex cursor-pointer items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <input
                  type="checkbox"
                  checked={step.completed}
                  onChange={() => onToggleStep(step.id)}
                  className="h-4 w-4 rounded border-slate-400"
                />
                <span className="text-sm text-slate-700">{step.label}</span>
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
            <div className="space-y-2 border-t border-slate-200 px-3 py-3">
              <button
                type="button"
                onClick={() => onRequestHint(steps[0]?.id ?? 'step-1')}
                className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Ask AI Hint
              </button>
              <p className="text-sm text-slate-600">
                {aiHint || 'Reveal a focused nudge if you are blocked on one specific step.'}
              </p>
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
