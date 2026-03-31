// ============================================================
// src/app/(auth)/layout.jsx
// Shared layout for all auth pages (login, forgot, reset).
// ============================================================

import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FortiBank | Secure Access',
  description: 'FortiBank Cybersecurity Training Platform',
}

export default function AuthLayout({ children }) {
  return (
    <div className={`${inter.className} min-h-screen bg-slate-950 flex items-center justify-center p-4`}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950 via-slate-950 to-slate-950 opacity-60" />
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />

      {/* Content */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">FortiBank</h1>
            <p className="text-blue-400 text-xs tracking-widest uppercase">Security Training</p>
          </div>
        </div>

        {children}

        <p className="text-center text-slate-600 text-xs mt-8">
          © {new Date().getFullYear()} FortiBank. All rights reserved.
        </p>
      </div>
    </div>
  )
}