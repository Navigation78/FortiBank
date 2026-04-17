'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Topbar from '@/components/layout/Topbar'
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
        <Topbar title="Edit Module" />
        <PageWrapper>
          <div className="animate-pulse h-64 bg-slate-900 border border-slate-800 rounded-xl" />
        </PageWrapper>
      </>
    )
  }

  return (
    <>
      <Topbar title={module?.title || 'Edit Module'} />
      <PageWrapper>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/admin/modules" className="hover:text-slate-300">Modules</Link>
          <span>/</span>
          <span className="text-slate-300 truncate">{module?.title}</span>
        </div>
        <CreateModuleForm existingModule={{
          ...module,
          content: module?.module_content || [],
        }} />
      </PageWrapper>
    </>
  )
}