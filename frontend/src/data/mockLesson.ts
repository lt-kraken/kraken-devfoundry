import type { LessonDetail } from '../types/learning'

const courseSectionsTemplate = [
  {
    id: 'intro',
    title: 'Introduction',
    items: [
      { id: 'lesson-js-loops-1', title: 'Controlled Repetition', completed: false },
      { id: 'lesson-js-loops-2', title: 'Nested Iteration Patterns', completed: false },
    ],
  },
  {
    id: 'practice',
    title: 'Practice',
    items: [{ id: 'lesson-js-loops-3', title: 'Array Scoreboard', completed: false }],
  },
]

export const mockLessons: LessonDetail[] = [
  {
    id: 'lesson-js-loops-1',
    title: 'JavaScript Loops: Controlled Repetition',
    description:
      'Use for loops to transform arrays and build predictable output. Focus on readable iteration and safe indexing.',
    xpReward: 120,
    sections: structuredClone(courseSectionsTemplate),
    steps: [
      { id: 'step-1', label: 'Create a for loop over scores', completed: false },
      { id: 'step-2', label: 'Build a summary string from each value', completed: false },
      { id: 'step-3', label: 'Return the final output', completed: false },
    ],
    hints: [
      {
        id: 'hint-1',
        title: 'Need a starting point?',
        content:
          'Start with let summary = []; then push each formatted score inside the loop and join at the end.',
      },
      {
        id: 'hint-2',
        title: 'Formatting output',
        content:
          "Use template strings like `${index + 1}. Score: ${score}` to keep output readable.",
      },
    ],
    files: [
      {
        id: 'file-1',
        path: 'src/main.js',
        language: 'javascript',
        starterContent: `const scores = [12, 30, 18, 42]\n\nfunction buildSummary(values) {\n  // TODO: iterate and produce one string output\n  return ''\n}\n\nconsole.log(buildSummary(scores))\n`,
        content: `const scores = [12, 30, 18, 42]\n\nfunction buildSummary(values) {\n  // TODO: iterate and produce one string output\n  return ''\n}\n\nconsole.log(buildSummary(scores))\n`,
      },
      {
        id: 'file-2',
        path: 'README.md',
        language: 'json',
        starterContent: '{\n  "goal": "Return a summary string with one line per score"\n}\n',
        content: '{\n  "goal": "Return a summary string with one line per score"\n}\n',
      },
    ],
    activeFileId: 'file-1',
  },
  {
    id: 'lesson-js-loops-2',
    title: 'JavaScript Loops: Nested Iteration Patterns',
    description: 'Use nested loops to process row-based values and produce readable summaries.',
    xpReward: 140,
    sections: structuredClone(courseSectionsTemplate),
    steps: [
      { id: 'step-1', label: 'Use nested loops for each row', completed: false },
      { id: 'step-2', label: 'Compute each row total', completed: false },
      { id: 'step-3', label: 'Return one line per row', completed: false },
    ],
    hints: [
      {
        id: 'hint-1',
        title: 'Nested loops',
        content: 'Loop outer rows first, then inner values to build a row total.',
      },
    ],
    files: [
      {
        id: 'file-1',
        path: 'src/main.js',
        language: 'javascript',
        starterContent: `const matrix = [[3, 5], [4, 2], [10, 1]]\n\nfunction buildRowTotals(rows) {\n  // TODO: nested loop and summarize row totals\n  return ''\n}\n\nconsole.log(buildRowTotals(matrix))\n`,
        content: `const matrix = [[3, 5], [4, 2], [10, 1]]\n\nfunction buildRowTotals(rows) {\n  // TODO: nested loop and summarize row totals\n  return ''\n}\n\nconsole.log(buildRowTotals(matrix))\n`,
      },
    ],
    activeFileId: 'file-1',
  },
  {
    id: 'lesson-js-loops-3',
    title: 'JavaScript Practice: Array Scoreboard',
    description: 'Sort players by score and output a readable ranked scoreboard.',
    xpReward: 160,
    sections: structuredClone(courseSectionsTemplate),
    steps: [
      { id: 'step-1', label: 'Sort players descending by score', completed: false },
      { id: 'step-2', label: 'Format rank, name, and score', completed: false },
      { id: 'step-3', label: 'Return final scoreboard output', completed: false },
    ],
    hints: [
      {
        id: 'hint-1',
        title: 'Sorting',
        content: 'Use a copy of the array before sorting so starter values remain intact.',
      },
    ],
    files: [
      {
        id: 'file-1',
        path: 'src/main.js',
        language: 'javascript',
        starterContent: `const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }]\n\nfunction buildScoreboard(entries) {\n  // TODO: rank and format output\n  return ''\n}\n\nconsole.log(buildScoreboard(players))\n`,
        content: `const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }]\n\nfunction buildScoreboard(entries) {\n  // TODO: rank and format output\n  return ''\n}\n\nconsole.log(buildScoreboard(players))\n`,
      },
    ],
    activeFileId: 'file-1',
  },
]

export const mockLesson = mockLessons[0]

export function getMockLessonById(lessonId: string): LessonDetail {
  const match = mockLessons.find((lesson) => lesson.id === lessonId)
  return structuredClone(match ?? mockLesson)
}

export function getMockNextLessonId(lessonId: string): string | undefined {
  const index = mockLessons.findIndex((lesson) => lesson.id === lessonId)
  if (index < 0 || index === mockLessons.length - 1) {
    return undefined
  }

  return mockLessons[index + 1]?.id
}
