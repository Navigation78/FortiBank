'use client'

// src/components/layout/Sidebar.jsx
// Role-aware sidebar navigation.
// Shows different menu items based on the user's role.
// Collapse/expand controlled by navbar hamburger (single source of truth).

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { getDashboardUrl } from '@/utils/roleRedirect'

function Icon({ path, className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const ICONS = {
  dashboard: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  modules:   "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  quiz:      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
  phishing:  "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  risk:      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  cert:      "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  profile:   "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  results:   "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  logout:    "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  shield:    "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  menu:      "M4 6h16M4 12h16M4 18h16",
  close:     "M6 18L18 6M6 6l12 12",
}

const NAV_ITEMS = [
  { label: 'Dashboard',      icon: 'dashboard', href: null },
  { label: 'My Modules',     icon: 'modules',   href: '/modules' },
  { label: 'Phishing Tests', icon: 'phishing',  href: '/phishing' },
  { label: 'Risk Score',     icon: 'risk',      href: '/risk-score' },
  { label: 'Results',        icon: 'results',   href: '/results' },
  { label: 'Certificates',   icon: 'cert',      href: '/certificates' },
  { label: 'Profile',        icon: 'profile',   href: '/profile' },
]

export default function Sidebar({ isCollapsed, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const { role } = useRole()

  const dashboardUrl = getDashboardUrl(role)

  function isActive(href) {
    if (!href) return false
    if (href === dashboardUrl) return pathname === href
    return pathname.startsWith(href)
  }

  const navItems = NAV_ITEMS.map(item =>
    item.href === null ? { ...item, href: dashboardUrl } : item
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              isActive(item.href)
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? item.label : undefined}
          >
            <Icon path={ICONS[item.icon]} className="w-5 h-5 flex-shrink-0" />
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
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside className={`
        lg:hidden fixed top-0 left-0 h-full z-50 w-64
        bg-slate-900
        shadow-[4px_0_32px_rgba(0,0,0,0.6)]
        transform transition-transform duration-200
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`
        hidden lg:flex flex-col relative flex-shrink-0
        bg-slate-900
        shadow-[4px_0_24px_rgba(0,0,0,0.5)]
        h-screen
        transition-all duration-200
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}>
        <SidebarContent />
      </aside>
    </>
  )
}
