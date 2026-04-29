'use client'

// src/contexts/NotificationContext.jsx
// Global toast notification system.
// Usage: const { notify } = useNotification()
//        notify.success('Saved!') / notify.error('Failed') / notify.warning('...')


import { createContext, useContext, useState, useCallback } from 'react'

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

  const STYLES = {
    success: { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  icon: '✓' },
    error:   { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    icon: '✕' },
    warning: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '⚠' },
    info:    { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   icon: 'ℹ' },
  }

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {notifications.map(n => {
          const s = STYLES[n.type] || STYLES.info
          return (
            <div
              key={n.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl pointer-events-auto
                ${s.bg} ${s.border} max-w-sm animate-in slide-in-from-right`}
            >
              <span className={`font-bold ${s.text}`}>{s.icon}</span>
              <p className={`text-sm flex-1 ${s.text}`}>{n.message}</p>
              <button
                onClick={() => remove(n.id)}
                className={`${s.text} opacity-60 hover:opacity-100 text-xs`}
              >
                ✕
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