'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const SECTIONS = [
  {
    title: '1. Information We Collect',
    body: `We collect the following personal data from authorised FortiBank employees who access this platform:

• Identity information: full name, employee ID, email address, and job role.
• Training data: module completion status, quiz scores, time spent per module, and certificate records.
• Phishing simulation data: whether a simulated phishing link was clicked and any resulting retraining records.
• Risk score data: composite cyber-risk scores calculated from training performance and simulation results.
• Technical data: IP address, browser type, session timestamps, and audit log entries.`,
  },
  {
    title: '2. How We Use Your Information',
    body: `Your personal data is used exclusively for the following purposes:

• To provide role-appropriate cybersecurity training modules and assessments.
• To calculate and display your real-time risk score to you and your line management.
• To issue verifiable PDF certificates upon successful completion of training modules.
• To enable administrators to monitor branch-level compliance and generate CBK audit reports.
• To identify employees who may benefit from additional cybersecurity awareness support following phishing simulations.
• To maintain a full audit trail of platform activity as required by the Central Bank of Kenya (CBK) Prudential Guidelines.`,
  },
  {
    title: '3. Legal Basis for Processing',
    body: `We process your personal data under the following legal bases as defined by the Kenya Data Protection Act, 2019:

• Contractual necessity: processing is required to fulfil your obligations as a FortiBank employee.
• Legitimate interests: maintaining a secure banking environment and meeting regulatory compliance requirements.
• Legal obligation: CBK regulations require banks to demonstrate staff cybersecurity awareness training.`,
  },
  {
    title: '4. Data Sharing and Disclosure',
    body: `Your data is not sold or shared with third parties for commercial purposes. It may be shared only with:

• FortiBank management and compliance teams for regulatory reporting purposes.
• The Central Bank of Kenya (CBK) if required during a regulatory examination or audit.
• Our technology service providers (including Supabase for data storage and Resend for email delivery) who are contractually bound to handle data securely and only as instructed.

All service providers are vetted to ensure compliance with applicable data protection laws.`,
  },
  {
    title: '5. Data Retention',
    body: `Training records, certificates, and compliance data are retained for a minimum of 7 years in accordance with CBK record-keeping requirements. Risk score histories are retained for 3 years. Technical session logs are retained for 12 months.

Upon termination of employment, your account will be deactivated. Records required for compliance purposes will be retained for the periods specified above and then securely deleted.`,
  },
  {
    title: '6. Your Rights',
    body: `Under the Kenya Data Protection Act, 2019, you have the right to:

• Access a copy of the personal data we hold about you.
• Request correction of inaccurate or incomplete data.
• Request deletion of your data where it is no longer needed (subject to regulatory retention obligations).
• Object to processing in certain circumstances.
• Lodge a complaint with the Office of the Data Protection Commissioner (ODPC) of Kenya.

To exercise any of these rights, contact your system administrator or the FortiBank Data Protection Officer.`,
  },
  {
    title: '7. Security',
    body: `We implement appropriate technical and organisational measures to protect your personal data, including:

• Row-level security enforced at the database layer ensuring employees can only access their own records.
• Encrypted data transmission over HTTPS/TLS for all platform communications.
• Session management with automatic timeout and audit logging of all access events.
• Access controls restricting administrative functions to authorised IT staff only.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. The current version will always be available on this page. Significant changes will be communicated to users via the platform or email.`,
  },
  {
    title: '9. Contact',
    body: `For questions about this Privacy Policy or how your data is handled, please contact:

FortiBank Data Protection Officer
Email: dpo@fortibank.co.ke
Address: FortiBank Head Office, Nairobi, Kenya`,
  },
]

export default function PrivacyPolicyPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen bg-th-bg text-th-txt" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-[18px] border-b border-th-brd sticky top-0 bg-th-bar/95 backdrop-blur-sm z-50">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <div className="text-[17px] font-medium text-th-txt leading-none">FortiBank</div>
            <div className="text-[10px] text-blue-500 tracking-[0.12em] uppercase mt-0.5">Security Training</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-th-txt2 hover:text-th-txt hover:bg-th-hov border border-th-brd transition-all"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          )}
          <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all">
            Sign in
          </Link>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-[760px] mx-auto px-6 sm:px-12 pt-[72px] pb-24">
        <div className="mb-12">
          <div className="text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-3 font-medium">Legal</div>
          <h1 className="text-4xl font-medium text-th-txt mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-th-txt2 leading-relaxed">
            Last updated: May 2026 · This policy applies to all authorised users of the FortiBank Security Training platform.
          </p>
        </div>

        <div className="flex flex-col gap-10">
          {SECTIONS.map((s, i) => (
            <div key={i} className="border-t border-th-brds pt-8">
              <h4 className="text-[17px] font-medium text-th-txt mb-3.5">{s.title}</h4>
              <p className="text-sm text-th-txt2 leading-[1.85] whitespace-pre-line">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-th-brds flex gap-6">
          <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline underline-offset-2">← Back to home</Link>
          <Link href="/terms-of-use" className="text-sm text-th-txt2 hover:text-th-txt hover:underline underline-offset-2 transition-colors">Terms of use</Link>
        </div>
      </main>

      <footer className="border-t border-th-brds px-6 sm:px-12 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-th-txt2">© 2026 FortiBank Security Training. All rights reserved.</div>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="text-sm text-blue-600 dark:text-blue-400 underline underline-offset-2">Privacy policy</Link>
          <Link href="/terms-of-use" className="text-sm text-th-txt2 hover:text-th-txt underline underline-offset-2 transition-colors">Terms of use</Link>
        </div>
      </footer>
    </div>
  )
}
