import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { FileCode2, FileJson2, FileText, Search } from 'lucide-react'
import type { LessonFile } from '../types/learning'

type FileExplorerProps = {
  files: LessonFile[]
  activeFileId: string
  onSelect: (fileId: string) => void
}

export function FileExplorer({ files, activeFileId, onSelect }: FileExplorerProps) {
  const [query, setQuery] = useState('')

  const filteredFiles = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return files
    return files.filter((file) => file.path.toLowerCase().includes(normalized))
  }, [files, query])

  const getIcon = (language: LessonFile['language']) => {
    if (language === 'json') return FileJson2
    if (language === 'html' || language === 'css') return FileText
    return FileCode2
  }

  const toFileName = (path: string) => {
    const segments = path.split('/')
    return segments[segments.length - 1] ?? path
  }

  return (
    <aside className="w-[220px] shrink-0 border-r border-slate-300/70 bg-slate-100/70">
      <div className="border-b border-slate-300/70 px-3 py-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          <span>Files</span>
          <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600">{files.length}</span>
        </div>

        <label className="mt-2 flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-slate-500 focus-within:border-cyan-700">
          <Search className="h-3.5 w-3.5" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter files"
            className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      <div className="space-y-1 p-2">
        {filteredFiles.map((file) => {
          const Icon = getIcon(file.language)

          return (
          <button
            key={file.id}
            type="button"
            onClick={() => onSelect(file.id)}
            className={clsx(
              'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-xs transition',
              file.id === activeFileId
                ? 'bg-cyan-900 text-white'
                : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900',
            )}
            title={file.path}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate">{toFileName(file.path)}</p>
              <p className={clsx('truncate text-[10px]', file.id === activeFileId ? 'text-cyan-100' : 'text-slate-500')}>
                {file.path}
              </p>
            </div>
            <span
              className={clsx(
                'rounded px-1.5 py-0.5 text-[10px] uppercase',
                file.id === activeFileId ? 'bg-cyan-800/70 text-cyan-100' : 'bg-slate-200 text-slate-600',
              )}
            >
              {file.language}
            </span>
          </button>
          )
        })}

        {!filteredFiles.length ? (
          <p className="px-2 py-3 text-xs text-slate-500">No files match "{query}".</p>
        ) : null}
      </div>
    </aside>
  )
}
