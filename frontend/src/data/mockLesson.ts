import type { LessonDetail } from '../types/learning'

export const mockLesson: LessonDetail = {
  id: 'lesson-js-loops-1',
  title: 'JavaScript Loops: Controlled Repetition',
  description:
    'Use for loops to transform arrays and build predictable output. Focus on readable iteration and safe indexing.',
  xpReward: 120,
  sections: [
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
  ],
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
}
