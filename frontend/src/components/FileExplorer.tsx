import clsx from 'clsx'
import { FileCode2 } from 'lucide-react'
import type { LessonFile } from '../types/learning'

type FileExplorerProps = {
  files: LessonFile[]
  activeFileId: string
  onSelect: (fileId: string) => void
}

export function FileExplorer({ files, activeFileId, onSelect }: FileExplorerProps) {
  return (
    <aside className="w-[200px] shrink-0 border-r border-slate-300/70 bg-slate-100/70">
      <div className="border-b border-slate-300/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        Files
      </div>
      <div className="space-y-1 p-2">
        {files.map((file) => (
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
          >
            <FileCode2 className="h-3.5 w-3.5" />
            <span>{file.path}</span>
          </button>
        ))}
      </div>
    </aside>
  )
}
