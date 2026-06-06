'use client'

// src/app/(dashboard)/notifications/page.jsx
// Full notification inbox for employees

import { useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { useRouter } from 'next/navigation'

const FILTERS = [
  { label: 'All',    value: 'all'    },
  { label: 'Unread', value: 'unread' },
  { label: 'Read',   value: 'read'   },
]

const TYPES = [
  { label: 'All Types',    value: ''            },
  { label: 'Modules',      value: 'module'      },
  { label: 'Quiz',         value: 'quiz'        },
  { label: 'Phishing',     value: 'phishing'    },
  { label: 'Risk Alerts',  value: 'risk_alert'  },
  { label: 'Certificates', value: 'certificate' },
  { label: 'System',       value: 'system'      },
]

const TYPE_ICONS = {
  module:       'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  quiz:         'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  phishing:     'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  risk_alert:   'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  certificate:  'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  announcement: 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
  system:       'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z',
}

const TYPE_COLORS = {
  module:       { icon: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-500/10'   },
  quiz:         { icon: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
  phishing:     { icon: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
  risk_alert:   { icon: 'text-red-600 dark:text-red-400',    bg: 'bg-red-500/10'    },
  certificate:  { icon: 'text-green-600 dark:text-green-400',  bg: 'bg-green-500/10'  },
  announcement: { icon: 'text-cyan-600 dark:text-cyan-400',   bg: 'bg-cyan-500/10'   },
  system:       { icon: 'text-th-txt2',  bg: 'bg-th-hov'  },
}

function Icon({ path, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)   return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)   return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

export default function NotificationsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const [type, setType]     = useState('')
  const [page, setPage]     = useState(1)

  const {
    notifications, unreadCount, total, hasMore,
    loading, error,
    markAsRead, markAllRead, deleteNotification, refresh,
  } = useNotifications({ filter, type: type || null, page })

  const handleFilterChange = (v) => { setFilter(v); setPage(1) }
  const handleTypeChange   = (v) => { setType(v);   setPage(1) }

  const handleItemClick = (n) => {
    if (!n.is_read) markAsRead(n.id, true)
    if (n.link) router.push(n.link)
  }

  return (
    <div className="min-h-full p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-th-txt">Notifications</h1>
          <p className="text-sm text-th-txt2 mt-0.5">
            {total} total · {unreadCount} unread
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 px-3 py-1.5 rounded-lg hover:bg-th-hov transition-all duration-150"
            >
              Mark all read
            </button>
          )}
          <button
            onClick={refresh}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-th-txt2 hover:text-th-txt hover:bg-th-hov transition-all duration-150"
            title="Refresh"
          >
            <Icon path="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Read/Unread filter */}
        <div className="flex bg-th-hov border border-th-brd rounded-lg p-0.5 gap-0.5">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => handleFilterChange(f.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150
                ${filter === f.value
                  ? 'bg-blue-600 text-white'
                  : 'text-th-txt2 hover:text-th-txt'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Type filter */}
        <select
          value={type}
          onChange={e => handleTypeChange(e.target.value)}
          className="bg-th-ibg border border-th-ibrd text-th-txt2 text-xs rounded-lg px-3 py-2 outline-none focus:border-blue-500/50 transition-colors"
        >
          {TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="bg-th-srf border border-th-brd rounded-xl overflow-hidden">
        {loading && notifications.length === 0 ? (
          <div className="py-16 text-center text-th-muted text-sm">Loading…</div>
        ) : error ? (
          <div className="py-16 text-center text-red-600 dark:text-red-400 text-sm">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Icon
              path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              className="w-10 h-10 text-th-muted mx-auto mb-3"
            />
            <p className="text-th-txt2 font-medium">No notifications</p>
            <p className="text-th-muted text-sm mt-1">
              {filter !== 'all' || type ? 'Try adjusting your filters' : 'You\'re all caught up!'}
            </p>
          </div>
        ) : (
          notifications.map((n, i) => {
            const iconPath = TYPE_ICONS[n.type] || TYPE_ICONS.system
            const colors   = TYPE_COLORS[n.type] || TYPE_COLORS.system
            return (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-5 py-4 border-b border-th-brds last:border-0 hover:bg-th-hov transition-colors group
                  ${!n.is_read ? 'bg-blue-500/[0.03]' : ''}`}
              >
                {/* Type icon */}
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg ${colors.bg} flex items-center justify-center mt-0.5`}>
                  <Icon path={iconPath} className={`w-4 h-4 ${colors.icon}`} />
                </div>

                {/* Content */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleItemClick(n)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-snug ${!n.is_read ? 'text-th-txt font-semibold' : 'text-th-txt2 font-medium'}`}>
                      {n.title}
                    </p>
                    <span className="flex-shrink-0 text-[11px] text-th-muted mt-0.5">{timeAgo(n.created_at)}</span>
                  </div>
                  <p className="text-sm text-th-muted mt-1 leading-relaxed">{n.message}</p>
                  {n.link && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1.5 flex items-center gap-1">
                      <Icon path="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" className="w-3 h-3" />
                      View details
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => markAsRead(n.id, !n.is_read)}
                    title={n.is_read ? 'Mark unread' : 'Mark read'}
                    className="p-1.5 rounded-lg text-th-muted hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-500/10 transition-all duration-150"
                  >
                    <Icon
                      path={n.is_read
                        ? 'M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76'
                        : 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                      }
                      className="w-4 h-4"
                    />
                  </button>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    title="Delete"
                    className="p-1.5 rounded-lg text-th-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
                  >
                    <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-4 h-4" />
                  </button>
                </div>

                {/* Unread dot */}
                {!n.is_read && (
                  <div className="flex-shrink-0 mt-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {(page > 1 || hasMore) && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm rounded-lg bg-th-hov border border-th-brd text-th-txt2 hover:text-th-txt hover:bg-th-act disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            Previous
          </button>
          <span className="text-th-muted text-sm">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!hasMore}
            className="px-4 py-2 text-sm rounded-lg bg-th-hov border border-th-brd text-th-txt2 hover:text-th-txt hover:bg-th-act disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
