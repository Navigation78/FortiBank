'use client'

// src/app/(dashboard)/modules/page.jsx
// Shows all modules assigned to the current user's role


import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import ModuleList from '@/components/modules/ModuleList'
import StatsCard from '@/components/dashboard/StatsCard'
import { useModules } from '@/hooks/useModules'

export default function ModulesPage() {
  const { modules, loading, stats } = useModules()

  return (
    <>
      <Topbar title="My Training Modules" />
      <PageWrapper>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Modules"
            value={loading ? '—' : stats.total}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
            color="blue"
          />
          <StatsCard
            title="Completed"
            value={loading ? '—' : stats.completed}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            color="green"
          />
          <StatsCard
            title="In Progress"
            value={loading ? '—' : stats.inProgress}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            color="yellow"
          />
          <StatsCard
            title="Overall Progress"
            value={loading ? '—' : `${stats.overallPct}%`}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            color="purple"
          />
        </div>

        {/* Module list */}
        <ModuleList modules={modules} loading={loading} />

      </PageWrapper>
    </>
  )
}