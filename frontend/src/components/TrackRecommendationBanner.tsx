import { Compass } from 'lucide-react'
import type { BranchOption, LearningTrack } from '../types/learning'

type TrackRecommendationBannerProps = {
  learningTrack: LearningTrack
  branchOption: BranchOption
  selectedBranchId: string | null
  onPickDifferentApproach?: () => void
}

const trackLabels: Record<LearningTrack, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export function TrackRecommendationBanner({
  learningTrack,
  branchOption,
  selectedBranchId,
  onPickDifferentApproach,
}: TrackRecommendationBannerProps) {
  return (
    <section className="border-b border-[var(--border-subtle)] bg-gradient-to-r from-[var(--accent-cyan)]/8 to-[var(--bg-surface)] px-4 py-3 text-sm text-[var(--text-secondary)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-[var(--accent-cyan)]/20 bg-[var(--accent-cyan)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent-cyan)]">
          <Compass className="h-3.5 w-3.5" />
          {trackLabels[learningTrack]} Track
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-[var(--text-primary)]">{branchOption.label}</p>
          <p className="text-[var(--text-secondary)]">
            {branchOption.description} Change the track in the header any time without leaving the lesson.
          </p>
        </div>
        {selectedBranchId ? (
          <div className="rounded-full bg-[var(--accent-cyan)] px-3 py-1 text-xs font-medium text-slate-950">
            Saved for this lesson
          </div>
        ) : null}

        {onPickDifferentApproach ? (
          <button
            type="button"
            onClick={onPickDifferentApproach}
            className="inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[var(--border-active)] hover:text-[var(--text-primary)]"
          >
            Pick a different approach
          </button>
        ) : null}
      </div>
    </section>
  )
}