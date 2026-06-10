'use client'
import { MailWarning, IdCard, Lock, Theater } from 'lucide-react'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function CustomerServiceAssistantDashboard() {
  return (
    <DashboardTemplate
      title="Customer Service Assistant Dashboard"
      
      focusAreas={[
        {
          icon: Theater,
          iconBg: 'bg-red-500/15',
          title: 'Social Engineering',
          description: 'As first point of contact you are the primary target for manipulation.',
        },
        {
          icon: IdCard,
          iconBg: 'bg-orange-500/15',
          title: 'Customer Verification',
          description: 'Always verify customer identity before sharing any account information.',
        },
        {
          icon: MailWarning,
          iconBg: 'bg-blue-500/15',
          title: 'Phishing Awareness',
          description: 'Suspicious emails asking for customer data should be reported immediately.',
        },
        {
          icon: Lock,
          iconBg: 'bg-yellow-500/15',
          title: 'Information Disclosure',
          description: 'Never share customer account details over phone without proper verification.',
        },
      ]}
    />
  )
}