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
        <label className="text-th-txt text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        <input
          className={`w-full bg-th-ibg border ${error ? 'border-red-500/60 focus:border-red-500' : 'border-th-ibrd focus:border-blue-500/70'} text-th-txt placeholder:text-th-muted rounded-lg px-4 py-2.5 ${rightElement ? 'pr-10' : ''} text-sm focus:outline-none transition-all duration-150 ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {error && <p className="text-red-500 dark:text-red-400 text-xs">{error}</p>}
      {hint && !error && <p className="text-th-muted text-xs">{hint}</p>}
    </div>
  )
}
