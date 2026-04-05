import clsx from 'clsx'
import { CheckCircle2, GitBranch } from 'lucide-react'
import type { CourseSection } from '../types/learning'

type CourseSidebarProps = {
  courseTitle: string
  sections: CourseSection[]
  activeLessonId: string
  onSelectLesson: (lessonId: string) => void
  branchedLessonIds?: string[]
  variant?: 'desktop' | 'mobile'
}

export function CourseSidebar({
  courseTitle,
  sections,
  activeLessonId,
  onSelectLesson,
  branchedLessonIds = [],
  variant = 'desktop',
}: CourseSidebarProps) {
  const sidebarClassName =
    variant === 'desktop'
      ? 'hidden border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:block lg:w-72'
      : 'h-full border-r border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[var(--shadow-elevated)]'

  return (
    <aside className={sidebarClassName}>
      <div className="border-b border-[var(--border-subtle)] px-5 py-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-muted)]">Course</p>
        <h2 className="mt-2 text-sm font-semibold text-[var(--text-primary)]">{courseTitle}</h2>
      </div>

      <div className="space-y-6 p-4">
        {sections.map((section) => (
          <section key={section.id}>
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              {section.title}
            </p>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectLesson(item.id)}
                  className={clsx(
                    'flex h-10 w-full items-center justify-between rounded-md px-3 text-left text-sm transition',
                    item.id === activeLessonId
                      ? 'border-l-2 border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10 text-[var(--accent-cyan)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)]',
                  )}
                >
                  <div className="flex items-center gap-1">
                    {branchedLessonIds.includes(item.id) && (
                      <GitBranch className="h-3.5 w-3.5 text-[var(--accent-cyan)]" />
                    )}
                    <span>{item.title}</span>
                  </div>
                  {item.completed ? <CheckCircle2 className="h-4 w-4 text-[var(--accent-emerald)]" /> : null}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  )
}
