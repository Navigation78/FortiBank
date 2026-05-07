'use client'
import { FileText, Key, Phone, Theater } from 'lucide-react'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function ServiceRecoveryOfficerDashboard() {
  return (
    <DashboardTemplate
      title="Service Recovery Officer Dashboard"
     
      focusAreas={[
        {
          icon: Theater,
          iconBg: 'bg-red-500/15',
          title: 'Social Engineering',
          description: 'Fraudsters exploit complaint processes to extract sensitive information.',
        },
        {
          icon: Phone,
          iconBg: 'bg-orange-500/15',
          title: 'Vishing Attacks',
          description: 'Phone-based attackers may pretend to be distressed customers.',
        },
        {
          icon: Key,
          iconBg: 'bg-blue-500/15',
          title: 'Account Access Requests',
          description: 'Never reset account credentials or override controls without full verification.',
        },
        {
          icon: FileText,
          iconBg: 'bg-green-500/15',
          title: 'Complaint Escalation',
          description: 'Escalate suspicious complaints — not all are genuine customer issues.',
        },
      ]}
    />
  )
}