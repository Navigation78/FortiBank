'use client'
import { Building2, MailWarning, Theater, Users } from 'lucide-react'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function HeadTellerDashboard() {
  return (
    <DashboardTemplate
      title="Head Teller Dashboard"
      
      focusAreas={[
        {
          icon: Building2,
          iconBg: 'bg-red-500/15',
          title: 'Vault Security',
          description: 'Physical and cyber controls around vault access must never be bypassed.',
        },
        {
          icon: Theater,
          iconBg: 'bg-orange-500/15',
          title: 'Social Engineering',
          description: 'Attackers may pressure or manipulate you into bypassing cash controls.',
        },
        {
          icon: Users,
          iconBg: 'bg-blue-500/15',
          title: 'Teller Oversight',
          description: 'Monitor your team for unusual transactions or suspicious behaviour.',
        },
        {
          icon: MailWarning,
          iconBg: 'bg-yellow-500/15',
          title: 'Phishing Awareness',
          description: 'Targeted emails may attempt to compromise teller system credentials.',
        },
      ]}
    />
  )
}