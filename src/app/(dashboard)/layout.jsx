
// Shell layout wrapping all employee-facing pages.
// Includes sidebar, topbar and footer.


import Sidebar from '@/components/layout/Sidebar'
import Footer from '@/components/layout/Footer'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-y-auto">
        {children}
        <Footer />
      </div>
    </div>
  )
}
