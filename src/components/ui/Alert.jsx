const VARIANTS = {
  info:    { wrapper: 'bg-blue-500/10 border-blue-500/20',    text: 'text-blue-400',   path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  success: { wrapper: 'bg-green-500/10 border-green-500/20',  text: 'text-green-400',  path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
  warning: { wrapper: 'bg-yellow-500/10 border-yellow-500/20', text: 'text-yellow-400', path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  error:   { wrapper: 'bg-red-500/10 border-red-500/20',      text: 'text-red-400',    path: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' },
}

export default function Alert({ children, variant = 'info', className = '' }) {
  const v = VARIANTS[variant] || VARIANTS.info
  return (
    <div className={`flex items-start gap-3 p-3 border rounded-lg ${v.wrapper} ${className}`}>
      <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${v.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={v.path} />
      </svg>
      <div className={`text-sm ${v.text}`}>{children}</div>
    </div>
  )
}
