'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function CreditOfficerDashboard() {
  return (
    <DashboardTemplate
      title="Credit Officer Dashboard"
      
      focusAreas={[
        {
          icon: '📄',
          iconBg: 'bg-red-500/15',
          title: 'Fraudulent Documents',
          description: 'Fake payslips, bank statements and title deeds are common in loan fraud.',
        },
        {
          icon: '🪪',
          iconBg: 'bg-orange-500/15',
          title: 'Identity Fraud',
          description: 'Verify KYC documents thoroughly — stolen identities are used for loans.',
        },
        {
          icon: '🎣',
          iconBg: 'bg-blue-500/15',
          title: 'Phishing',
          description: 'Watch for fake emails from supposed credit bureaus or partner institutions.',
        },
        {
          icon: '🔒',
          iconBg: 'bg-purple-500/15',
          title: 'Data Privacy',
          description: 'Credit files contain highly sensitive data — handle with strict controls.',
        },
      ]}
    />
  )
}