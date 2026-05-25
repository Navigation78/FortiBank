'use client'

const VARIANTS = {
  primary:   'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white shadow-sm shadow-blue-600/20',
  secondary: 'bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-200 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-white/[0.06] dark:hover:bg-white/[0.10] dark:active:bg-white/[0.04] dark:border-white/[0.08] dark:hover:border-white/[0.14] dark:text-slate-200 shadow-sm shadow-black/5 dark:shadow-none',
  danger:    'bg-red-600 hover:bg-red-500 active:bg-red-700 disabled:bg-red-600/40 disabled:cursor-not-allowed text-white shadow-sm shadow-red-600/20',
  success:   'bg-green-600 hover:bg-green-500 active:bg-green-700 disabled:bg-green-600/40 disabled:cursor-not-allowed text-white shadow-sm shadow-green-600/20',
  ghost:     'bg-transparent hover:bg-th-hov active:bg-th-act disabled:opacity-40 disabled:cursor-not-allowed text-th-txt2 hover:text-th-txt',
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
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
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
