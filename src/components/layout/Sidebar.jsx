'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
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
  logout:    'M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
  menu:      'M4 6h16M4 12h16M4 18h16',
  sun:       'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
  moon:      'M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z',
  search:    'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
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

const ACTIVE_BG   = '#3B6FF0'
const HOVER_BG    = 'rgba(59,111,240,0.15)'
const DIVIDER_CLR = 'rgba(255,255,255,0.08)'

function Divider() {
  return <div style={{ height: '0.5px', background: DIVIDER_CLR, margin: '6px 12px' }} />
}

function IconBtn({ onClick, title, children }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: '#fff', display: 'flex', alignItems: 'center',
        justifyContent: 'center', borderRadius: 8, padding: 7,
        transition: 'background 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = HOVER_BG }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

function SidebarInner({ collapsed, onToggle, navItems, isActive, darkMode, setDarkMode, onSignOut, onCloseMobile }) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? navItems.filter(item => item.label.toLowerCase().includes(search.toLowerCase()))
    : navItems

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* Hamburger */}
      <div style={{
        padding: '16px 10px 8px',
        display: 'flex',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <IconBtn onClick={onToggle} title="Toggle sidebar">
          <Icon path={ICONS.menu} className="w-5 h-5" />
        </IconBtn>
      </div>

      {/* Search */}
      <div style={{ padding: '0 10px 10px', flexShrink: 0 }}>
        {collapsed ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconBtn onClick={onToggle} title="Search (expand sidebar)">
              <Icon path={ICONS.search} className="w-4 h-4" />
            </IconBtn>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.4)', pointerEvents: 'none',
              display: 'flex', alignItems: 'center',
            }}>
              <Icon path={ICONS.search} className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search menu..."
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.05)',
                border: '0.5px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                padding: '7px 10px 7px 30px',
                color: '#fff',
                fontSize: 12,
                outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(59,111,240,0.6)' }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.1)' }}
            />
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '0 10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {filtered.length === 0 ? (
          !collapsed && (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, textAlign: 'center', padding: '12px 0' }}>
              No results
            </p>
          )
        ) : filtered.map(item => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: collapsed ? 0 : 10,
                padding: '10px 12px',
                borderRadius: 10,
                textDecoration: 'none',
                background: active ? ACTIVE_BG : 'transparent',
                color: '#fff',
                fontWeight: active ? 500 : 400,
                fontSize: 14,
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = HOVER_BG }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon path={ICONS[item.icon]} className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <Divider />

      {/* Theme toggle */}
      <div style={{ padding: '8px 10px', flexShrink: 0 }}>
        {collapsed ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <IconBtn
              onClick={() => setDarkMode(d => !d)}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <Icon path={darkMode ? ICONS.moon : ICONS.sun} className="w-4 h-4" />
            </IconBtn>
          </div>
        ) : (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: 3, gap: 2 }}>
            {[
              { label: 'Light', icon: 'sun',  value: false },
              { label: 'Dark',  icon: 'moon', value: true  },
            ].map(opt => (
              <button
                key={opt.label}
                onClick={() => setDarkMode(opt.value)}
                title={`${opt.label} mode`}
                style={{
                  flex: 1, border: 'none', cursor: 'pointer',
                  background: darkMode === opt.value ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: '#fff',
                  borderRadius: 6, padding: '6px 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.15s',
                  opacity: darkMode === opt.value ? 1 : 0.45,
                }}
              >
                <Icon path={ICONS[opt.icon]} className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}
      </div>

      <Divider />

      {/* Logout */}
      <div style={{ padding: '8px 10px', paddingBottom: 20, flexShrink: 0 }}>
        <button
          onClick={onSignOut}
          title={collapsed ? 'Logout' : undefined}
          style={{
            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: collapsed ? 0 : 10,
            padding: '10px 12px',
            borderRadius: 10,
            color: '#fff',
            fontSize: 14,
            transition: 'background 0.15s',
            opacity: 0.7,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.12)'
            e.currentTarget.style.opacity = '1'
            e.currentTarget.style.color = '#f87171'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.opacity = '0.7'
            e.currentTarget.style.color = '#fff'
          }}
        >
          <Icon path={ICONS.logout} className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span style={{ flex: 1 }}>Logout</span>}
        </button>
      </div>

    </div>
  )
}

export default function Sidebar({ isCollapsed, onToggle, isMobileOpen, setIsMobileOpen }) {
  const pathname = usePathname()
  const { signOut } = useAuth()
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
    onSignOut: signOut,
    onCloseMobile: () => setIsMobileOpen(false),
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
        className={`lg:hidden fixed top-0 left-0 h-full z-50 w-64 transform transition-transform duration-200 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#1a2035' }}
      >
        <SidebarInner {...sharedProps} collapsed={false} onToggle={() => setIsMobileOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col relative flex-shrink-0 h-screen transition-all duration-200 ${isCollapsed ? 'w-[68px]' : 'w-64'}`}
        style={{ background: '#1a2035' }}
      >
        <SidebarInner {...sharedProps} collapsed={isCollapsed} onToggle={onToggle} />
      </aside>
    </>
  )
}
