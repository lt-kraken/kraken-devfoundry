import Editor from '@monaco-editor/react'

type CodeEditorPanelProps = {
  language: string
  value: string
  onChange: (value: string) => void
}

export function CodeEditorPanel({ language, value, onChange }: CodeEditorPanelProps) {
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
          options={{
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            lineNumbersMinChars: 3,
            scrollBeyondLastLine: false,
            tabSize: 2,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
          }}
          theme="vs"
        />
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-600">
        <span className="font-medium uppercase tracking-[0.12em]">{language}</span>
        <span>
          {lineCount} lines | {charCount} chars
        </span>
      </div>
    </div>
  )
}
