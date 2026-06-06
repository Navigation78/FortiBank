'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getDashboardUrl } from '@/utils/roleRedirect'

export default function DashboardIndexPage() {
  const router = useRouter()
  const { role, loading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }
    router.replace(getDashboardUrl(role))
  }, [loading, isAuthenticated, role, router])

  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-th-txt2 text-sm">Redirecting to your dashboard…</p>
      </div>
    </div>
  )
}
