'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function TellerDashboard() {
  return (
    <DashboardTemplate
      title="Bank Teller Dashboard"
      
      focusAreas={[
        {
          icon: '🎭',
          iconBg: 'bg-red-500/15',
          title: 'Social Engineering',
          description: 'You are the most targeted frontline staff — always verify before acting.',
        },
        {
          icon: '💵',
          iconBg: 'bg-orange-500/15',
          title: 'Cash & Counterfeit Fraud',
          description: 'Know the procedures for detecting and handling suspicious currency.',
        },
        {
          icon: '🎣',
          iconBg: 'bg-blue-500/15',
          title: 'Phishing Emails',
          description: 'Never click links in emails asking for your system login credentials.',
        },
        {
          icon: '🔐',
          iconBg: 'bg-purple-500/15',
          title: 'System Credentials',
          description: 'Never share your teller system password — not even with supervisors.',
        },
      ]}
    />
  )
}