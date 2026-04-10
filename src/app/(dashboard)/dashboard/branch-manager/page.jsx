'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function BranchManagerDashboard() {
  return (
    <DashboardTemplate
      title="Branch Manager Dashboard"
      
      focusAreas={[
        {
          icon: '🎯',
          iconBg: 'bg-red-500/15',
          title: 'Spear Phishing (Whaling)',
          description: 'As branch leader you are a high-value target for targeted email attacks.',
        },
        {
          icon: '👥',
          iconBg: 'bg-orange-500/15',
          title: 'Social Engineering',
          description: 'Attackers may impersonate staff, auditors or regulators to deceive you.',
        },
        {
          icon: '🔐',
          iconBg: 'bg-blue-500/15',
          title: 'Credential Security',
          description: 'Your credentials grant wide system access — protect them rigorously.',
        },
        {
          icon: '📋',
          iconBg: 'bg-purple-500/15',
          title: 'Compliance & Oversight',
          description: 'Ensure your team follows cybersecurity policies and reports incidents.',
        },
      ]}
    />
  )
}