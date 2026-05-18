'use client'

// src/app/admin/layout.jsx
// Admin panel shell — separate from employee dashboard layout.
// Only accessible to system_admin role.
// Manages sidebar state with a single source of truth (navbar hamburger).

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

function Icon({ path, className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const NAV_ITEMS = [
  {
    label: 'Overview',
    href:  '/admin',
    exact: true,
    icon:  'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Users',
    href:  '/admin/users',
    icon:  'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
  {
    label: 'Modules',
    href:  '/admin/modules',
    icon:  'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    label: 'Phishing',
    href:  '/admin/phishing',
    icon:  'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  },
  {
    label: 'Analytics',
    href:  '/admin/analytics',
    icon:  'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    label: 'Employee Dashboards',
    href:  '/admin/reports',
    icon:  'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
]

// Admin Topbar with GitHub-style layout
function AdminTopbar({ toggleSidebar, toggleMobileSidebar }) {
  const { profile, signOut } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const firstName = profile?.full_name?.split(' ')[0] || 'User'
  const userInitial = profile?.full_name?.charAt(0) || 'U'

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      toggleSidebar?.()
    } else {
      toggleMobileSidebar?.()
    }
  }

  return (
    <header className="h-73px bg-slate-900 border-b border-white/[0.06] flex items-center px-4 sticky top-0 z-30 shadow-sm shadow-black/40">
      <div className="flex items-center gap-4">
        <button
          onClick={handleSidebarToggle}
          className="flex items-center justify-center text-slate-400 hover:text-white transition-all duration-150 p-1 rounded-lg hover:bg-white/[0.06]"
          aria-label="Toggle sidebar"
        >
          <Icon path="M4 6h16M4 12h16M4 18h16" className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0">
            <Icon
              path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              className="w-3 h-3 text-white"
            />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-sm">
            <span className="text-slate-100 font-semibold">FortiBank</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{firstName}</span>
            <span className="text-green-400 text-[10px] tracking-widest uppercase ml-1 font-medium">Admin</span>
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.14] rounded-lg transition-all duration-150"
          >
            <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center flex-shrink-0">
              <span className="text-green-300 font-semibold text-xs">{userInitial}</span>
            </div>
            <Icon
              path="M19 9l-7 7-7-7"
              className={`w-4 h-4 text-slate-400 transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-slate-800 border border-white/[0.08] rounded-xl shadow-xl shadow-black/50 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-slate-100 text-sm font-medium truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-slate-400 text-xs truncate mt-0.5">
                    {profile?.email}
                  </p>
                </div>
                <div className="py-1 border-t border-white/[0.06]">
                  <button
                    onClick={() => { setMenuOpen(false); signOut() }}
                    className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-all duration-150 w-full"
                  >
                    <Icon path="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="w-4 h-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function AdminSidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname()

  function isActive(item) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const Content = () => (
    <div className="flex flex-col h-full">
      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive(item)
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/25'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon path={item.icon} className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full z-50 w-64 bg-slate-900 shadow-[4px_0_32px_rgba(0,0,0,0.6)] transform transition-transform duration-200 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Content />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col relative flex-shrink-0 bg-slate-900 shadow-[4px_0_24px_rgba(0,0,0,0.5)] h-screen transition-all duration-200 ${isCollapsed ? 'w-16' : 'w-64'}`}>
        <Content />
      </aside>
    </>
  )
}

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed]   = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const toggleSidebar = () => setIsCollapsed(!isCollapsed)
  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen)

  return (
    <div className="flex h-screen overflow-hidden bg-[#080f1e]">
      <AdminSidebar
        isCollapsed={isCollapsed}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        <AdminTopbar
          toggleSidebar={toggleSidebar}
          toggleMobileSidebar={toggleMobileSidebar}
        />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
