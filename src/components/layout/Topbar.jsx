'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { ROLE_LABELS } from '@/constants/roles'
import { getDashboardUrl } from '@/utils/roleRedirect'
import NotificationBell from '@/components/notifications/NotificationBell'

const NAV_LABELS = [
  { label: 'Dashboard',      href: null,              exact: true  },
  { label: 'My Modules',     href: '/modules',        exact: false },
  { label: 'Phishing Tests', href: '/phishing',       exact: false },
  { label: 'Risk Score',     href: '/risk-score',     exact: false },
  { label: 'Results',        href: '/results',        exact: false },
  { label: 'Certificates',   href: '/certificates',   exact: false },
  { label: 'Notifications',  href: '/notifications',  exact: false },
]

function Icon({ path, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

const SEARCH_ICON = 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z'

export default function Topbar({ toggleSidebar, toggleMobileSidebar, search = '', setSearch }) {
  const { profile, user, signOut } = useAuth()
  const { role } = useRole()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const roleLabel = ROLE_LABELS[role] || role
  const firstName = profile?.full_name?.split(' ')[0] || 'User'
  const userInitial = profile?.full_name?.charAt(0) || 'U'

  const dashboardUrl = getDashboardUrl(role)
  const navItems = NAV_LABELS.map(item => item.href === null ? { ...item, href: dashboardUrl } : item)
  const pageLabel = (() => {
    if (!pathname) return ''
    const exact = navItems.find(item => item.exact && pathname === item.href)
    if (exact) return exact.label
    const match = [...navItems].filter(item => !item.exact)
      .sort((a, b) => b.href.length - a.href.length)
      .find(item => pathname.startsWith(item.href))
    return match?.label || ''
  })()

  const handleSidebarToggle = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      toggleSidebar?.()
    } else {
      toggleMobileSidebar?.()
    }
  }

  return (
    <header className="h-73px bg-th-bar border-b border-th-brd flex items-center sticky top-0 z-30 shadow-sm shadow-black/5 dark:shadow-black/40">

      {/* Desktop logo column — width mirrors the sidebar so logo is centred directly above it */}
      <div className="hidden lg:flex items-center justify-center flex-shrink-0 h-full border-r border-th-brd w-48">
        <img src="/FortiBank%20LogoO.png" alt="FortiBank" className="max-w-[110px] max-h-13hy w-auto object-contain dark:hidden" />
        <img src="/FortiBank%20Logo%20darkmode%20clean.png" alt="FortiBank" className="max-w-[110px] max-h-11 w-auto object-contain hidden dark:block" />
      </div>

      {/* Mobile: hamburger + logo */}
      <div className="lg:hidden flex items-center gap-2 pl-3">
        <button
          onClick={handleSidebarToggle}
          className="flex items-center justify-center text-th-txt2 hover:text-th-txt transition-all duration-150 p-1 rounded-lg hover:bg-th-hov"
          aria-label="Toggle sidebar"
        >
          <Icon path="M4 6h16M4 12h16M4 18h16" className="w-5 h-5" />
        </button>
        <img src="/FortiBank%20LogoO.png" alt="FortiBank" className="max-w-[100px] max-h-7 w-auto object-contain dark:hidden" />
        <img src="/FortiBank%20Logo%20darkmode%20clean.png" alt="FortiBank" className="max-w-[100px] max-h-7 w-auto object-contain hidden dark:block" />
      </div>

      {/* Username + page breadcrumb — sits right of the logo column */}
      <div className="hidden sm:flex items-center gap-1.5 text-sm px-4">
        <span className="text-th-txt2">{firstName}</span>
        {pageLabel && (
          <>
            <span className="text-th-muted">|</span>
            <span className="text-th-txt font-semibold">{pageLabel}</span>
          </>
        )}
      </div>

      {/* Right: Search + Risk score + profile */}
      <div className="ml-auto flex items-center gap-3 pr-4">
        {/* Search bar */}
        <div className="hidden sm:flex relative items-center w-48">
          <input
            type="text"
            value={search}
            onChange={e => setSearch?.(e.target.value)}
            placeholder="Search"
            className="w-full bg-th-ibg border border-th-ibrd text-th-txt placeholder:text-th-muted rounded-lg px-3 py-1.5 pr-8 text-sm focus:outline-none focus:border-blue-500/60 transition-all duration-150"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-th-muted pointer-events-none">
            <Icon path={SEARCH_ICON} className="w-3.5 h-3.5" />
          </div>
        </div>

        <NotificationBell inboxHref="/notifications" />

        <div className="relative">
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-1 cursor-pointer"
          >
            <img
              src={profile?.avatar_url || user?.user_metadata?.avatar_url || '/avatar%20placeholder.jpg'}
              alt="Avatar"
              className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-full object-cover flex-shrink-0"
            />
            <Icon
              path="M19 9l-7 7-7-7"
              className={`w-3.5 h-3.5 text-th-muted transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-th-elv border border-th-brd rounded-xl shadow-xl shadow-black/10 dark:shadow-black/50 z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-th-brds">
                  <p className="text-th-txt text-sm font-medium truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-th-txt2 text-xs truncate mt-0.5">
                    {profile?.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-th-txt2 hover:text-th-txt hover:bg-th-hov text-sm transition-all duration-150"
                  >
                    <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    href="/certificates"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-th-txt2 hover:text-th-txt hover:bg-th-hov text-sm transition-all duration-150"
                  >
                    <Icon path="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" className="w-4 h-4" />
                    Certificates
                  </Link>
                </div>
                <div className="py-1 border-t border-th-brds">
                  <button
                    onClick={() => { setMenuOpen(false); signOut() }}
                    className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-500/10 text-sm transition-all duration-150 w-full"
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
