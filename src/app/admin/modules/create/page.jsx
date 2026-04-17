'use client'

import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import CreateModuleForm from '@/components/admin/CreateModuleForm'
import Link from 'next/link'

export default function CreateModulePage() {
  return (
    <>
      <Topbar title="Create Module" />
      <PageWrapper>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/admin/modules" className="hover:text-slate-300">Modules</Link>
          <span>/</span>
          <span className="text-slate-300">Create Module</span>
        </div>
        <CreateModuleForm />
      </PageWrapper>
    </>
  )
}