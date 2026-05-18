import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy | FortiBank Security Training',
}

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
            Privacy Policy
          </h1>
          <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>
            Last updated: May 2026 · This policy applies to all authorised users of the FortiBank Security Training platform.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', paddingTop: 32 }}>
              <h2 style={{ fontSize: 17, fontWeight: 500, color: '#e2e8f0', marginBottom: 14 }}>{s.title}</h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.85, whiteSpace: 'pre-line' }}>{s.body}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', gap: 24 }}>
          <Link href="/" style={{ fontSize: 14, color: '#3b82f6', textDecoration: 'none' }}>← Back to home</Link>
          <Link href="/terms-of-use" style={{ fontSize: 14, color: '#475569', textDecoration: 'none' }}>Terms of use</Link>
        </div>
      </main>

      <footer style={{
        borderTop: '0.5px solid rgba(255,255,255,0.05)',
        padding: '28px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 13, color: '#475569' }}>© 2026 FortiBank Security Training. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link href="/privacy-policy" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none' }}>Privacy policy</Link>
          <Link href="/terms-of-use" style={{ fontSize: 13, color: '#475569', textDecoration: 'none' }}>Terms of use</Link>
        </div>
      </footer>
    </div>
  )
}
