'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function AssistantBranchManagerDashboard() {
  return (
    <DashboardTemplate
      title="Assistant Branch Manager Dashboard"
      
      focusAreas={[
        {
          icon: '🎯',
          iconBg: 'bg-red-500/15',
          title: 'Phishing Attacks',
          description: 'You deputise the branch manager making you a secondary high-value target.',
        },
        {
          icon: '⚙️',
          iconBg: 'bg-orange-500/15',
          title: 'Operational Security',
          description: 'Oversee daily operations with strict access control and data handling.',
        },
        {
          icon: '🔍',
          iconBg: 'bg-blue-500/15',
          title: 'Insider Threats',
          description: 'Monitor for unusual staff behaviour or access patterns in branch systems.',
        },
        {
          icon: '📊',
          iconBg: 'bg-green-500/15',
          title: 'Compliance Monitoring',
          description: 'Ensure all teams adhere to cybersecurity procedures and reporting.',
        },
      ]}
    />
  )
}