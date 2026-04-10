'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function HeadTellerDashboard() {
  return (
    <DashboardTemplate
      title="Head Teller Dashboard"
      
      focusAreas={[
        {
          icon: '🏦',
          iconBg: 'bg-red-500/15',
          title: 'Vault Security',
          description: 'Physical and cyber controls around vault access must never be bypassed.',
        },
        {
          icon: '🎭',
          iconBg: 'bg-orange-500/15',
          title: 'Social Engineering',
          description: 'Attackers may pressure or manipulate you into bypassing cash controls.',
        },
        {
          icon: '👥',
          iconBg: 'bg-blue-500/15',
          title: 'Teller Oversight',
          description: 'Monitor your team for unusual transactions or suspicious behaviour.',
        },
        {
          icon: '🎣',
          iconBg: 'bg-yellow-500/15',
          title: 'Phishing Awareness',
          description: 'Targeted emails may attempt to compromise teller system credentials.',
        },
      ]}
    />
  )
}