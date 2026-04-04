export type CourseSection = {
  id: string
  title: string
  items: LessonNavItem[]
}

export type LessonNavItem = {
  id: string
  title: string
  completed: boolean
}

export type LessonStep = {
  id: string
  label: string
  completed: boolean
}

export type LessonHint = {
  id: string
  title: string
  content: string
}

export type LessonFile = {
  id: string
  path: string
  language: 'javascript' | 'typescript' | 'html' | 'css' | 'json'
  content: string
  starterContent: string
}

export type LessonDetail = {
  id: string
  title: string
  description: string
  xpReward: number
  sections: CourseSection[]
  steps: LessonStep[]
  hints: LessonHint[]
  files: LessonFile[]
  activeFileId: string
}

export type RunResult = {
  status: 'idle' | 'running' | 'success' | 'failure'
  output: string[]
  runtimeMs?: number
}

export type SubmitProgressResult = {
  xpDelta: number
  totalXp: number
  nextLessonId?: string
  lessonCompleted: boolean
  courseCompleted: boolean
  message: string
}
