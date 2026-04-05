import type { ReactNode } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { CourseSidebar } from '../components/CourseSidebar'
import { Topbar } from '../components/Topbar'
import type { CourseSection, LearningTrack } from '../types/learning'
import type { ThemePreference } from '../hooks/useTheme'

type LearningLayoutProps = {
  xp: number
  courseTitle: string
  learningTrack: LearningTrack
  onChangeLearningTrack: (track: LearningTrack) => void
  sections: CourseSection[]
  activeLessonId: string
  onSelectLesson: (lessonId: string) => void
  branchedLessonIds?: string[]
  theme: ThemePreference
  onChangeTheme: (theme: ThemePreference) => void
  children: ReactNode
}

export function LearningLayout({
  xp,
  courseTitle,
  learningTrack,
  onChangeLearningTrack,
  sections,
  activeLessonId,
  onSelectLesson,
  branchedLessonIds = [],
  theme,
  onChangeTheme,
  children,
}: LearningLayoutProps) {
  const [isMobileLessonNavOpen, setIsMobileLessonNavOpen] = useState(false)

  const handleSelectLesson = (lessonId: string) => {
    onSelectLesson(lessonId)
    setIsMobileLessonNavOpen(false)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Topbar
        xp={xp}
        learningTrack={learningTrack}
        onChangeLearningTrack={onChangeLearningTrack}
        isLessonNavOpen={isMobileLessonNavOpen}
        onToggleLessonNav={() => setIsMobileLessonNavOpen((current) => !current)}
        theme={theme}
        onChangeTheme={onChangeTheme}
      />

      {isMobileLessonNavOpen ? (
        <button
          type="button"
          aria-label="Close lesson navigation"
          onClick={() => setIsMobileLessonNavOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
        />
      ) : null}

      <div
        className={clsx(
          'fixed inset-y-16 left-0 z-40 w-[min(20rem,86vw)] shadow-[var(--shadow-elevated)] transition-transform duration-200 lg:hidden',
          isMobileLessonNavOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <CourseSidebar
          variant="mobile"
          courseTitle={courseTitle}
          sections={sections}
          activeLessonId={activeLessonId}
          onSelectLesson={handleSelectLesson}
          branchedLessonIds={branchedLessonIds}
        />
      </div>

      <main className="flex min-h-0 flex-1">
        <CourseSidebar
          variant="desktop"
          courseTitle={courseTitle}
          sections={sections}
          activeLessonId={activeLessonId}
          onSelectLesson={handleSelectLesson}
          branchedLessonIds={branchedLessonIds}
        />
        <section className="min-h-0 min-w-0 flex-1">{children}</section>
      </main>
    </div>
  )
}
