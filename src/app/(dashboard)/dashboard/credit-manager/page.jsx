'use client'
import { FileText, MailWarning, IdCard, Lock } from 'lucide-react'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function CreditManagerDashboard() {
  return (
    <DashboardTemplate
      title="Credit Manager Dashboard"
      
      focusAreas={[
        {
          icon: FileText,
          iconBg: 'bg-red-500/15',
          title: 'Document Fraud',
          description: 'Fraudulent loan applications with fake financial documents are common.',
        },
        {
          icon: IdCard,
          iconBg: 'bg-orange-500/15',
          title: 'Identity Theft',
          description: 'Verify customer identities thoroughly to prevent fraudulent credit applications.',
        },
        {
          icon: MailWarning,
          iconBg: 'bg-blue-500/15',
          title: 'Phishing Emails',
          description: 'Attackers may target you with fake correspondence from regulators or auditors.',
        },
        {
          icon: Lock,
          iconBg: 'bg-purple-500/15',
          title: 'Data Privacy',
          description: 'Customer financial data requires strict handling and access controls.',
        },
      ]}
    />
  )
}