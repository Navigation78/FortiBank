'use client'
//src/app/admin/users/create/page.jsx
import Topbar from '@/components/layout/Topbar'
import PageWrapper from '@/components/layout/PageWrapper'
import CreateUserForm from '@/components/admin/CreateUserForm'
import Link from 'next/link'

export default function CreateUserPage() {
  return (
    <>
      <Topbar title="Add Employee" />
      <PageWrapper>
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link href="/admin/users" className="hover:text-slate-300">Users</Link>
          <span>/</span>
          <span className="text-slate-300">Add Employee</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-2xl">
          <h2 className="text-white font-semibold mb-1">Create Employee Account</h2>
          <p className="text-slate-400 text-sm mb-6">
            Creates a Supabase auth account and assigns the employee their training role.
            They will receive a welcome email with login instructions.
          </p>
          <CreateUserForm />
        </div>
      </PageWrapper>
    </>
  )
}