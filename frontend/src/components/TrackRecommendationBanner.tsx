import { Compass } from 'lucide-react'
import type { BranchOption, LearningTrack } from '../types/learning'

type TrackRecommendationBannerProps = {
  learningTrack: LearningTrack
  branchOption: BranchOption
  selectedBranchId: string | null
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
}: TrackRecommendationBannerProps) {
  return (
    <section className="border-b border-cyan-200/80 bg-[linear-gradient(90deg,rgba(236,254,255,0.95),rgba(248,250,252,0.95))] px-4 py-3 text-sm text-slate-700">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-cyan-200 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-cyan-800">
          <Compass className="h-3.5 w-3.5" />
          {trackLabels[learningTrack]} Track
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-slate-900">{branchOption.label}</p>
          <p className="text-slate-600">
            {branchOption.description} Change the track in the header any time without leaving the lesson.
          </p>
        </div>
        {selectedBranchId ? (
          <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
            Saved for this lesson
          </div>
        ) : null}
      </div>
    </section>
  )
}