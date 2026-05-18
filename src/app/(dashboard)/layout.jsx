
// Shell layout wrapping all employee-facing pages.
// Includes sidebar, topbar and footer.
// Manages sidebar state with a single source of truth.

'use client'

import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import Footer from '@/components/layout/Footer'

export default function DashboardLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen)

  return (
    <div className="flex h-screen overflow-hidden bg-[#080f1e]">
      <Sidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <Topbar
          toggleSidebar={toggleSidebar}
          isCollapsed={isCollapsed}
          toggleMobileSidebar={toggleMobileSidebar}
        />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  )
}
