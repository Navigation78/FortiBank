'use client'

const VARIANTS = {
  primary:   'bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white',
  secondary: 'bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-slate-300',
  danger:    'bg-red-600 hover:bg-red-500 disabled:bg-red-600/50 text-white',
  success:   'bg-green-600 hover:bg-green-500 disabled:bg-green-600/50 text-white',
  ghost:     'bg-transparent hover:bg-slate-800 disabled:opacity-50 text-slate-400 hover:text-white',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
