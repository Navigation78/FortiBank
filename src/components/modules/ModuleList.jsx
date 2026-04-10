// src/components/modules/ModuleList.jsx
// Grid of module cards with filter tabs

import { useState } from 'react'
import ModuleCard from '@/components/modules/ModuleCard'

const FILTERS = [
  { key: 'all',         label: 'All' },
  { key: 'not_started', label: 'Not Started' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed',   label: 'Completed' },
]

export default function ModuleList({ modules = [], loading = false }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? modules
    : modules.filter(m => (m.progress?.status || 'not_started') === filter)

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-5 animate-pulse">
            <div className="h-3 bg-slate-800 rounded w-1/3 mb-3" />
            <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
            <div className="h-3 bg-slate-800 rounded w-full mb-4" />
            <div className="h-1.5 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {FILTERS.map(f => {
          const count = f.key === 'all'
            ? modules.length
            : modules.filter(m => (m.progress?.status || 'not_started') === f.key).length

          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {f.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                filter === f.key ? 'bg-blue-500/50' : 'bg-slate-700'
              }`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Module grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(module => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">No modules found</p>
          <p className="text-slate-600 text-sm mt-1">
            {filter === 'all' ? 'No modules have been assigned to your role yet.' : `No ${filter.replace('_', ' ')} modules.`}
          </p>
        </div>
      )}
    </div>
  )
}