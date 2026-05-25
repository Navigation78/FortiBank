'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [search, setSearch] = useState('')

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-th-bg">
      <Topbar
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
        toggleMobileSidebar={toggleMobileSidebar}
        search={search}
        setSearch={setSearch}
      />
      <div className="flex flex-1 min-h-0">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          search={search}
        />
        <div className="flex flex-col flex-1 min-w-0 min-h-0">
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
