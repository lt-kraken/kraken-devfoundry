import type { ReactNode } from 'react'
import { CourseSidebar } from '../components/CourseSidebar'
import { Topbar } from '../components/Topbar'
import type { CourseSection } from '../types/learning'

type LearningLayoutProps = {
  xp: number
  courseTitle: string
  sections: CourseSection[]
  activeLessonId: string
  onSelectLesson: (lessonId: string) => void
  children: ReactNode
}

export function LearningLayout({
  xp,
  courseTitle,
  sections,
  activeLessonId,
  onSelectLesson,
  children,
}: LearningLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_top,#f8fafc,#eef2f7)] text-slate-900">
      <Topbar xp={xp} />
      <main className="flex min-h-0 flex-1">
        <CourseSidebar
          courseTitle={courseTitle}
          sections={sections}
          activeLessonId={activeLessonId}
          onSelectLesson={onSelectLesson}
        />
        <section className="min-h-0 flex-1">{children}</section>
      </main>
    </div>
  )
}
