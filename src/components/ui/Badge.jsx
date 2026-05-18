const VARIANTS = {
  blue:   'bg-blue-500/15 text-blue-400 border-blue-500/20',
  green:  'bg-green-500/15 text-green-400 border-green-500/20',
  yellow: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  red:    'bg-red-500/15 text-red-400 border-red-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  orange: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  slate:  'bg-slate-700/50 text-slate-400 border-slate-600/50',
}

export default function Badge({ children, variant = 'slate', className = '' }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-lg border ${VARIANTS[variant] || VARIANTS.slate} ${className}`}>
      {children}
    </span>
  )
}
