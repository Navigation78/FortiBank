// src/app/page.jsx
// FortiBank LMS — Public Landing Page
// Dark, professional, cybersecurity-themed
// Sections: Hero → Features → How it Works → CTA → Footer

import Link from 'next/link'

const FEATURES = [
  {
    color: '#60a5fa', bg: 'rgba(37,99,235,0.12)',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    title: 'Role-based training paths',
    desc: 'Each of the 12 staff roles sees only modules relevant to their function and risk exposure — from teller to branch manager.',
  },
  {
    color: '#4ade80', bg: 'rgba(34,197,94,0.1)',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    title: 'Live risk scoring',
    desc: 'Composite risk scores from quiz performance and phishing simulation results, updated in real time per employee.',
  },
  {
    color: '#c084fc', bg: 'rgba(139,92,246,0.1)',
    icon: 'M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25',
    title: 'Phishing simulation engine',
    desc: 'Launch simulated campaigns across your workforce. Track click rates and trigger automatic retraining for vulnerable employees.',
  },
  {
    color: '#fb923c', bg: 'rgba(249,115,22,0.1)',
    icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
    title: 'Verifiable certificates',
    desc: 'Employees earn downloadable PDF certificates upon passing each quiz — fully auditable for CBK compliance reviews.',
  },
  {
    color: '#facc15', bg: 'rgba(234,179,8,0.1)',
    icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
    title: 'Admin analytics dashboard',
    desc: 'Branch-level completion rates, department risk heatmaps, phishing trends, and exportable compliance reports.',
  },
  {
    color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)',
    icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
    title: 'Secure by design',
    desc: 'Row-level security, MFA-ready architecture, session management, and full audit logging across every action.',
  },
]

const STEPS = [
  { n: '1', t: 'Admin creates users', d: 'IT admin invites employees by email and assigns their role. No self-signup — full access control.' },
  { n: '2', t: 'Modules auto-assign', d: 'The platform assigns the correct training curriculum based on each employee\'s role automatically.' },
  { n: '3', t: 'Employees train', d: 'Staff complete interactive modules, watch embedded videos, and pass graded quizzes at their own pace.' },
  { n: '4', t: 'Compliance confirmed', d: 'Risk scores update, certificates are issued, and compliance reports are ready for CBK audit.' },
]

export default function LandingPage() {
  return (
    <div style={{ background: '#020617', minHeight: '100vh', width: '100%', color: '#f1f5f9', fontFamily: 'system-ui,sans-serif' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 48px', borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, background: 'rgba(2,6,23,0.96)', zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>Features</a>
          <a href="#how-it-works" style={{ color: '#64748b', fontSize: 14, textDecoration: 'none' }}>How it works</a>
          <Link href="/login" style={{
            background: '#2563eb', color: 'white', padding: '8px 20px',
            borderRadius: 8, fontSize: 14, fontWeight: 500, textDecoration: 'none',
          }}>Sign in</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '104px 48px 80px', maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(37,99,235,0.1)', border: '0.5px solid rgba(37,99,235,0.28)',
          color: '#60a5fa', fontSize: 12, padding: '5px 16px', borderRadius: 20, marginBottom: 32,
        }}>
          <div style={{ width: 6, height: 6, background: '#3b82f6', borderRadius: '50%' }} />
          Built for Kenyan banking institutions · CBK compliant
        </div>

        <h1 style={{ fontSize: 54, fontWeight: 500, lineHeight: 1.12, color: '#f8fafc', marginBottom: 24, letterSpacing: '-0.02em' }}>
          Cyber resilience starts<br />with{' '}
          <span style={{ color: '#3b82f6' }}>every employee</span>
        </h1>

        <p style={{ fontSize: 18, color: '#475569', maxWidth: 560, margin: '0 auto 44px', lineHeight: 1.75 }}>
          Role-based cybersecurity training, live phishing simulations, and real-time
          risk scoring — purpose-built for the financial sector.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/login" style={{
            background: '#2563eb', color: 'white', padding: '13px 28px',
            borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Access the platform
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <a href="#features" style={{
            background: 'transparent', color: '#94a3b8', padding: '13px 28px',
            borderRadius: 8, fontSize: 15, border: '0.5px solid rgba(255,255,255,0.1)',
            textDecoration: 'none',
          }}>
            See how it works
          </a>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: 56,
          marginTop: 72, paddingTop: 48,
          borderTop: '0.5px solid rgba(255,255,255,0.06)',
        }}>
          {[
            { n: '8',    l: 'Training modules' },
            { n: '12',   l: 'Staff roles covered' },
            { n: 'CBK',  l: 'Regulation aligned' },
            { n: '100%', l: 'Role-based access' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 500, color: '#f1f5f9' }}>{s.n}</div>
              <div style={{ fontSize: 13, color: '#334155', marginTop: 6 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{
        padding: '80px 48px',
        borderTop: '0.5px solid rgba(255,255,255,0.05)',
        borderBottom: '0.5px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>
            Platform features
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 500, color: '#f1f5f9', marginBottom: 16, letterSpacing: '-0.01em' }}>
            Everything your bank needs to stay secure
          </h2>
          <p style={{ fontSize: 16, color: '#475569', maxWidth: 520, lineHeight: 1.7, marginBottom: 52 }}>
            A complete cybersecurity training ecosystem designed around how banks actually operate.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
            gap: 2, background: 'rgba(255,255,255,0.04)',
            borderRadius: 16, overflow: 'hidden',
            border: '0.5px solid rgba(255,255,255,0.06)',
          }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#0d1526', padding: '30px 28px' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18,
                }}>
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={f.color} strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#f1f5f9', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '80px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12, fontWeight: 500 }}>
            How it works
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 500, color: '#f1f5f9', marginBottom: 16, letterSpacing: '-0.01em' }}>
            From onboarding to certification
          </h2>
          <p style={{ fontSize: 16, color: '#475569', maxWidth: 480, lineHeight: 1.7, marginBottom: 64 }}>
            A simple, structured flow for both admins and employees.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', position: 'relative' }}>
            {/* connector line behind circles */}
            <div style={{
              position: 'absolute', top: 27, left: '12.5%', right: '12.5%',
              height: '0.5px', background: 'rgba(37,99,235,0.22)',
            }} />
            {STEPS.map((step, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 20px', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%',
                  border: '0.5px solid rgba(37,99,235,0.4)',
                  background: '#020617',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: 18, fontWeight: 500, color: '#3b82f6',
                }}>
                  {step.n}
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, color: '#f1f5f9', marginBottom: 10 }}>{step.t}</div>
                <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.65 }}>{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        borderTop: '0.5px solid rgba(255,255,255,0.05)',
        padding: '100px 48px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(37,99,235,0.1)', border: '0.5px solid rgba(37,99,235,0.28)',
            color: '#60a5fa', fontSize: 12, padding: '5px 16px', borderRadius: 20, marginBottom: 28,
          }}>
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            CBK & Kenya Data Protection Act compliant
          </div>

          <h2 style={{ fontSize: 40, fontWeight: 500, color: '#f1f5f9', marginBottom: 20, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            Ready to protect your bank from the inside out?
          </h2>
          <p style={{ fontSize: 16, color: '#475569', marginBottom: 40, lineHeight: 1.75 }}>
            FortiBank LMS gives your security team full visibility over staff cyber awareness
            — and gives employees the tools to stay one step ahead of threats.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{
              background: '#2563eb', color: 'white', padding: '14px 32px',
              borderRadius: 8, fontSize: 15, fontWeight: 500, textDecoration: 'none',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              Sign in to the platform
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <a href="#features" style={{
              background: 'transparent', color: '#94a3b8', padding: '14px 32px',
              borderRadius: 8, fontSize: 15, border: '0.5px solid rgba(255,255,255,0.1)',
              textDecoration: 'none',
            }}>
              View all features
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: '0.5px solid rgba(255,255,255,0.05)',
        padding: '28px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 13, color: '#1e293b' }}>© 2026 FortiBank Security Training. All rights reserved.</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="#" style={{ fontSize: 13, color: '#1e293b', textDecoration: 'none' }}>Privacy policy</a>
          <a href="#" style={{ fontSize: 13, color: '#1e293b', textDecoration: 'none' }}>Terms of use</a>
          <Link href="/login" style={{ fontSize: 13, color: '#3b82f6', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </footer>

    </div>
  )
}
