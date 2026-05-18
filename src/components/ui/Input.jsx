'use client'

export default function Input({
  label,
  error,
  hint,
  rightElement,
  className = '',
  wrapperClassName = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {label && (
        <label className="text-slate-300 text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        <input
          className={`w-full bg-slate-900 border ${error ? 'border-red-500/60' : 'border-slate-700'} text-slate-100 placeholder-slate-500 rounded-lg px-4 py-2.5 ${rightElement ? 'pr-10' : ''} text-sm focus:outline-none focus:border-blue-500 transition-colors ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
      {hint && !error && <p className="text-slate-500 text-xs">{hint}</p>}
    </div>
  )
}
