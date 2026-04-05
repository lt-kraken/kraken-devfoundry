import type { LearningTrack, LessonDetail } from '../types/learning'

type LessonTrackVariant = Pick<LessonDetail, 'description' | 'steps' | 'hints' | 'files' | 'referenceSolution'>

type MockLessonDetail = LessonDetail & {
  trackVariants?: Partial<Record<LearningTrack, LessonTrackVariant>>
}

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

export const mockLessons: MockLessonDetail[] = [
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
    referenceSolution:
      "function buildSummary(values) {\n  const lines = [];\n  for (let i = 0; i < values.length; i++) {\n    lines.push(`${i + 1}. Score: ${values[i]}`);\n  }\n  return lines.join('\\n');\n}",
    branchPoint: {
      question: 'Preferred solution path',
      options: [
        {
          id: 'guided-loop-builder',
          label: 'Guided Loop Builder',
          description: 'Stay explicit with one clear loop and a simple result array.',
          difficulty: 'beginner',
        },
        {
          id: 'summary-array-pattern',
          label: 'Summary Array Pattern',
          description: 'Build each row of output in an array, then join once at the end.',
          difficulty: 'intermediate',
        },
        {
          id: 'functional-summary-pass',
          label: 'Functional Summary Pass',
          description: 'Lean on map and join for a shorter, more composable solution.',
          difficulty: 'advanced',
        },
      ],
    },
    codeAnnotations: [
      {
        lineNumber: 3,
        token: 'function',
        explanation:
          'Functions are reusable blocks of code. This function takes an array of values and processes them.',
        alternatives: 'You could also use an arrow function: const buildSummary = (values) => { ... }',
      },
      {
        lineNumber: 4,
        token: 'for',
        explanation:
          'The for loop iterates through each element in the array. Start from index 0 and continue until you reach the array length.',
        alternatives:
          'Consider using forEach or map for a more functional approach: values.forEach((value, index) => { ... })',
      },
      {
        lineNumber: 5,
        token: 'push',
        explanation:
          'push() adds a new element to the end of an array. Each formatted score is added to the result array.',
        alternatives:
          'You could build a string directly: result += `${i + 1}. Score: ${scores[i]}\\n`',
      },
    ],
    trackVariants: {
      beginner: {
        description:
          'Use one explicit loop to transform scores into readable output. This track keeps the control flow visible and deliberate.',
        steps: [
          { id: 'step-1', label: 'Write one loop that visits each score', completed: false },
          { id: 'step-2', label: 'Push one formatted line into a result array', completed: false },
          { id: 'step-3', label: 'Join and return the final summary', completed: false },
        ],
        hints: [
          {
            id: 'hint-1',
            title: 'Start small',
            content: 'Create an empty lines array, then use one loop to push a formatted string for each score.',
          },
          {
            id: 'hint-2',
            title: 'Finish once',
            content: 'Keep the join at the end so the loop only worries about building individual lines.',
          },
        ],
        files: [
          {
            id: 'file-1',
            path: 'src/main.js',
            language: 'javascript',
            starterContent: `const scores = [12, 30, 18, 42]\n\nfunction buildSummary(values) {\n  const lines = []\n\n  for (const value of values) {\n    // TODO: push one formatted line into lines\n  }\n\n  return lines.join('\\n')\n}\n\nconsole.log(buildSummary(scores))\n`,
            content: `const scores = [12, 30, 18, 42]\n\nfunction buildSummary(values) {\n  const lines = []\n\n  for (const value of values) {\n    // TODO: push one formatted line into lines\n  }\n\n  return lines.join('\\n')\n}\n\nconsole.log(buildSummary(scores))\n`,
          },
          {
            id: 'file-2',
            path: 'README.md',
            language: 'json',
            starterContent: '{\n  "goal": "Use one clear loop and build the summary line by line"\n}\n',
            content: '{\n  "goal": "Use one clear loop and build the summary line by line"\n}\n',
          },
        ],
        referenceSolution:
          "function buildSummary(values) {\n  const lines = [];\n  for (const value of values) {\n    lines.push(`${lines.length + 1}. Score: ${value}`);\n  }\n  return lines.join('\\n');\n}",
      },
      advanced: {
        description:
          'Use a compact functional pass to build the output. This track favors composition over manual bookkeeping.',
        steps: [
          { id: 'step-1', label: 'Transform the scores with a concise iteration pattern', completed: false },
          { id: 'step-2', label: 'Format each output line during the transformation', completed: false },
          { id: 'step-3', label: 'Join and return the final summary', completed: false },
        ],
        hints: [
          {
            id: 'hint-1',
            title: 'Functional pass',
            content: 'map gives you both the value and index, which is enough to format every output line.',
          },
          {
            id: 'hint-2',
            title: 'Keep it composable',
            content: 'Return the joined result directly from the transformation pipeline instead of managing a mutable array yourself.',
          },
        ],
        files: [
          {
            id: 'file-1',
            path: 'src/main.js',
            language: 'javascript',
            starterContent: `const scores = [12, 30, 18, 42]\n\nfunction buildSummary(values) {\n  // TODO: use map and join to return the summary\n  return ''\n}\n\nconsole.log(buildSummary(scores))\n`,
            content: `const scores = [12, 30, 18, 42]\n\nfunction buildSummary(values) {\n  // TODO: use map and join to return the summary\n  return ''\n}\n\nconsole.log(buildSummary(scores))\n`,
          },
          {
            id: 'file-2',
            path: 'README.md',
            language: 'json',
            starterContent: '{\n  "goal": "Use a concise functional pass to build the summary string"\n}\n',
            content: '{\n  "goal": "Use a concise functional pass to build the summary string"\n}\n',
          },
        ],
        referenceSolution:
          "function buildSummary(values) {\n  return values\n    .map((value, index) => `${index + 1}. Score: ${value}`)\n    .join('\\n');\n}",
      },
    },
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
    referenceSolution:
      "function buildRowTotals(rows) {\n  const lines = [];\n  for (let i = 0; i < rows.length; i++) {\n    let total = 0;\n    for (let j = 0; j < rows[i].length; j++) {\n      total += rows[i][j];\n    }\n    lines.push(`Row ${i + 1}: ${total}`);\n  }\n  return lines.join('\\n');\n}",
    branchPoint: {
      question: 'Preferred solution path',
      options: [
        {
          id: 'row-walkthrough',
          label: 'Row-by-Row Walkthrough',
          description: 'Use one outer loop and one inner loop with explicit running totals.',
          difficulty: 'beginner',
        },
        {
          id: 'loop-approach',
          label: 'Manual Nested Loops',
          description: 'Solve using traditional for loops for full control',
          difficulty: 'intermediate',
        },
        {
          id: 'functional-approach',
          label: 'Functional Methods',
          description: 'Use map/reduce for a more functional style',
          difficulty: 'advanced',
        },
      ],
    },
    trackVariants: {
      beginner: {
        description:
          'Use two visible loops and a running total for each row. This track favors clarity over compression.',
        steps: [
          { id: 'step-1', label: 'Start with one outer loop for rows', completed: false },
          { id: 'step-2', label: 'Add an inner loop that updates a running total', completed: false },
          { id: 'step-3', label: 'Format and return one line per row', completed: false },
        ],
        hints: [
          {
            id: 'hint-1',
            title: 'Two loops',
            content: 'Open the outer loop first, then place the row total and inner loop inside it so each row starts fresh.',
          },
          {
            id: 'hint-2',
            title: 'One total per row',
            content: 'Declare total inside the outer loop so each row gets its own accumulator.',
          },
        ],
        files: [
          {
            id: 'file-1',
            path: 'src/main.js',
            language: 'javascript',
            starterContent: `const matrix = [[3, 5], [4, 2], [10, 1]]\n\nfunction buildRowTotals(rows) {\n  const lines = []\n\n  for (const row of rows) {\n    let total = 0\n    // TODO: loop over row and update total\n    lines.push(\`Row total: \${total}\`)\n  }\n\n  return lines.join('\\n')\n}\n\nconsole.log(buildRowTotals(matrix))\n`,
            content: `const matrix = [[3, 5], [4, 2], [10, 1]]\n\nfunction buildRowTotals(rows) {\n  const lines = []\n\n  for (const row of rows) {\n    let total = 0\n    // TODO: loop over row and update total\n    lines.push(\`Row total: \${total}\`)\n  }\n\n  return lines.join('\\n')\n}\n\nconsole.log(buildRowTotals(matrix))\n`,
          },
        ],
        referenceSolution:
          "function buildRowTotals(rows) {\n  const lines = [];\n  for (const row of rows) {\n    let total = 0;\n    for (const value of row) {\n      total += value;\n    }\n    lines.push(`Row total: ${total}`);\n  }\n  return lines.join('\\n');\n}",
      },
      advanced: {
        description:
          'Use a functional transformation to compute row totals and format the result. This track prefers composable operations.',
        steps: [
          { id: 'step-1', label: 'Map each row into a computed total', completed: false },
          { id: 'step-2', label: 'Format the row output during the transformation', completed: false },
          { id: 'step-3', label: 'Join and return the final summary', completed: false },
        ],
        hints: [
          {
            id: 'hint-1',
            title: 'Map rows',
            content: 'Map each row into one output line, and use reduce inside that map callback to compute the row total.',
          },
          {
            id: 'hint-2',
            title: 'One join at the end',
            content: 'Once each row becomes a string, join the final array with newline characters.',
          },
        ],
        files: [
          {
            id: 'file-1',
            path: 'src/main.js',
            language: 'javascript',
            starterContent: `const matrix = [[3, 5], [4, 2], [10, 1]]\n\nfunction buildRowTotals(rows) {\n  // TODO: use map and reduce to return one line per row\n  return ''\n}\n\nconsole.log(buildRowTotals(matrix))\n`,
            content: `const matrix = [[3, 5], [4, 2], [10, 1]]\n\nfunction buildRowTotals(rows) {\n  // TODO: use map and reduce to return one line per row\n  return ''\n}\n\nconsole.log(buildRowTotals(matrix))\n`,
          },
        ],
        referenceSolution:
          "function buildRowTotals(rows) {\n  return rows\n    .map((row, index) => `Row ${index + 1}: ${row.reduce((total, value) => total + value, 0)}`)\n    .join('\\n');\n}",
      },
    },
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
    referenceSolution:
      "function buildScoreboard(entries) {\n  return [...entries]\n    .sort((a, b) => b.score - a.score)\n    .map((entry, index) => `${index + 1}. ${entry.name} - ${entry.score}`)\n    .join('\\n');\n}",
    branchPoint: {
      question: 'Preferred solution path',
      options: [
        {
          id: 'rank-then-print',
          label: 'Rank Then Print',
          description: 'Sort first, then format each ranked player with one straightforward pass.',
          difficulty: 'beginner',
        },
        {
          id: 'pipeline-scoreboard',
          label: 'Pipeline Scoreboard',
          description: 'Chain sorting and formatting to keep the solution compact and readable.',
          difficulty: 'intermediate',
        },
        {
          id: 'reducer-scoreboard',
          label: 'Reducer Scoreboard',
          description: 'Compose the final scoreboard through a denser functional pipeline.',
          difficulty: 'advanced',
        },
      ],
    },
    trackVariants: {
      beginner: {
        description:
          'Sort first, then build the scoreboard one line at a time. This track keeps each step explicit.',
        steps: [
          { id: 'step-1', label: 'Copy and sort players by descending score', completed: false },
          { id: 'step-2', label: 'Loop over the ranked list and push one line per player', completed: false },
          { id: 'step-3', label: 'Join and return the final scoreboard', completed: false },
        ],
        hints: [
          {
            id: 'hint-1',
            title: 'Keep the input safe',
            content: 'Copy the array before sorting so you do not mutate the original players list.',
          },
          {
            id: 'hint-2',
            title: 'Build lines',
            content: 'After sorting, push one formatted string per player into a lines array and join once at the end.',
          },
        ],
        files: [
          {
            id: 'file-1',
            path: 'src/main.js',
            language: 'javascript',
            starterContent: `const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }]\n\nfunction buildScoreboard(entries) {\n  const rankedPlayers = [...entries].sort((a, b) => b.score - a.score)\n  const lines = []\n\n  // TODO: push one line per ranked player\n  return lines.join('\\n')\n}\n\nconsole.log(buildScoreboard(players))\n`,
            content: `const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }]\n\nfunction buildScoreboard(entries) {\n  const rankedPlayers = [...entries].sort((a, b) => b.score - a.score)\n  const lines = []\n\n  // TODO: push one line per ranked player\n  return lines.join('\\n')\n}\n\nconsole.log(buildScoreboard(players))\n`,
          },
        ],
        referenceSolution:
          "function buildScoreboard(entries) {\n  const rankedPlayers = [...entries].sort((a, b) => b.score - a.score);\n  const lines = [];\n  for (let i = 0; i < rankedPlayers.length; i++) {\n    const player = rankedPlayers[i];\n    lines.push(`${i + 1}. ${player.name} - ${player.score}`);\n  }\n  return lines.join('\\n');\n}",
      },
      advanced: {
        description:
          'Use a composable scoreboard pipeline with non-mutating transforms. This track favors denser functional code.',
        steps: [
          { id: 'step-1', label: 'Create a non-mutating descending scoreboard pipeline', completed: false },
          { id: 'step-2', label: 'Map rank, name, and score into display lines', completed: false },
          { id: 'step-3', label: 'Return the joined scoreboard string', completed: false },
        ],
        hints: [
          {
            id: 'hint-1',
            title: 'One pipeline',
            content: 'A non-mutating sort followed by map and join is enough for the whole scoreboard.',
          },
          {
            id: 'hint-2',
            title: 'Use the index',
            content: 'The map callback index gives you the rank automatically, so you do not need a separate counter.',
          },
        ],
        files: [
          {
            id: 'file-1',
            path: 'src/main.js',
            language: 'javascript',
            starterContent: `const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }]\n\nfunction buildScoreboard(entries) {\n  // TODO: use a functional pipeline to build the scoreboard\n  return ''\n}\n\nconsole.log(buildScoreboard(players))\n`,
            content: `const players = [{ name: 'Ari', score: 18 }, { name: 'Mina', score: 27 }, { name: 'Rex', score: 22 }]\n\nfunction buildScoreboard(entries) {\n  // TODO: use a functional pipeline to build the scoreboard\n  return ''\n}\n\nconsole.log(buildScoreboard(players))\n`,
          },
        ],
        referenceSolution:
          "function buildScoreboard(entries) {\n  return [...entries]\n    .toSorted((a, b) => b.score - a.score)\n    .map((entry, index) => `${index + 1}. ${entry.name} - ${entry.score}`)\n    .join('\\n');\n}",
      },
    },
  },
]

export const mockLesson = mockLessons[0]

function applyTrackVariant(lesson: MockLessonDetail, learningTrack: LearningTrack): LessonDetail {
  const variant = lesson.trackVariants?.[learningTrack]
  const nextFiles = (variant?.files ?? lesson.files).map((file) => ({
    ...file,
    content: file.starterContent,
  }))

  return structuredClone({
    ...lesson,
    description: variant?.description ?? lesson.description,
    steps: variant?.steps ?? lesson.steps,
    hints: variant?.hints ?? lesson.hints,
    files: nextFiles,
    referenceSolution: variant?.referenceSolution ?? lesson.referenceSolution,
  })
}

export function getMockLessonById(
  lessonId: string,
  learningTrack: LearningTrack = 'intermediate',
): LessonDetail {
  const match = mockLessons.find((lesson) => lesson.id === lessonId)
  return applyTrackVariant(match ?? mockLesson, learningTrack)
}

export function getMockHint(
  lessonId: string,
  stepId: string,
  learningTrack: LearningTrack = 'intermediate',
): string {
  const lesson = getMockLessonById(lessonId, learningTrack)
  const stepIndex = Math.max(Number.parseInt(stepId.replace('step-', ''), 10) - 1, 0)
  const hint = lesson.hints[stepIndex] ?? lesson.hints[lesson.hints.length - 1]
  return hint?.content ?? 'Break the task into one small transformation at a time.'
}

export function getMockNextLessonId(lessonId: string): string | undefined {
  const index = mockLessons.findIndex((lesson) => lesson.id === lessonId)
  if (index < 0 || index === mockLessons.length - 1) {
    return undefined
  }

  return mockLessons[index + 1]?.id
}

export function getBranchedLessonIds(): string[] {
  return mockLessons.filter((lesson) => lesson.branchPoint).map((lesson) => lesson.id)
}
