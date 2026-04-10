'use client'
import DashboardTemplate from '@/components/dashboard/DashboardTemplate'

export default function CustomerServiceAssistantDashboard() {
  return (
    <DashboardTemplate
      title="Customer Service Assistant Dashboard"
      
      focusAreas={[
        {
          icon: '🎭',
          iconBg: 'bg-red-500/15',
          title: 'Social Engineering',
          description: 'As first point of contact you are the primary target for manipulation.',
        },
        {
          icon: '🪪',
          iconBg: 'bg-orange-500/15',
          title: 'Customer Verification',
          description: 'Always verify customer identity before sharing any account information.',
        },
        {
          icon: '📧',
          iconBg: 'bg-blue-500/15',
          title: 'Phishing Awareness',
          description: 'Suspicious emails asking for customer data should be reported immediately.',
        },
        {
          icon: '🔇',
          iconBg: 'bg-yellow-500/15',
          title: 'Information Disclosure',
          description: 'Never share customer account details over phone without proper verification.',
        },
      ]}
    />
  )
}