'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const LABELS = {
  'teller': 'Teller',
  'branch-manager': 'Branch Manager',
  'relationship-manager': 'Relationship Manager',
  'customer-service-assistant': 'Customer Service',
  'customer-service-manager': 'CS Manager',
  'credit-officer': 'Credit Officer',
  'credit-manager': 'Credit Manager',
  'head-teller': 'Head Teller',
  'relationship-officer': 'Relationship Officer',
  'assistant-branch-manager': 'Asst. Branch Manager',
  'service-recovery-officer': 'Service Recovery',
  'dashboard': 'Dashboard',
  'modules': 'Modules',
  'phishing': 'Phishing Tests',
  'risk-score': 'Risk Score',
  'results': 'Results & Quizzes',
  'profile': 'My Profile',
  'notifications': 'Notifications',
  'certificates': 'Certificates',
  'change-password': 'Change Password',
  'users': 'Users',
  'create': 'Create New',
  'analytics': 'Analytics',
  'reports': 'Employee Dashboards',
}

function isUUID(str) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

function toLabel(seg) {
  if (isUUID(seg)) return 'Details'
  return LABELS[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export default function Breadcrumb() {
  const pathname = usePathname()

  const isAdmin = pathname.startsWith('/admin')
  const homeHref = isAdmin ? '/admin' : '/'
  const homeLabel = isAdmin ? 'Admin' : 'Home'

  let segments = pathname.split('/').filter(Boolean)
  if (isAdmin) segments = segments.slice(1)

  if (segments.length === 0) return null
  if (!isAdmin && segments[0] === 'dashboard') return null

  const crumbs = segments.map((seg, i) => {
    const href = isAdmin
      ? '/admin/' + segments.slice(0, i + 1).join('/')
      : '/' + segments.slice(0, i + 1).join('/')
    return { href, label: toLabel(seg), isLast: i === segments.length - 1 }
  })

  return (
    <nav className="flex items-center gap-1 text-xs text-th-muted mb-5">
      <Link
        href={homeHref}
        className="flex items-center gap-1 hover:text-th-txt2 transition-colors duration-150"
      >
        <Home className="w-3 h-3" />
        <span>{homeLabel}</span>
      </Link>
      {crumbs.map(crumb => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="w-3 h-3 text-th-muted opacity-50" />
          {crumb.isLast ? (
            <span className="text-th-txt font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-th-txt2 transition-colors duration-150">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
