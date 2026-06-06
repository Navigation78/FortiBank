'use client'
//src/app/admin/users/create/page.jsx
import PageWrapper from '@/components/layout/PageWrapper'
import CreateUserForm from '@/components/admin/CreateUserForm'
import Link from 'next/link'

export default function CreateUserPage() {
  return (
    <>
      <PageWrapper>
        <div className="flex items-center gap-2 text-sm text-th-muted mb-6">
          <Link href="/admin/users" className="hover:text-th-txt2">Users</Link>
          <span>/</span>
          <span className="text-th-txt2">Add Employee</span>
        </div>
        <div className="bg-th-srf border border-th-brd rounded-xl p-6 max-w-2xl">
          <h4 className="text-th-txt font-semibold mb-1">Create Employee Account</h4>
          <p className="text-th-muted text-sm mb-6">
            Creates a Supabase auth account and assigns the employee their training role.
            They will receive a welcome email with login instructions.
          </p>
          <CreateUserForm />
        </div>
      </PageWrapper>
    </>
  )
}
