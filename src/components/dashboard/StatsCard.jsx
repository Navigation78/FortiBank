import { isValidElement } from 'react'

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  color = 'blue',
  trend,
}) {
  const colors = {
    blue:   { bg: 'bg-blue-500/10',   icon: 'text-blue-400',   border: 'border-blue-500/25' },
    green:  { bg: 'bg-green-500/10',  icon: 'text-green-400',  border: 'border-green-500/25' },
    yellow: { bg: 'bg-yellow-500/10', icon: 'text-yellow-400', border: 'border-yellow-500/25' },
    red:    { bg: 'bg-red-500/10',    icon: 'text-red-400',    border: 'border-red-500/25' },
    purple: { bg: 'bg-purple-500/10', icon: 'text-purple-400', border: 'border-purple-500/25' },
  }

  const c = colors[color] || colors.blue
  const renderIcon = () => {
    if (typeof icon === 'string') return <span className={c.icon}>{icon}</span>
    if (isValidElement(icon)) return <span className={c.icon}>{icon}</span>
    const Icon = icon
    return <Icon className={`w-5 h-5 ${c.icon}`} />
  }

  return (
    <div className="bg-slate-800 border border-white/[0.08] rounded-xl p-5 flex items-center gap-4 shadow-sm shadow-black/30 transition-all duration-150 hover:border-white/[0.14] hover:shadow-md hover:shadow-black/40 hover:-translate-y-0.5">
      {icon && (
        <div className={`flex-shrink-0 w-11 h-11 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center`}>
          {renderIcon()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-slate-400 text-sm">{title}</p>
        <p className="text-slate-100 text-2xl font-bold mt-0.5">{value}</p>
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
