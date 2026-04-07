
// src/components/dashboard/StatsCard.jsx
// Reusable stats widget used across all dashboards


export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend,
}) {
  const colors = {
    blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-400',   border: 'border-blue-500/20' },
    green:  { bg: 'bg-green-500/10',  icon: 'text-green-400',  border: 'border-green-500/20' },
    yellow: { bg: 'bg-yellow-500/10', icon: 'text-yellow-400', border: 'border-yellow-500/20' },
    red:    { bg: 'bg-red-500/10',    icon: 'text-red-400',    border: 'border-red-500/20' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/20' },
  }

  const c = colors[color] || colors.blue

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-start gap-4">
      {icon && (
        <div className={`w-11 h-11 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
          <span className={c.icon}>{icon}</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-white text-2xl font-bold mt-0.5">{value}</p>
        {subtitle && (
          <p className="text-slate-500 text-xs mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={`text-xs mt-1 font-medium ${
            trend.direction === 'up' ? 'text-green-400' :
            trend.direction === 'down' ? 'text-red-400' :
            'text-slate-400'
          }`}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.label}
          </p>
        )}
      </div>
    </div>
  )
}