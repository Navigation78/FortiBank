'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PageWrapper from '@/components/layout/PageWrapper'
import CreateModuleForm from '@/components/admin/CreateModuleForm'
import { createClient } from '@/lib/supabase'

export default function EditModulePage() {
  const { moduleId }      = useParams()
  const supabase          = createClient()
  const [module, setModule] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { if (moduleId) fetchModule() }, [moduleId])

  async function fetchModule() {
    const { data } = await supabase
      .from('modules')
      .select(`*, module_content(*), module_role_access(role_id)`)
      .eq('id', moduleId)
      .single()
    setModule(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <>
        <PageWrapper>
          <div className="animate-pulse h-64 bg-slate-800 border border-white/[0.08] rounded-xl" />
        </PageWrapper>
      </>
    )
  }

  const STATUS_COLORS = {
    published: 'bg-green-500/15 text-green-400',
    draft:     'bg-white/[0.06] text-slate-300',
    archived:  'bg-red-500/15 text-red-400',
  }

  function fmt(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <>
      <PageWrapper>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/admin/modules" className="hover:text-slate-300">Modules</Link>
          <span>/</span>
          <span className="text-slate-300 truncate">{module?.title}</span>
        </div>

        {/* Module metadata panel */}
        <div className="bg-slate-800 border border-white/[0.08] rounded-xl px-5 py-4 mb-6 flex flex-wrap gap-6">
          <div>
            <p className="text-slate-500 text-xs mb-1">Status</p>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg capitalize ${STATUS_COLORS[module?.status] || ''}`}>
              {module?.status || '—'}
            </span>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">Created</p>
            <p className="text-slate-200 text-sm font-medium">{fmt(module?.created_at)}</p>
          </div>
          <div>
            <p className="text-slate-500 text-xs mb-1">
              {module?.status === 'published' ? 'Published' : 'Last Updated'}
            </p>
            <p className="text-slate-200 text-sm font-medium">{fmt(module?.updated_at)}</p>
          </div>
          {module?.duration_mins && (
            <div>
              <p className="text-slate-500 text-xs mb-1">Duration</p>
              <p className="text-slate-200 text-sm font-medium">{module.duration_mins} min</p>
            </div>
          )}
        </div>

        <CreateModuleForm existingModule={{
          ...module,
          content: module?.module_content || [],
        }} />
      </PageWrapper>
    </>
  )
}