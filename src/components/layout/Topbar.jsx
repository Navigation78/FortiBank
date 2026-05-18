'use client'

// src/components/layout/Topbar.jsx
// Top navigation bar with GitHub-style layout
// Left: Hamburger menu, logo, app name, username
// Right: Risk score badge, user profile menu

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRole } from '@/hooks/useRole'
import { ROLE_LABELS } from '@/constants/roles'

function Icon({ path, className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  )
}

export default function Topbar({ toggleSidebar, isCollapsed, toggleMobileSidebar }) {
  const { profile, signOut } = useAuth()
  const { role } = useRole()
  const [menuOpen, setMenuOpen] = useState(false)

  const roleLabel = ROLE_LABELS[role] || role
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
      {/* Left: Hamburger, Logo, name */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSidebarToggle}
          className="flex items-center justify-center text-slate-400 hover:text-white transition-all duration-150 p-1 rounded-lg hover:bg-white/[0.06]"
          aria-label="Toggle sidebar"
        >
          <Icon path="M4 6h16M4 12h16M4 18h16" className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
            <Icon
              path="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              className="w-3 h-3 text-white"
            />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-sm">
            <span className="text-slate-100 font-semibold">FortiBank</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">{firstName}</span>
          </div>
        </div>
      </div>

      {/* Right: Risk score + profile */}
      <div className="ml-auto flex items-center gap-3">
        <Link
          href="/risk-score"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.14] rounded-lg transition-all duration-150"
        >
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-slate-300 text-xs font-medium">Risk Score</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-2 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.14] rounded-lg transition-all duration-150"
          >
            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-300 font-semibold text-xs">{userInitial}</span>
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
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/[0.06] text-sm transition-all duration-150"
                  >
                    <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    href="/certificates"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/[0.06] text-sm transition-all duration-150"
                  >
                    <Icon path="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" className="w-4 h-4" />
                    Certificates
                  </Link>
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
