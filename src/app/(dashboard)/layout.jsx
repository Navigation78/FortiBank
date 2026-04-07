
// Shell layout wrapping all employee-facing pages.
// Includes sidebar, topbar and footer.


import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        {children}
        <Footer />
      </div>
    </div>
  )
}