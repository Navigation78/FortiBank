'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRole } from '@/hooks/useRole'
import { getDashboardUrl } from '@/utils/roleRedirect'

function Icon({ path, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const ICONS = {
  dashboard: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  modules:   'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  phishing:  'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  risk:      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  cert:      'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
  profile:   'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  results:   'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  bell:      'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
  logout:    'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  menu:      'M4 6h16M4 12h16M4 18h16',
  sun:       'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
  moon:      'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z',
}

const NAV_ITEMS = [
  { label: 'Dashboard',      icon: 'dashboard', href: null },
  { label: 'My Modules',     icon: 'modules',   href: '/modules' },
  { label: 'Phishing Tests', icon: 'phishing',  href: '/phishing' },
  { label: 'Risk Score',     icon: 'risk',      href: '/risk-score' },
  { label: 'Results',        icon: 'results',   href: '/results' },
  { label: 'Certificates',   icon: 'cert',      href: '/certificates' },
  { label: 'Notifications',  icon: 'bell',      href: '/notifications' },
]

function SidebarInner({ collapsed, onToggle, navItems, isActive, darkMode, setDarkMode, onCloseMobile, search = '' }) {
  const filtered = search.trim()
    ? navItems.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
    : navItems

  return (
    <div className="flex flex-col h-full">

      {/* Hamburger */}
      <div className="px-2.5 pt-3 pb-1 flex-shrink-0">
        <button
          onClick={onToggle}
          title="Toggle sidebar"
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150 ${collapsed ? 'justify-center' : ''}`}
        >
          <Icon path={ICONS.menu} className="w-5 h-5 flex-shrink-0" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-2.5 overflow-y-auto flex flex-col gap-0.5">
        {filtered.length === 0 ? (
          !collapsed && (
            <p className="text-slate-500 text-xs text-center py-3">No results</p>
          )
        ) : filtered.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 no-underline
                ${collapsed ? 'justify-center' : ''}
                ${active
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
            >
              <Icon path={ICONS[item.icon]} className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="flex-1">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-3 my-1.5 border-t border-white/[0.06]" />

      {/* Theme toggle */}
      <div className="px-2.5 pb-5 flex-shrink-0">
        {collapsed ? (
          <div className="flex justify-center">
            <button
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center justify-center text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/[0.06] transition-all duration-150"
            >
              <Icon path={darkMode ? ICONS.moon : ICONS.sun} className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex bg-white/[0.04] border border-white/[0.08] rounded-lg p-0.5 gap-0.5">
            {[
              { label: 'Light', icon: 'sun',  value: false },
              { label: 'Dark',  icon: 'moon', value: true  },
            ].map(opt => (
              <button
                key={opt.label}
                onClick={() => setDarkMode(opt.value)}
                title={`${opt.label} mode`}
                className={`flex-1 flex items-center justify-center py-1.5 rounded-md transition-all duration-150
                  ${darkMode === opt.value
                    ? 'bg-white/[0.1] text-white'
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                <Icon path={ICONS[opt.icon]} className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen, setIsMobileOpen, search = '' }) {
  const pathname = usePathname()
  const { role } = useRole()
  const [darkMode, setDarkMode] = useState(true)

  const dashboardUrl = getDashboardUrl(role)

  function isActive(href) {
    if (!href) return false
    if (href === dashboardUrl) return pathname === href
    return pathname.startsWith(href)
  }

  const navItems = NAV_ITEMS.map(item =>
    item.href === null ? { ...item, href: dashboardUrl } : item
  )

  const sharedProps = {
    navItems, isActive, darkMode, setDarkMode,
    onCloseMobile: () => setIsMobileOpen(false),
    search,
  }

  return (
    <>
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 h-full z-50 w-64 bg-slate-900 border-r border-white/[0.06] transform transition-transform duration-200 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarInner {...sharedProps} collapsed={false} onToggle={() => setIsMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col relative flex-shrink-0 h-full bg-slate-900 border-r border-white/[0.06] transition-all duration-200 ${isCollapsed ? 'w-[60px]' : 'w-60'}`}
      >
        <SidebarInner {...sharedProps} collapsed={isCollapsed} onToggle={onToggle} />
      </aside>
    </>
  )
}
