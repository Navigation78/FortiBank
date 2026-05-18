const VARIANTS = {
  blue:   'bg-blue-500/15 text-blue-300 border-blue-500/25',
  green:  'bg-green-500/15 text-green-300 border-green-500/25',
  yellow: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
  red:    'bg-red-500/15 text-red-300 border-red-500/25',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
  slate:  'bg-white/[0.06] text-slate-300 border-white/[0.08]',
}

export default function Badge({ children, variant = 'slate', className = '' }) {
  return (
    <span className={`inline-flex items-center text-xs font-medium px-2 py-1 rounded-lg border ${VARIANTS[variant] || VARIANTS.slate} ${className}`}>
      {children}
    </span>
  )
}
