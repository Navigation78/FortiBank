'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function RelationshipManagerDashboard() {
  return (
    <DashboardTemplate
      title="Relationship Manager Dashboard"
      welcomeRole="Relationship Manager"
      statsConfig={[
        { title: 'Modules Assigned',   value: '—', subtitle: 'Loading...',  icon: '📚', color: 'blue'   },
        { title: 'Modules Completed',  value: '—', subtitle: 'Loading...',  icon: '✅', color: 'green'  },
        { title: 'Risk Score',         value: '—', subtitle: 'Loading...',  icon: '🛡️', color: 'purple' },
        { title: 'Certificates',       value: '—', subtitle: 'Loading...',  icon: '🏅', color: 'yellow' },
      ]}
      focusAreas={[
        {
          icon: '💼',
          iconBg: 'bg-red-500/15',
          title: 'Business Email Compromise',
          description: 'Attackers impersonate clients or partners to intercept financial transactions.',
        },
        {
          icon: '📄',
          iconBg: 'bg-orange-500/15',
          title: 'Document & Contract Fraud',
          description: 'Verify authenticity of financial documents and client instructions carefully.',
        },
        {
          icon: '🤝',
          iconBg: 'bg-blue-500/15',
          title: 'Social Engineering',
          description: 'Fraudsters exploit relationship trust to gain access to client accounts.',
        },
        {
          icon: '🔒',
          iconBg: 'bg-purple-500/15',
          title: 'Data Confidentiality',
          description: 'Client portfolio data is highly sensitive — handle with strict protocols.',
        },
      ]}
    />
  )
}