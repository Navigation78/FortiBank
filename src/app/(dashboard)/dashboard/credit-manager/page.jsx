'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function CreditManagerDashboard() {
  return (
    <DashboardTemplate
      title="Credit Manager Dashboard"
      welcomeRole="Credit Manager"
      statsConfig={[
        { title: 'Modules Assigned',   value: '—', subtitle: 'Loading...',  icon: '📚', color: 'blue'   },
        { title: 'Modules Completed',  value: '—', subtitle: 'Loading...',  icon: '✅', color: 'green'  },
        { title: 'Risk Score',         value: '—', subtitle: 'Loading...',  icon: '🛡️', color: 'purple' },
        { title: 'Certificates',       value: '—', subtitle: 'Loading...',  icon: '🏅', color: 'yellow' },
      ]}
      focusAreas={[
        {
          icon: '📄',
          iconBg: 'bg-red-500/15',
          title: 'Document Fraud',
          description: 'Fraudulent loan applications with fake financial documents are common.',
        },
        {
          icon: '🪪',
          iconBg: 'bg-orange-500/15',
          title: 'Identity Theft',
          description: 'Verify customer identities thoroughly to prevent fraudulent credit applications.',
        },
        {
          icon: '🎣',
          iconBg: 'bg-blue-500/15',
          title: 'Phishing Emails',
          description: 'Attackers may target you with fake correspondence from regulators or auditors.',
        },
        {
          icon: '🔒',
          iconBg: 'bg-purple-500/15',
          title: 'Data Privacy',
          description: 'Customer financial data requires strict handling and access controls.',
        },
      ]}
    />
  )
}