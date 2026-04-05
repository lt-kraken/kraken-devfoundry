import clsx from 'clsx'
import { BookOpenText, Gauge, Menu, Trophy, Sun, Monitor, Moon } from 'lucide-react'
import type { LearningTrack } from '../types/learning'
import type { ThemePreference } from '../hooks/useTheme'

type TopbarProps = {
  xp: number
  learningTrack: LearningTrack
  onChangeLearningTrack: (track: LearningTrack) => void
  isLessonNavOpen: boolean
  onToggleLessonNav: () => void
  theme: ThemePreference
  onChangeTheme: (theme: ThemePreference) => void
}

const navItems = ['Courses', 'Projects', 'Templates']
const learningTracks: LearningTrack[] = ['beginner', 'intermediate', 'advanced']

const themeOptions: { value: ThemePreference; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'system', icon: Monitor, label: 'System' },
  { value: 'dark', icon: Moon, label: 'Dark' },
]

export function Topbar({
  xp,
  learningTrack,
  onChangeLearningTrack,
  isLessonNavOpen,
  onToggleLessonNav,
  theme,
  onChangeTheme,
}: TopbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 px-4 backdrop-blur-lg md:px-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLessonNav}
            aria-label="Toggle lesson navigation"
            aria-expanded={isLessonNavOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
          <BookOpenText className="h-5 w-5 text-[var(--accent-cyan)]" />
          <span className="font-semibold tracking-tight text-[var(--text-primary)]">DevFoundry</span>
        </div>

        <nav className="hidden gap-6 text-sm text-[var(--text-secondary)] md:flex">
          {navItems.map((item) => (
            <button key={item} className="transition hover:text-[var(--text-primary)]" type="button">
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <div className="flex items-center gap-0.5 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface-raised)] p-1">
          {themeOptions.map((opt) => {
            const Icon = opt.icon
            const isActive = theme === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onChangeTheme(opt.value)}
                aria-label={`${opt.label} theme`}
                className={clsx(
                  'inline-flex h-7 w-7 items-center justify-center rounded-full transition',
                  isActive
                    ? 'bg-[var(--accent-cyan)]/15 text-[var(--accent-cyan)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]',
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            )
          })}
        </div>

        {/* Track selector (desktop) */}
        <div className="hidden items-center gap-1 rounded-full border border-[var(--border-default)] bg-[var(--bg-surface-raised)] p-1 md:flex">
          <div className="flex items-center gap-1 px-2 text-xs font-medium text-[var(--text-muted)]">
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
                  ? 'bg-[var(--accent-cyan)] text-slate-950 shadow-[var(--glow-cyan)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-overlay)] hover:text-[var(--text-primary)]',
              )}
            >
              {track}
            </button>
          ))}
        </div>
        {/* Track selector (mobile) */}
        <div className="flex items-center rounded-md border border-[var(--border-default)] bg-[var(--bg-surface-raised)] px-2 py-1 md:hidden">
          <label htmlFor="mobile-track" className="sr-only">
            Learning track
          </label>
          <select
            id="mobile-track"
            value={learningTrack}
            onChange={(event) => onChangeLearningTrack(event.target.value as LearningTrack)}
            className="bg-transparent text-xs font-medium capitalize text-[var(--text-secondary)] outline-none"
          >
            {learningTracks.map((track) => (
              <option key={track} value={track} className="capitalize">
                {track}
              </option>
            ))}
          </select>
        </div>
        {/* XP badge */}
        <div className="flex items-center gap-2 rounded-full border border-[var(--accent-amber)]/20 bg-[var(--accent-amber)]/10 px-3 py-1 text-xs font-medium text-[var(--accent-amber)]">
          <Trophy className="h-3.5 w-3.5" />
          {xp} XP
        </div>
        {/* Avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 text-xs font-semibold text-white">
          LN
        </div>
      </div>
    </header>
  )
}
