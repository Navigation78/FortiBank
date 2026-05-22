'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import NotificationBell from '@/components/notifications/NotificationBell'

function Icon({ path, className = 'w-5 h-5' }) {
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

const ICONS = {
  menu:   'M4 6h16M4 12h16M4 18h16',
  sun:    'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
  moon:   'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z',
  search: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
}

function SidebarInner({ collapsed, onToggle, isActive, darkMode, setDarkMode, onCloseMobile, search }) {
  const filtered = search.trim()
    ? NAV_ITEMS.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
    : NAV_ITEMS

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
          const active = isActive(item)
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
              <Icon path={item.icon} className="w-5 h-5 flex-shrink-0" />
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

function AdminSidebar({ isCollapsed, onToggle, isMobileOpen, setIsMobileOpen, search }) {
  const pathname = usePathname()
  const [darkMode, setDarkMode] = useState(true)

  function isActive(item) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const sharedProps = {
    isActive, darkMode, setDarkMode,
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
        className={`lg:hidden fixed top-0 left-0 h-full z-50 w-48 bg-slate-900 border-r border-white/[0.06] transform transition-transform duration-200 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarInner {...sharedProps} collapsed={false} onToggle={() => setIsMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col relative flex-shrink-0 h-full bg-slate-900 border-r border-white/[0.06] transition-all duration-200 ${isCollapsed ? 'w-[60px]' : 'w-48'}`}
      >
        <SidebarInner {...sharedProps} collapsed={isCollapsed} onToggle={onToggle} />
      </aside>
    </>
  )
}

function AdminTopbar({ toggleMobileSidebar, search, setSearch }) {
  const { profile, signOut } = useAuth()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const displayName = profile?.full_name === 'New User' || !profile?.full_name
    ? 'System Admin'
    : profile?.full_name
  const firstName   = displayName.split(' ')[0]
  const userInitial = displayName.charAt(0)

  const pageLabel = (() => {
    const exact = NAV_ITEMS.find(item => item.exact && pathname === item.href)
    if (exact) return exact.label
    const match = [...NAV_ITEMS].filter(item => !item.exact)
      .sort((a, b) => b.href.length - a.href.length)
      .find(item => pathname.startsWith(item.href))
    return match?.label || ''
  })()

  return (
    <header className="bg-slate-900 border-b border-white/[0.06] flex items-center px-4 py-3 z-30 shadow-sm shadow-black/40 flex-shrink-0">
      <div className="flex items-center gap-4">
        {/* Mobile-only hamburger */}
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden flex items-center justify-center text-white transition-all duration-150 p-1 rounded-lg hover:bg-white/[0.08]"
          aria-label="Open sidebar"
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
            {pageLabel && (
              <>
                <span className="text-slate-600">|</span>
                <span className="text-slate-200 font-semibold">{pageLabel}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Search bar */}
        <div className="hidden sm:block" style={{ position: 'relative', width: 200 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search"
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              padding: '8px 36px 8px 14px',
              color: '#fff',
              fontSize: 13,
              outline: 'none',
              transition: 'border-color 0.2s, background 0.2s',
              letterSpacing: '0.01em',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(59,111,240,0.7)'
              e.target.style.background  = 'rgba(255,255,255,0.10)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(255,255,255,0.12)'
              e.target.style.background  = 'rgba(255,255,255,0.07)'
            }}
          />
          <div style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            color: 'rgba(255,255,255,0.35)', pointerEvents: 'none',
            display: 'flex', alignItems: 'center',
          }}>
            <Icon path={ICONS.search} className="w-3.5 h-3.5" />
          </div>
        </div>

        <NotificationBell inboxHref="/admin/notifications" />

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
                  <p className="text-slate-100 text-sm font-medium truncate">{displayName}</p>
                  <p className="text-slate-400 text-xs truncate mt-0.5">{profile?.email}</p>
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

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed]   = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [search, setSearch]             = useState('')

  const toggleSidebar       = () => setIsCollapsed(c => !c)
  const toggleMobileSidebar = () => setIsMobileOpen(o => !o)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#080f1e]">
      {/* Topbar spans full width at the top — FortiBank logo always far left */}
      <AdminTopbar
        toggleMobileSidebar={toggleMobileSidebar}
        search={search}
        setSearch={setSearch}
      />
      {/* Sidebar + content row sits below the topbar */}
      <div className="flex flex-1 min-h-0">
        <AdminSidebar
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
          search={search}
        />
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
