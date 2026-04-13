// ============================================================
// src/components/phishing/PhishingStats.jsx
// Summary stats for an employee's phishing test history
// ============================================================

export default function PhishingStats({ targets = [] }) {
  const total    = targets.length
  const sent     = targets.filter(t => t.result !== 'not_sent').length
  const clicked  = targets.filter(t => t.result === 'clicked').length
  const reported = targets.filter(t => t.result === 'reported').length
  const passed   = targets.filter(t => t.result === 'sent' || t.result === 'opened').length

  const clickRate = sent > 0 ? Math.round((clicked / sent) * 100) : 0

  const stats = [
    { label: 'Tests Received', value: sent,     color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
    { label: 'Links Clicked',  value: clicked,  color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
    { label: 'Correctly Reported', value: reported, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { label: 'Click Rate',     value: `${clickRate}%`, color: clickRate > 30 ? 'text-red-400' : 'text-green-400', bg: 'bg-slate-800', border: 'border-slate-700' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className={`${stat.bg} border ${stat.border} rounded-xl p-4 text-center`}>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}