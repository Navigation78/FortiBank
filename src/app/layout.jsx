import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FortiBank | Systems Security Training',
  description: 'Role-based cybersecurity awareness training for FortiBank employees.',
  icons: [
    { rel: 'icon', url: '/FortiBank%20Favicon1%20transparent.png', media: '(prefers-color-scheme: light)' },
    { rel: 'icon', url: '/FortiBank%20Favicon1.PNG',               media: '(prefers-color-scheme: dark)'  },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
