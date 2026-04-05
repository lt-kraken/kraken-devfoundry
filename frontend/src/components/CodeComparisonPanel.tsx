import { X } from 'lucide-react'

interface CodeComparisonPanelProps {
  userCode: string
  referenceCode: string
  onClose: () => void
}

export function CodeComparisonPanel({ userCode, referenceCode, onClose }: CodeComparisonPanelProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Code Comparison</h2>
            <p className="text-gray-600 text-sm mt-1">Your code vs. reference solution</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex gap-1 p-4">
          {/* User's Code */}
          <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-gray-50">
            <div className="bg-blue-50 px-4 py-2 border-b">
              <h3 className="text-sm font-semibold text-blue-900">Your Code</h3>
            </div>
            <pre className="flex-1 overflow-auto p-3 text-xs bg-white font-mono text-gray-800">
              <code>{userCode || '// Your code appears here'}</code>
            </pre>
          </div>

          {/* Reference Code */}
          <div className="flex-1 flex flex-col border rounded-lg overflow-hidden bg-green-50">
            <div className="bg-green-50 px-4 py-2 border-b">
              <h3 className="text-sm font-semibold text-green-900">Reference Solution</h3>
            </div>
            <pre className="flex-1 overflow-auto p-3 text-xs bg-white font-mono text-gray-800">
              <code>{referenceCode || '// Reference code'}</code>
            </pre>
          </div>
        </div>

        <div className="border-t p-4 bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-3 w-3 rounded mt-1 bg-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Your Implementation</p>
                <p className="text-xs text-gray-600">Shows your current code</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-3 w-3 rounded mt-1 bg-green-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Reference Solution</p>
                <p className="text-xs text-gray-600">Professional approach with best practices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
