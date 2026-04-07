
// src/components/dashboard/RecentActivity.jsx
// Shows recent quiz attempts and module completions

import Link from 'next/link'

function timeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function RecentActivity({ activities = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-slate-800 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Recent Activity</h3>
        <Link href="/results" className="text-blue-400 hover:text-blue-300 text-xs transition-colors">
          View all →
        </Link>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                activity.type === 'quiz_passed'    ? 'bg-green-500/15' :
                activity.type === 'quiz_failed'    ? 'bg-red-500/15' :
                activity.type === 'module_done'    ? 'bg-blue-500/15' :
                activity.type === 'phishing_click' ? 'bg-orange-500/15' :
                'bg-slate-800'
              }`}>
                <svg className={`w-4 h-4 ${
                  activity.type === 'quiz_passed'    ? 'text-green-400' :
                  activity.type === 'quiz_failed'    ? 'text-red-400' :
                  activity.type === 'module_done'    ? 'text-blue-400' :
                  activity.type === 'phishing_click' ? 'text-orange-400' :
                  'text-slate-400'
                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                    activity.type === 'quiz_passed'    ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' :
                    activity.type === 'quiz_failed'    ? 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z' :
                    activity.type === 'module_done'    ? 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' :
                    activity.type === 'phishing_click' ? 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' :
                    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  } />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-300 text-sm">{activity.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {activity.score !== undefined && (
                    <span className={`text-xs font-medium ${
                      activity.score >= 70 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {activity.score}%
                    </span>
                  )}
                  <span className="text-slate-500 text-xs">{timeAgo(activity.date)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-slate-500 text-sm">No activity yet.</p>
          <p className="text-slate-600 text-xs mt-1">Complete a module or quiz to see your activity here.</p>
        </div>
      )}
    </div>
  )
}