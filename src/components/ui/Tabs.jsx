'use client'

import { createContext, useContext, useState } from 'react'

const TabsContext = createContext(null)

export function Tabs({ children, defaultTab, className = '' }) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabList({ children, className = '' }) {
  return (
    <div className={`flex gap-1 bg-th-bg border border-th-brd rounded-xl p-1 ${className}`}>
      {children}
    </div>
  )
}

export function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext)
  const isActive = active === id
  return (
    <button
      type="button"
      onClick={() => setActive(id)}
      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
        isActive
          ? 'bg-th-srf text-th-txt shadow-sm shadow-black/5 dark:shadow-black/30'
          : 'text-th-txt2 hover:text-th-txt'
      }`}
    >
      {children}
    </button>
  )
}

export function TabPanel({ id, children }) {
  const { active } = useContext(TabsContext)
  if (active !== id) return null
  return <div>{children}</div>
}
