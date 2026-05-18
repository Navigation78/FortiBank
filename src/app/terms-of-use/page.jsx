import Link from 'next/link'

export const metadata = {
  title: 'Terms of Use | FortiBank Security Training',
}

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
  return (
    <div style={{ background: '#020617', minHeight: '100vh', color: '#f1f5f9', fontFamily: 'system-ui,sans-serif' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px', borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, background: 'rgba(2,6,23,0.96)', zIndex: 100,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, background: '#2563eb', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 500, color: '#f1f5f9', lineHeight: 1 }}>FortiBank</div>
            <div style={{ fontSize: 10, color: '#3b82f6', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>Security Training</div>
          </div>
        </Link>
        <Link href="/login" style={{
          background: '#2563eb', color: 'white', padding: '8px 20px',
          borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none',
        }}>Sign in</Link>
      </nav>

      {/* CONTENT */}
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '72px 48px 96px' }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>
            Legal
          </div>
          <h1 style={{ fontSize: 40, fontWeight: 500, color: '#f8fafc', marginBottom: 16, letterSpacing: '-0.02em' }}>
            Terms of Use
          </h1>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
            Last updated: May 2026 · These terms govern all use of the FortiBank Security Training platform by authorised employees and administrators.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', paddingTop: 32 }}>
              <h4 style={{ fontSize: 17, fontWeight: 500, color: '#e2e8f0', marginBottom: 14 }}>{s.title}</h4>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', gap: 24 }}>
          <Link href="/" style={{ fontSize: 14, color: '#3b82f6', textDecoration: 'none' }}>← Back to home</Link>
          <Link href="/privacy-policy" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Privacy policy</Link>
        </div>
      </main>

      <footer style={{
        borderTop: '0.5px solid rgba(255,255,255,0.05)',
        padding: '28px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 13, color: '#475569' }}>© 2026 FortiBank Security Training. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/privacy-policy" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>Privacy policy</Link>
          <Link href="/terms-of-use" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none' }}>Terms of use</Link>
        </div>
      </footer>
    </div>
  )
}
