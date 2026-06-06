'use client'

import PageWrapper from '@/components/layout/PageWrapper'
import CreateCampaignForm from '@/components/admin/CreateCampaignForm'
import Link from 'next/link'

export default function CreateCampaignPage() {
  return (
    <>
      <PageWrapper>
        <div className="flex items-center gap-2 text-sm text-th-muted mb-6">
          <Link href="/admin/phishing" className="hover:text-th-txt2">Phishing</Link>
          <span>/</span>
          <span className="text-th-txt2">New Campaign</span>
        </div>
        <CreateCampaignForm />
      </PageWrapper>
    </>
  )
}
