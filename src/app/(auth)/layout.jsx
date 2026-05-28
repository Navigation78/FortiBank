import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Systems Security Training',
  description: 'FortiBank Cybersecurity Training Platform',
}

export default function AuthLayout({ children }) {
  return (
    <div className={`${inter.className} min-h-screen bg-th-bg flex items-center justify-center p-4`}>
      {/* Subtle gradient overlay (dark mode only) */}
      <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] dark:from-blue-950/60 dark:via-transparent dark:to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <img src="/FortiBank%20LogoO.png" alt="FortiBank Logo" className="w-full max-w-[200px] h-auto object-contain dark:hidden" />
          <img src="/FortiBank%20Logo%20darkmode%20clean.png" alt="FortiBank Logo" className="w-full max-w-[200px] h-auto object-contain hidden dark:block" />
        </div>

        {children}

        <p className="text-center text-th-muted text-xs mt-8">
          &copy; {new Date().getFullYear()} FortiBank. All rights reserved.
        </p>
      </div>
    </div>
  )
}
