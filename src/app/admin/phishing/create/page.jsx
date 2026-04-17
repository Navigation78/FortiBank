'use client'

import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import CreateCampaignForm from '@/components/admin/CreateCampaignForm'
import Link from 'next/link'

export default function CreateCampaignPage() {
  return (
    <>
      <Topbar title="New Phishing Campaign" />
      <PageWrapper>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/admin/phishing" className="hover:text-slate-300">Phishing</Link>
          <span>/</span>
          <span className="text-slate-300">New Campaign</span>
        </div>
        <CreateCampaignForm />
      </PageWrapper>
    </>
  )
}