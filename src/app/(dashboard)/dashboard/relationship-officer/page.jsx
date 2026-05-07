'use client'
import { AlertTriangle, BarChart3, Fish, IdCard } from 'lucide-react'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function RelationshipOfficerDashboard() {
  return (
    <DashboardTemplate
      title="Relationship Officer Dashboard"
      
      focusAreas={[
        {
          icon: Fish,
          iconBg: 'bg-red-500/15',
          title: 'Phishing Emails',
          description: 'Be cautious of emails requesting client data or account changes.',
        },
        {
          icon: IdCard,
          iconBg: 'bg-orange-500/15',
          title: 'Identity Verification',
          description: 'Always verify client identity before processing account instructions.',
        },
        {
          icon: BarChart3,
          iconBg: 'bg-blue-500/15',
          title: 'Data Handling',
          description: 'Protect client account information and avoid sharing over unsecured channels.',
        },
        {
          icon: AlertTriangle,
          iconBg: 'bg-yellow-500/15',
          title: 'Suspicious Transactions',
          description: 'Report unusual account activity or suspicious client requests immediately.',
        },
      ]}
    />
  )
}
