'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    body: `By accessing or using the FortiBank Security Training platform ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, you must not access or use the Platform.

Access to the Platform is restricted to authorised FortiBank employees and administrators. Use of the Platform constitutes your acceptance of these terms and any updates made to them.`,
  },
  {
    title: '2. Authorised Use',
    body: `The Platform is provided solely for the purpose of delivering role-based cybersecurity awareness training to FortiBank employees. Authorised uses include:

• Completing assigned training modules relevant to your role.
• Taking module quizzes and downloading your earned certificates.
• Reviewing your personal risk score and training progress.
• Administrators managing users, modules, and phishing simulation campaigns.

Any use of the Platform outside of these purposes is strictly prohibited.`,
  },
  {
    title: '3. Account Responsibilities',
    body: `Your account credentials are personal and must not be shared with any other person. You are responsible for:

• Maintaining the confidentiality of your login credentials.
• All activity that occurs under your account.
• Notifying your system administrator immediately if you suspect unauthorised access to your account.
• Logging out of the Platform when your session is complete, particularly on shared devices.

Accounts are created and managed exclusively by FortiBank IT administrators. Self-registration is not permitted.`,
  },
  {
    title: '4. Training Obligations',
    body: `As a FortiBank employee, you may be required to complete specific training modules within defined timeframes as directed by your line manager or the compliance team. Failure to complete mandatory training may:

• Affect your risk score and overall compliance standing.
• Be reported to your department head and the HR function.
• Result in additional mandatory training or other HR action in accordance with FortiBank's internal policies.

Phishing simulation exercises may be conducted periodically without prior notice. Participation in these exercises is a condition of employment.`,
  },
  {
    title: '5. Prohibited Conduct',
    body: `You must not use the Platform to:

• Attempt to access accounts, data, or systems you are not authorised to access.
• Reverse-engineer, decompile, or otherwise attempt to extract the Platform's source code.
• Interfere with or disrupt the Platform's infrastructure, including servers or networks.
• Upload or transmit malicious code, viruses, or any harmful material.
• Share, reproduce, or distribute training content outside the Platform without written authorisation.
• Misrepresent your identity, role, or completion of training activities.

Violation of these prohibitions may result in immediate account suspension and disciplinary action.`,
  },
  {
    title: '6. Intellectual Property',
    body: `All content available on the Platform, including training modules, videos, quiz questions, certificates, and the Platform's software, is the intellectual property of FortiBank or its licensed content providers. You are granted a limited, non-exclusive, non-transferable licence to access and use this content solely for your personal training purposes within the scope of your employment.

You may not reproduce, distribute, modify, or create derivative works from any Platform content without prior written consent from FortiBank.`,
  },
  {
    title: '7. Monitoring and Audit',
    body: `All activity on the Platform is logged and may be monitored for compliance, security, and audit purposes. This includes but is not limited to:

• Login and session activity.
• Module and quiz completion events.
• Phishing simulation interactions.
• Administrative actions taken within the Platform.

Audit logs are retained in accordance with CBK regulatory requirements and FortiBank's record retention policy. By using the Platform, you consent to this monitoring.`,
  },
  {
    title: '8. Disclaimers and Limitation of Liability',
    body: `The Platform and its content are provided on an "as is" basis. FortiBank makes no warranty that the Platform will be uninterrupted, error-free, or free from security vulnerabilities, though we take all reasonable steps to ensure reliability and security.

To the maximum extent permitted by applicable law, FortiBank shall not be liable for any indirect, incidental, or consequential damages arising from your use of or inability to use the Platform.`,
  },
  {
    title: '9. Changes to These Terms',
    body: `FortiBank reserves the right to update these Terms of Use at any time. Updated terms will be posted on this page with a revised effective date. Continued use of the Platform after changes are posted constitutes acceptance of the revised terms.`,
  },
  {
    title: '10. Governing Law',
    body: `These Terms of Use are governed by and construed in accordance with the laws of Kenya. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Kenya.`,
  },
  {
    title: '11. Contact',
    body: `For questions about these Terms of Use, please contact:

FortiBank Legal and Compliance
Email: legal@fortibank.co.ke
Address: FortiBank Head Office, Nairobi, Kenya`,
  },
]

export default function TermsOfUsePage() {
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
          <h1 className="text-4xl font-medium text-th-txt mb-4 tracking-tight">Terms of Use</h1>
          <p className="text-sm text-th-txt2 leading-relaxed">
            Last updated: May 2026 · These terms govern all use of the FortiBank Security Training platform by authorised employees and administrators.
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
          <Link href="/privacy-policy" className="text-sm text-th-txt2 hover:text-th-txt hover:underline underline-offset-2 transition-colors">Privacy policy</Link>
        </div>
      </main>

      <footer className="border-t border-th-brds px-6 sm:px-12 py-7 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-th-txt2">© 2026 FortiBank Security Training. All rights reserved.</div>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="text-sm text-th-txt2 hover:text-th-txt underline underline-offset-2 transition-colors">Privacy policy</Link>
          <Link href="/terms-of-use" className="text-sm text-blue-600 dark:text-blue-400 underline underline-offset-2">Terms of use</Link>
        </div>
      </footer>
    </div>
  )
}
