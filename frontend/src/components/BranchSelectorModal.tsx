import type { BranchPoint } from '../types/learning'
import { selectBranch } from '../services/learningService'

interface BranchSelectorModalProps {
  lessonId: string
  branchPoint: BranchPoint
  onBranchSelected: (branchId: string) => void
}

export function BranchSelectorModal({
  lessonId,
  branchPoint,
  onBranchSelected,
}: BranchSelectorModalProps) {
  const handleSelectBranch = async (branchId: string) => {
    await selectBranch(lessonId, branchId)
    onBranchSelected(branchId)
  }

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600'
      case 'intermediate':
        return 'text-yellow-600'
      case 'advanced':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getDifficultyBgColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-50'
      case 'intermediate':
        return 'bg-yellow-50'
      case 'advanced':
        return 'bg-red-50'
      default:
        return 'bg-gray-50'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full mx-4">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{branchPoint.question}</h2>
          <p className="text-gray-600 mb-8">
            Choose your preferred approach. You can always explore a different path later.
          </p>

          <div className="grid gap-4">
            {branchPoint.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectBranch(option.id)}
                className={`p-6 text-left border-2 border-gray-200 rounded-lg transition-all hover:border-blue-400 hover:shadow-md ${getDifficultyBgColor(option.difficulty)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.label}</h3>
                    <p className="text-gray-700 mb-3">{option.description}</p>
                  </div>
                  {option.difficulty && (
                    <div
                      className={`ml-4 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${getDifficultyColor(option.difficulty)}`}
                    >
                      {option.difficulty.charAt(0).toUpperCase() + option.difficulty.slice(1)}
                    </div>
                  )}
                </div>
                <div className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Choose This Path
                </div>
              </button>
            ))}
          </div>

          <p className="text-gray-500 text-sm mt-8 text-center">
            💡 Tip: Both approaches teach valuable skills. Pick the one that interests you most.
          </p>
        </div>
      </div>
    </div>
  )
}
