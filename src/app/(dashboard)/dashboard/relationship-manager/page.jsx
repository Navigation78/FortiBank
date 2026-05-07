'use client'
import { Briefcase, FileText, Handshake, Lock } from 'lucide-react'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function RelationshipManagerDashboard() {
  return (
    <DashboardTemplate
      title="Relationship Manager Dashboard"
      
      focusAreas={[
        {
          icon: Briefcase,
          iconBg: 'bg-red-500/15',
          title: 'Business Email Compromise',
          description: 'Attackers impersonate clients or partners to intercept financial transactions.',
        },
        {
          icon: FileText,
          iconBg: 'bg-orange-500/15',
          title: 'Document & Contract Fraud',
          description: 'Verify authenticity of financial documents and client instructions carefully.',
        },
        {
          icon: Handshake,
          iconBg: 'bg-blue-500/15',
          title: 'Social Engineering',
          description: 'Fraudsters exploit relationship trust to gain access to client accounts.',
        },
        {
          icon: Lock,
          iconBg: 'bg-purple-500/15',
          title: 'Data Confidentiality',
          description: 'Client portfolio data is highly sensitive — handle with strict protocols.',
        },
      ]}
    />
  )
}