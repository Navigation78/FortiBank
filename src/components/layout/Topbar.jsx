'use client'

// src/components/layout/Topbar.jsx
// Top navigation bar with page title, notifications and user menu


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

export default function Topbar({ title }) {
  const { profile, signOut } = useAuth()
  const { role } = useRole()
  const [menuOpen, setMenuOpen] = useState(false)

  const roleLabel = ROLE_LABELS[role] || role

  return (
    <header className="h-16 bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">

      {/* Page title */}
      <div className="pl-10 lg:pl-0">
        <h1 className="text-white font-semibold text-lg">{title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">

        {/* Risk score quick badge */}
        <Link
          href="/risk-score"
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-slate-300 text-xs font-medium">Risk Score</span>
        </Link>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
              <span className="text-blue-400 font-semibold text-xs">
                {profile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-white text-xs font-medium leading-tight">
                {profile?.full_name?.split(' ')[0] || 'User'}
              </p>
              <p className="text-slate-400 text-[10px] leading-tight">{roleLabel}</p>
            </div>
            <Icon
              path="M19 9l-7 7-7-7"
              className={`w-4 h-4 text-slate-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700">
                  <p className="text-white text-sm font-medium truncate">
                    {profile?.full_name || 'User'}
                  </p>
                  <p className="text-slate-400 text-xs truncate">
                    {profile?.email}
                  </p>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-colors"
                  >
                    <Icon path="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" className="w-4 h-4" />
                    My Profile
                  </Link>
                  <Link
                    href="/certificates"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-700 text-sm transition-colors"
                  >
                    <Icon path="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" className="w-4 h-4" />
                    Certificates
                  </Link>
                </div>
                <div className="py-1 border-t border-slate-700">
                  <button
                    onClick={() => { setMenuOpen(false); signOut() }}
                    className="flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-400/10 text-sm transition-colors w-full"
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