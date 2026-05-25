const COLORS = {
  blue:   'bg-blue-500',
  green:  'bg-green-500',
  yellow: 'bg-yellow-500',
  red:    'bg-red-500',
  purple: 'bg-purple-500',
}

export default function Progress({ value = 0, max = 100, color = 'blue', showLabel = false, className = '' }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex-1 h-1.5 bg-th-track rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${COLORS[color] || COLORS.blue}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-th-muted text-xs w-10 text-right flex-shrink-0">{Math.round(pct)}%</span>
      )}
    </div>
  )
}
