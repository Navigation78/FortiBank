'use client'

// src/components/dashboard/DashboardTemplate.jsx
// Shared template used by all 11 role dashboard pages.
// Each role page passes its own config for title, focus areas etc.

import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import StatsCard from '@/components/dashboard/StatsCard'
import RiskScoreGauge from '@/components/dashboard/RiskScoreGauge'
import AlertBanner from '@/components/dashboard/AlertBanner'
import ProgressChart from '@/components/dashboard/ProgressChart'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardTemplate({
  title,           // page title shown in topbar
  welcomeRole,     // role display name shown in welcome message
  focusAreas,      // array of { title, description, icon, color } — role-specific threat focus
  statsConfig,     // array of { title, value, subtitle, icon, color } — role-specific stats
}) {
  const { profile } = useAuth()

  // Mock data — will be replaced with real Supabase data in Week 4/5
  const mockModules = []
  const mockActivities = []
  const mockRiskScore = 0
  const mockAlert = null

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  return (
    <>
      <Topbar title={title} />
      <PageWrapper>

        {/* Alert banner — shown when risk score is high */}
        {mockAlert && (
          <AlertBanner
            severity={mockAlert.severity}
            message={mockAlert.message}
            riskScore={mockRiskScore}
          />
        )}

        {/* Welcome header */}
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">
            Good {getTimeOfDay()}, {firstName} 👋
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Here's your security training overview for today.
          </p>
        </div>

        {/* Stats row */}
        {statsConfig && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsConfig.map((stat, i) => (
              <StatsCard key={i} {...stat} />
            ))}
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Risk score gauge — takes 1 column */}
          <div className="lg:col-span-1">
            <RiskScoreGauge score={mockRiskScore} />
          </div>

          {/* Progress chart — takes 2 columns */}
          <div className="lg:col-span-2">
            <ProgressChart modules={mockModules} />
          </div>
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent activity — takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentActivity activities={mockActivities} />
          </div>

          {/* Role-specific threat focus areas — takes 1 column */}
          {focusAreas && (
            <div className="lg:col-span-1">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">Your Risk Focus Areas</h3>
                <div className="space-y-3">
                  {focusAreas.map((area, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${area.iconBg}`}>
                        <span className="text-sm">{area.icon}</span>
                      </div>
                      <div>
                        <p className="text-slate-300 text-sm font-medium">{area.title}</p>
                        <p className="text-slate-500 text-xs mt-0.5">{area.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </PageWrapper>
    </>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}