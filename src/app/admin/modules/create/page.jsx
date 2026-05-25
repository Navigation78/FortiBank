'use client'

import PageWrapper from '@/components/layout/PageWrapper'
import CreateModuleForm from '@/components/admin/CreateModuleForm'
import Link from 'next/link'

export default function CreateModulePage() {
  return (
    <>
      <PageWrapper>
        <div className="flex items-center gap-2 text-sm text-th-muted mb-6">
          <Link href="/admin/modules" className="hover:text-th-txt2">Modules</Link>
          <span>/</span>
          <span className="text-th-txt2">Create Module</span>
        </div>
        <CreateModuleForm />
      </PageWrapper>
    </>
  )
}
