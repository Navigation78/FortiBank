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
    blue:   { bg: 'bg-blue-50 dark:bg-blue-500/10',     icon: 'text-blue-600 dark:text-blue-400',   border: 'border-blue-200 dark:border-blue-500/25' },
    green:  { bg: 'bg-green-50 dark:bg-green-500/10',   icon: 'text-green-600 dark:text-green-400',  border: 'border-green-200 dark:border-green-500/25' },
    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-500/10', icon: 'text-yellow-600 dark:text-yellow-400',border: 'border-yellow-200 dark:border-yellow-500/25' },
    red:    { bg: 'bg-red-50 dark:bg-red-500/10',       icon: 'text-red-600 dark:text-red-400',      border: 'border-red-200 dark:border-red-500/25' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-500/10', icon: 'text-purple-600 dark:text-purple-400',border: 'border-purple-200 dark:border-purple-500/25' },
  }

  const c = colors[color] || colors.blue
  const renderIcon = () => {
    if (typeof icon === 'string') return <span className={c.icon}>{icon}</span>
    if (isValidElement(icon)) return <span className={c.icon}>{icon}</span>
    const Icon = icon
    return <Icon className={`w-5 h-5 ${c.icon}`} />
  }

  return (
    <div className="bg-th-srf border border-th-brd rounded-xl p-3 sm:p-5 flex items-center gap-2 sm:gap-4 shadow-sm shadow-black/5 dark:shadow-black/30 transition-all duration-150 hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/40 hover:-translate-y-0.5">
      {icon && (
        <div className="flex-shrink-0">
          {renderIcon()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-th-txt2 text-sm">{title}</p>
        <p className="text-th-txt text-xl sm:text-2xl font-bold mt-0.5">{value}</p>
        {subtitle && (
          <p className="text-th-muted text-xs mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={`text-xs mt-1 font-medium ${
            trend.direction === 'up'   ? 'text-green-600 dark:text-green-400' :
            trend.direction === 'down' ? 'text-red-600 dark:text-red-400' :
            'text-th-muted'
          }`}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.label}
          </p>
        )}
      </div>
    </div>
  )
}
