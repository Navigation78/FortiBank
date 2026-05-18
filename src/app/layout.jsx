import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FortiBank | Cybersecurity Training',
  description: 'Role-based cybersecurity awareness training for FortiBank employees.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, background: '#0f172a' }}>
      <body className={inter.className} style={{ margin: 0, padding: 0, background: '#0f172a' }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
