import Editor from '@monaco-editor/react'

type CodeEditorPanelProps = {
  language: string
  value: string
  onChange: (value: string) => void
}

export function CodeEditorPanel({ language, value, onChange }: CodeEditorPanelProps) {
  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      value={value}
      onChange={(nextValue) => onChange(nextValue ?? '')}
      options={{
        fontSize: 14,
        minimap: { enabled: false },
        lineNumbersMinChars: 3,
        scrollBeyondLastLine: false,
        padding: { top: 12, bottom: 12 },
      }}
      theme="vs"
    />
  )
}
