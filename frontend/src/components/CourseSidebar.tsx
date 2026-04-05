import clsx from 'clsx'
import { CheckCircle2, GitBranch } from 'lucide-react'
import type { CourseSection } from '../types/learning'

type CourseSidebarProps = {
  courseTitle: string
  sections: CourseSection[]
  activeLessonId: string
  onSelectLesson: (lessonId: string) => void
  branchedLessonIds?: string[]
}

export function CourseSidebar({
  courseTitle,
  sections,
  activeLessonId,
  onSelectLesson,
  branchedLessonIds = [],
}: CourseSidebarProps) {
  return (
    <aside className="hidden border-r border-slate-300/70 bg-slate-50/80 lg:block lg:w-72">
      <div className="border-b border-slate-300/70 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Course</p>
        <h2 className="mt-2 text-sm font-semibold text-slate-900">{courseTitle}</h2>
      </div>

      <div className="space-y-6 p-4">
        {sections.map((section) => (
          <section key={section.id}>
            <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
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
                      ? 'bg-cyan-900 text-white'
                      : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900',
                  )}
                >
                  <div className="flex items-center gap-1">
                    {branchedLessonIds.includes(item.id) && (
                      <GitBranch className="h-3.5 w-3.5 text-blue-500" />
                    )}
                    <span>{item.title}</span>
                  </div>
                  {item.completed ? <CheckCircle2 className="h-4 w-4" /> : null}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  )
}
