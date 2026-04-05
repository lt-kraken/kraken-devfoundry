import clsx from 'clsx'
import { BookOpenText, Gauge, Trophy } from 'lucide-react'
import type { LearningTrack } from '../types/learning'

type TopbarProps = {
  xp: number
  learningTrack: LearningTrack
  onChangeLearningTrack: (track: LearningTrack) => void
}

const navItems = ['Courses', 'Projects', 'Templates']
const learningTracks: LearningTrack[] = ['beginner', 'intermediate', 'advanced']

export function Topbar({ xp, learningTrack, onChangeLearningTrack }: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-300/70 bg-white/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 text-slate-900">
          <BookOpenText className="h-5 w-5 text-cyan-700" />
          <span className="font-semibold tracking-tight">DevFoundry</span>
        </div>

        <nav className="hidden gap-6 text-sm text-slate-600 md:flex">
          {navItems.map((item) => (
            <button key={item} className="transition hover:text-slate-900" type="button">
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1 rounded-full border border-slate-300 bg-white/90 p-1 md:flex">
          <div className="flex items-center gap-1 px-2 text-xs font-medium text-slate-500">
            <Gauge className="h-3.5 w-3.5" />
            Track
          </div>
          {learningTracks.map((track) => (
            <button
              key={track}
              type="button"
              onClick={() => onChangeLearningTrack(track)}
              className={clsx(
                'rounded-full px-3 py-1 text-xs font-medium capitalize transition',
                learningTrack === track
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
              )}
            >
              {track}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full border border-cyan-700/20 bg-cyan-700/10 px-3 py-1 text-xs font-medium text-cyan-900">
          <Trophy className="h-3.5 w-3.5" />
          {xp} XP
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
          LN
        </div>
      </div>
    </header>
  )
}
