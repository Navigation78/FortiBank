'use client'

// src/contexts/NotificationContext.jsx
// Global toast notification system.
// Usage: const { notify } = useNotification()
//        notify.success('Saved!') / notify.error('Failed') / notify.warning('...')


import { createContext, useContext, useState, useCallback } from 'react'
import { Check, X, AlertTriangle, Info } from 'lucide-react'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, duration)
  }, [])

  const notify = {
    success: (msg) => addNotification(msg, 'success'),
    error:   (msg) => addNotification(msg, 'error'),
    warning: (msg) => addNotification(msg, 'warning'),
    info:    (msg) => addNotification(msg, 'info'),
  }

  const remove = (id) => setNotifications(prev => prev.filter(n => n.id !== id))

  const ICONS = {
    success: Check,
    error:   X,
    warning: AlertTriangle,
    info:    Info,
  }

  const STYLES = {
    success: { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400' },
    error:   { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400'   },
    warning: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
    info:    { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400'   },
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => {
          const s = STYLES[n.type] || STYLES.info
          const Icon = ICONS[n.type] || ICONS.info
          return (
            <div
              key={n.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl pointer-events-auto
                ${s.bg} ${s.border} max-w-sm animate-in slide-in-from-right`}
            >
              <Icon className={`w-5 h-5 ${s.text}`} />
              <p className={`text-sm flex-1 ${s.text}`}>{n.message}</p>
              <button
                onClick={() => remove(n.id)}
                className={`${s.text} opacity-60 hover:opacity-100`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )
        })}
      </div>
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotification must be used inside NotificationProvider')
  return context
}