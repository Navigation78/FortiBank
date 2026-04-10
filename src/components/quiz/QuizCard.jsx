// src/components/quiz/QuizCard.jsx
// Renders a single quiz question with its answer options

export default function QuizCard({
  question,
  selectedIds = [],
  onSelect,
  showResult = false,
  correctIds = [],
}) {
  if (!question) return null

  const isMultiSelect = question.question_type === 'multi_select'

  function getOptionStyle(optionId) {
    const isSelected = selectedIds.includes(optionId)
    const isCorrect  = correctIds.includes(optionId)

    if (showResult) {
      if (isCorrect)
        return 'border-green-500/50 bg-green-500/10 text-green-300'
      if (isSelected && !isCorrect)
        return 'border-red-500/50 bg-red-500/10 text-red-300'
      return 'border-slate-700 text-slate-500'
    }

    if (isSelected)
      return 'border-blue-500 bg-blue-500/10 text-white'

    return 'border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white'
  }

  function getOptionIcon(optionId) {
    const isSelected = selectedIds.includes(optionId)
    const isCorrect  = correctIds.includes(optionId)

    if (showResult) {
      if (isCorrect) return (
        <span className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )
      if (isSelected && !isCorrect) return (
        <span className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/50 flex items-center justify-center flex-shrink-0">
          <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      )
    }

    if (isMultiSelect) {
      return (
        <span className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 ${
          isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-600'
        }`}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
      )
    }

    return (
      <span className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center ${
        isSelected ? 'border-blue-500' : 'border-slate-600'
      }`}>
        {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
      </span>
    )
  }

  const options = [...(question.quiz_options || [])].sort(
    (a, b) => a.order_index - b.order_index
  )

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
      {/* Question */}
      <div>
        {isMultiSelect && (
          <p className="text-blue-400 text-xs font-medium mb-2">
            Select all that apply
          </p>
        )}
        <p className="text-white font-medium leading-relaxed">
          {question.question_text}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => !showResult && onSelect(question.id, option.id, question.question_type)}
            disabled={showResult}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left text-sm transition-all ${getOptionStyle(option.id)} ${
              showResult ? 'cursor-default' : 'cursor-pointer'
            }`}
          >
            {getOptionIcon(option.id)}
            <span>{option.option_text}</span>
          </button>
        ))}
      </div>

      {/* Explanation shown after result */}
      {showResult && question.explanation && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
          <p className="text-blue-400 text-xs font-semibold mb-1">Explanation</p>
          <p className="text-slate-300 text-sm">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}