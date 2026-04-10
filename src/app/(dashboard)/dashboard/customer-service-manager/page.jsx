'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function CustomerServiceManagerDashboard() {
  return (
    <DashboardTemplate
      title="Customer Service Manager Dashboard"
      
      focusAreas={[
        {
          icon: '🎭',
          iconBg: 'bg-red-500/15',
          title: 'Social Engineering',
          description: 'Customers and attackers may use emotional manipulation to extract information.',
        },
        {
          icon: '📞',
          iconBg: 'bg-orange-500/15',
          title: 'Vishing (Voice Phishing)',
          description: 'Phone-based fraud targeting staff who handle sensitive customer interactions.',
        },
        {
          icon: '🔑',
          iconBg: 'bg-blue-500/15',
          title: 'Unauthorised Access',
          description: 'Ensure customer service staff only access data they need for their role.',
        },
        {
          icon: '📢',
          iconBg: 'bg-green-500/15',
          title: 'Incident Reporting',
          description: 'Train your team to promptly report suspicious customer interactions.',
        },
      ]}
    />
  )
}