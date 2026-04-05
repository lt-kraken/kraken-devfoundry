import Editor, { type BeforeMount } from '@monaco-editor/react'
import type { ResolvedTheme } from '../hooks/useTheme'

const DARK_THEME_NAME = 'devfoundry-dark'

const handleBeforeMount: BeforeMount = (monaco) => {
  monaco.editor.defineTheme(DARK_THEME_NAME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
      { token: 'keyword', foreground: '7dd3fc' },
      { token: 'string', foreground: '5eead4' },
      { token: 'number', foreground: 'fbbf24' },
      { token: 'type', foreground: '67e8f9' },
    ],
    colors: {
      'editor.background': '#0f1729',
      'editor.foreground': '#e2e8f0',
      'editor.lineHighlightBackground': '#1e293b',
      'editor.selectionBackground': '#06b6d430',
      'editor.inactiveSelectionBackground': '#06b6d418',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#94a3b8',
      'editorCursor.foreground': '#06b6d4',
      'editorIndentGuide.background': '#1e293b',
      'editorIndentGuide.activeBackground': '#334155',
      'editor.selectionHighlightBackground': '#06b6d415',
      'editorBracketMatch.background': '#06b6d420',
      'editorBracketMatch.border': '#06b6d440',
      'editorWidget.background': '#111827',
      'editorWidget.border': '#1e293b',
      'editorSuggestWidget.background': '#111827',
      'editorSuggestWidget.border': '#1e293b',
      'editorSuggestWidget.selectedBackground': '#1e293b',
      'scrollbarSlider.background': '#334155',
      'scrollbarSlider.hoverBackground': '#475569',
      'scrollbarSlider.activeBackground': '#64748b',
    },
  })
}

type CodeEditorPanelProps = {
  language: string
  value: string
  onChange: (value: string) => void
  resolvedTheme?: ResolvedTheme
}

export function CodeEditorPanel({ language, value, onChange, resolvedTheme = 'light' }: CodeEditorPanelProps) {
  const lineCount = value.length > 0 ? value.split('\n').length : 1
  const charCount = value.length

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={value}
          onChange={(nextValue) => onChange(nextValue ?? '')}
          beforeMount={handleBeforeMount}
          options={{
            automaticLayout: true,
            fontSize: 14,
            fontFamily: "'JetBrains Mono', monospace",
            minimap: { enabled: false },
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
          }}
          theme={resolvedTheme === 'dark' ? DARK_THEME_NAME : 'vs'}
        />
      </div>

      <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-3 py-1.5 text-[11px] text-[var(--text-muted)]">
        <span className="font-medium uppercase tracking-[0.12em]">{language}</span>
        <span>
          {lineCount} lines | {charCount} chars
        </span>
      </div>
    </div>
  )
}
