
// src/components/layout/PageWrapper.jsx
// Wraps every dashboard page with consistent padding and max-width

import Breadcrumb from '@/components/layout/Breadcrumb'

export default function PageWrapper({ children, className = '' }) {
  return (
    <main className={`flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full ${className}`}>
      <Breadcrumb />
      {children}
    </main>
  )
}