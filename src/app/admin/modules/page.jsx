'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import { createClient } from '@/lib/supabase'

const STATUS_COLORS = {
  published: 'bg-green-500/15 text-green-400',
  draft:     'bg-slate-700 text-slate-400',
  archived:  'bg-red-500/15 text-red-400',
}

export default function AdminModulesPage() {
  const supabase        = createClient()
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchModules() }, [])

  async function fetchModules() {
    setLoading(true)
    const { data } = await supabase
      .from('modules')
      .select('id, title, description, status, order_index, duration_mins, created_at')
      .order('order_index')
    setModules(data || [])
    setLoading(false)
  }

  async function togglePublish(module) {
    const newStatus = module.status === 'published' ? 'draft' : 'published'
    await supabase.from('modules').update({ status: newStatus }).eq('id', module.id)
    fetchModules()
  }

  return (
    <>
      <Topbar title="Training Modules" />
      <PageWrapper>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white text-xl font-bold">All Modules</h2>
            <p className="text-slate-400 text-sm mt-0.5">{modules.length} total modules</p>
          </div>
          <Link
            href="/admin/modules/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Module
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-900 border border-slate-800 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">#</th>
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Module</th>
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden sm:table-cell">Status</th>
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3 hidden md:table-cell">Duration</th>
                  <th className="text-left text-slate-500 text-xs font-medium px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module, i) => (
                  <tr key={module.id} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-3 text-slate-500 text-sm">{module.order_index}</td>
                    <td className="px-5 py-3">
                      <p className="text-white text-sm font-medium">{module.title}</p>
                      {module.description && (
                        <p className="text-slate-500 text-xs truncate max-w-xs">{module.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${STATUS_COLORS[module.status]}`}>
                        {module.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className="text-slate-400 text-sm">{module.duration_mins ? `${module.duration_mins} min` : '—'}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Link href={`/admin/modules/${module.id}`} className="text-blue-400 hover:text-blue-300 text-xs font-medium">Edit</Link>
                        <button
                          onClick={() => togglePublish(module)}
                          className={`text-xs font-medium transition-colors ${module.status === 'published' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}
                        >
                          {module.status === 'published' ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
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