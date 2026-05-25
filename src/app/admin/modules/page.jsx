'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'

const STATUS_COLORS = {
  published: 'bg-green-500/15 text-green-400',
  draft:     'bg-th-hov text-th-txt2',
  archived:  'bg-red-500/15 text-red-400',
}

export default function AdminModulesPage() {
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchModules() }, [])

  async function fetchModules() {
    setLoading(true)
    const response = await fetch('/api/admin/modules')
    const { modules: data } = await response.json()
    setModules(data || [])
    setLoading(false)
  }

  function formatModuleCode(orderIndex) {
    return orderIndex ? `FBM${String(orderIndex).padStart(3, '0')}` : '-'
  }

  return (
    <>
      <PageWrapper>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-th-txt text-xl font-bold">All Modules</h4>
            <p className="text-th-muted text-sm mt-0.5">{modules.length} total modules</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/modules/create"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-all duration-150"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Module
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-th-hov border border-th-brd rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-th-srf border border-th-brd rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-th-brd">
                  <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Code</th>
                  <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Module</th>
                  <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden sm:table-cell">Status</th>
                  <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden md:table-cell">Duration</th>
                  <th className="text-left text-th-muted text-xs font-medium px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.id} className="border-b border-th-brd last:border-0 hover:bg-th-hov/30 transition-all duration-150">
                    <td className="px-5 py-3 text-th-muted text-sm">{formatModuleCode(module.order_index)}</td>
                    <td className="px-5 py-3">
                      <p className="text-th-txt text-sm font-medium">{module.title}</p>
                      {module.description && (
                        <p className="text-th-muted text-xs truncate max-w-xs">{module.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${STATUS_COLORS[module.status]}`}>
                        {module.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-th-txt2 text-sm">{module.duration_mins ? `${module.duration_mins} min` : '-'}</span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={`/admin/modules/${module.id}`}
                        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs font-medium transition-all duration-150"
                      >
                        View Details
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageWrapper>
    </>
  )
}
