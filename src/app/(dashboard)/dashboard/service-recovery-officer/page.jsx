'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function ServiceRecoveryOfficerDashboard() {
  return (
    <DashboardTemplate
      title="Service Recovery Officer Dashboard"
      welcomeRole="Service Recovery Officer"
      statsConfig={[
        { title: 'Modules Assigned',   value: '—', subtitle: 'Loading...',  icon: '📚', color: 'blue'   },
        { title: 'Modules Completed',  value: '—', subtitle: 'Loading...',  icon: '✅', color: 'green'  },
        { title: 'Risk Score',         value: '—', subtitle: 'Loading...',  icon: '🛡️', color: 'purple' },
        { title: 'Certificates',       value: '—', subtitle: 'Loading...',  icon: '🏅', color: 'yellow' },
      ]}
      focusAreas={[
        {
          icon: '🎭',
          iconBg: 'bg-red-500/15',
          title: 'Social Engineering',
          description: 'Fraudsters exploit complaint processes to extract sensitive information.',
        },
        {
          icon: '📞',
          iconBg: 'bg-orange-500/15',
          title: 'Vishing Attacks',
          description: 'Phone-based attackers may pretend to be distressed customers.',
        },
        {
          icon: '🔑',
          iconBg: 'bg-blue-500/15',
          title: 'Account Access Requests',
          description: 'Never reset account credentials or override controls without full verification.',
        },
        {
          icon: '📝',
          iconBg: 'bg-green-500/15',
          title: 'Complaint Escalation',
          description: 'Escalate suspicious complaints — not all are genuine customer issues.',
        },
      ]}
    />
  )
}