// ============================================================
// src/app/layout.jsx
// Root layout — wraps entire app with AuthProvider.
// ============================================================

import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FortiBank | Cybersecurity Training',
  description: 'Role-based cybersecurity awareness training for FortiBank employees.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}