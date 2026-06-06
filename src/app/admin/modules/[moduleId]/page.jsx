'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import CreateModuleForm from '@/components/admin/CreateModuleForm'
import { createClient } from '@/lib/supabase'

const STATUS_COLORS = {
  published: 'bg-green-500/15 text-green-400',
  draft:     'bg-th-hov text-th-txt2',
  archived:  'bg-red-500/15 text-red-400',
}

const PROGRESS_COLORS = {
  completed:   'bg-green-500/15 text-green-400',
  in_progress: 'bg-blue-500/15 text-blue-400',
  not_started: 'bg-th-hov text-th-muted',
}

function fmt(iso) {
  if (!iso) return 'N/A'
  return new Date(iso).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function EditModulePage() {
  const { moduleId } = useParams()
  const router       = useRouter()
  const supabase     = createClient()

  const [module,          setModule]          = useState(null)
  const [loading,         setLoading]         = useState(true)
  const [progressData,    setProgressData]    = useState([])
  const [progressLoading, setProgressLoading] = useState(true)
  const [actionLoading,   setActionLoading]   = useState(false)

  useEffect(() => {
    if (moduleId) {
      fetchModule()
      fetchProgress()
    }
  }, [moduleId])

  async function fetchModule() {
    const { data } = await supabase
      .from('modules')
      .select(`*, module_content(*), module_role_access(role_id)`)
      .eq('id', moduleId)
      .single()
    setModule(data)
    setLoading(false)
  }

  async function fetchProgress() {
    setProgressLoading(true)
    const res = await fetch(`/api/admin/modules/${moduleId}/progress`)
    if (res.ok) {
      const { users } = await res.json()
      setProgressData(users || [])
    }
    setProgressLoading(false)
  }

  async function togglePublish() {
    setActionLoading(true)
    const newStatus = module.status === 'published' ? 'draft' : 'published'
    await supabase.from('modules').update({ status: newStatus }).eq('id', moduleId)
    await fetchModule()
    setActionLoading(false)
  }

  async function toggleArchive() {
    setActionLoading(true)
    const newStatus = module.status === 'archived' ? 'draft' : 'archived'
    await supabase.from('modules').update({ status: newStatus }).eq('id', moduleId)
    await fetchModule()
    setActionLoading(false)
  }

  async function deleteModule() {
    if (!confirm(`Delete "${module.title}"? This cannot be undone.`)) return
    setActionLoading(true)
    const res = await fetch(`/api/admin/modules/${moduleId}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/admin/modules')
    } else {
      alert('Failed to delete module')
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <PageWrapper>
        <div className="animate-pulse h-64 bg-th-hov border border-th-brd rounded-xl" />
      </PageWrapper>
    )
  }

  const completedCount   = progressData.filter(u => u.progress.status === 'completed').length
  const inProgressCount  = progressData.filter(u => u.progress.status === 'in_progress').length
  const notStartedCount  = progressData.filter(u => u.progress.status === 'not_started').length

  return (
    <PageWrapper>

      {/* Header: breadcrumb + action buttons */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-2 text-sm text-th-muted min-w-0">
          <Link href="/admin/modules" className="hover:text-th-txt2 shrink-0">Modules</Link>
          <span>/</span>
          <span className="text-th-txt2 truncate">{module?.title}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {module?.status !== 'archived' && (
            <button
              onClick={togglePublish}
              disabled={actionLoading}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-50 ${
                module?.status === 'published'
                  ? 'bg-yellow-500/15 text-yellow-400 hover:bg-yellow-500/25'
                  : 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
              }`}
            >
              {module?.status === 'published' ? 'Unpublish' : 'Publish'}
            </button>
          )}
          <button
            onClick={toggleArchive}
            disabled={actionLoading}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-50 ${
              module?.status === 'archived'
                ? 'bg-blue-500/15 text-blue-400 hover:bg-blue-500/25'
                : 'bg-orange-500/15 text-orange-400 hover:bg-orange-500/25'
            }`}
          >
            {module?.status === 'archived' ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={deleteModule}
            disabled={actionLoading}
            className="px-3 py-1.5 bg-red-500/15 text-red-400 hover:bg-red-500/25 rounded-lg text-xs font-medium transition-all duration-150 disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Module metadata panel */}
      <div className="bg-th-srf border border-th-brd rounded-xl px-5 py-4 mb-6 flex flex-wrap gap-6">
        <div>
          <p className="text-th-muted text-xs mb-1">Status</p>
          <span className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${STATUS_COLORS[module?.status] || ''}`}>
            {module?.status || 'N/A'}
          </span>
        </div>
        <div>
          <p className="text-th-muted text-xs mb-1">Created</p>
          <p className="text-th-txt2 text-sm font-medium">{fmt(module?.created_at)}</p>
        </div>
        <div>
          <p className="text-th-muted text-xs mb-1">
            {module?.status === 'published' ? 'Published' : 'Last Updated'}
          </p>
          <p className="text-th-txt2 text-sm font-medium">{fmt(module?.updated_at)}</p>
        </div>
        {module?.duration_mins && (
          <div>
            <p className="text-th-muted text-xs mb-1">Duration</p>
            <p className="text-th-txt2 text-sm font-medium">{module.duration_mins} min</p>
          </div>
        )}
      </div>

      {/* Edit form */}
      <CreateModuleForm existingModule={{
        ...module,
        content: module?.module_content || [],
      }} />

      {/* User Progress */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-th-txt font-semibold">User Progress</h3>
            <p className="text-th-muted text-xs mt-0.5">{progressData.length} users assigned to this module</p>
          </div>
          {!progressLoading && progressData.length > 0 && (
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                <span className="text-th-txt2">{completedCount} completed</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                <span className="text-th-txt2">{inProgressCount} in progress</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-th-muted inline-block" />
                <span className="text-th-txt2">{notStartedCount} not started</span>
              </span>
            </div>
          )}
        </div>

        {progressLoading ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 bg-th-hov border border-th-brd rounded-xl animate-pulse" />
            ))}
          </div>
        ) : progressData.length === 0 ? (
          <div className="bg-th-hov border border-th-brd rounded-xl px-5 py-10 text-center">
            <p className="text-th-muted text-sm">No users are assigned to this module yet.</p>
            <p className="text-th-muted text-xs mt-1">Assign roles to this module to see progress.</p>
          </div>
        ) : (
          <div className="bg-th-srf border border-th-brd rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-th-brd">
                  <th className="text-left text-th-muted text-xs font-medium px-5 py-3">User</th>
                  <th className="text-left text-th-muted text-xs font-medium px-5 py-3 hidden sm:table-cell">Role</th>
                  <th className="text-left text-th-muted text-xs font-medium px-5 py-3">Status</th>
                  <th className="text-left text-th-muted text-xs font-medium px-5 py-3 w-40">Progress</th>
                </tr>
              </thead>
              <tbody>
                {progressData.map((user) => (
                  <tr key={user.user_id} className="border-b border-th-brd last:border-0 hover:bg-th-hov/30 transition-all duration-150">
                    <td className="px-5 py-3">
                      <p className="text-th-txt text-sm font-medium">{user.full_name}</p>
                      <p className="text-th-muted text-xs">{user.email}</p>
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell">
                      <span className="text-th-txt2 text-xs">{user.role}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${PROGRESS_COLORS[user.progress.status] || ''}`}>
                        {(user.progress.status || 'not_started').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-th-track rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              user.progress.status === 'completed' ? 'bg-green-500' :
                              (user.progress.progress_pct || 0) > 0 ? 'bg-blue-500' : 'bg-th-muted'
                            }`}
                            style={{ width: `${user.progress.progress_pct || 0}%` }}
                          />
                        </div>
                        <span className="text-th-muted text-xs w-8 text-right shrink-0">
                          {user.progress.progress_pct || 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </PageWrapper>
  )
}
