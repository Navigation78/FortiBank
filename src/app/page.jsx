'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const FEATURES = [
  {
    colorLight: '#2563eb', colorDark: '#60a5fa',
    bgLight: 'rgba(37,99,235,0.08)', bgDark: 'rgba(37,99,235,0.12)',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    title: 'Role-based training paths',
    desc: 'Each of the 12 staff roles sees only modules relevant to their function and risk exposure from teller to branch manager.',
  },
  {
    colorLight: '#16a34a', colorDark: '#4ade80',
    bgLight: 'rgba(22,163,74,0.08)', bgDark: 'rgba(34,197,94,0.1)',
    icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
    title: 'Live risk scoring',
    desc: 'Composite risk scores from quiz performance and phishing simulation results, updated in real time per employee.',
  },
  {
    colorLight: '#7c3aed', colorDark: '#c084fc',
    bgLight: 'rgba(124,58,237,0.08)', bgDark: 'rgba(139,92,246,0.1)',
    icon: 'M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25',
    title: 'Phishing simulation engine',
    desc: 'Launch simulated campaigns across your workforce. Track click rates and trigger automatic retraining for vulnerable employees.',
  },
  {
    colorLight: '#ea580c', colorDark: '#fb923c',
    bgLight: 'rgba(234,88,12,0.08)', bgDark: 'rgba(249,115,22,0.1)',
    icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
    title: 'Verifiable certificates',
    desc: 'Employees earn downloadable PDF certificates upon passing each quiz fully auditable for CBK compliance reviews.',
  },
  {
    colorLight: '#ca8a04', colorDark: '#facc15',
    bgLight: 'rgba(202,138,4,0.08)', bgDark: 'rgba(234,179,8,0.1)',
    icon: 'M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z',
    title: 'Admin analytics dashboard',
    desc: 'Branch-level completion rates, department risk heatmaps, phishing trends, and exportable compliance reports.',
  },
  {
    colorLight: '#0d9488', colorDark: '#2dd4bf',
    bgLight: 'rgba(13,148,136,0.08)', bgDark: 'rgba(20,184,166,0.1)',
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
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = theme === 'dark'

  return (
    <div className="min-h-screen w-full bg-th-bg text-th-txt" style={{ fontFamily: 'system-ui,sans-serif' }}>

      {/* NAV */}
      <nav className="flex items-center justify-between px-6 sm:px-12 py-4 border-b border-th-brd sticky top-0 bg-th-bar z-50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <div className="text-[15px] font-semibold text-th-txt leading-none">FortiBank</div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 tracking-widest uppercase mt-1">Security Training</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-th-txt2 hover:text-th-txt hover:bg-th-hov border border-th-brd transition-all duration-150"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150"
          >
            Sign in
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="px-6 sm:px-12 pt-24 pb-20 max-w-[860px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/25 text-blue-700 dark:text-blue-400 text-xs px-4 py-1.5 rounded-full mb-8">
          <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
          Built for Kenyan banking institutions · CBK compliant
        </div>

        <h1 className="text-[clamp(36px,5vw,54px)] font-semibold leading-[1.12] text-th-txt mb-6 tracking-tight">
          Cyber resilience starts<br />with{' '}
          <span className="text-blue-600 dark:text-blue-400">every employee</span>
        </h1>

        <p className="text-lg text-th-txt2 max-w-[540px] mx-auto mb-10 leading-relaxed">
          Role-based cybersecurity training, live phishing simulations, and real-time
          risk scoring purpose-built for the financial sector.
        </p>

        {/* Stats row */}
        <div className="flex justify-center gap-10 sm:gap-14 mt-16 pt-12 border-t border-th-brds flex-wrap">
          {[
            { n: '8',    l: 'Training modules' },
            { n: '12',   l: 'Staff roles covered' },
            { n: 'CBK',  l: 'Regulation aligned' },
            { n: '100%', l: 'Role-based access' },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl font-semibold text-th-txt">{s.n}</div>
              <div className="text-sm text-th-muted mt-1.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 sm:px-12 py-20 border-t border-th-brds">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-3 font-medium">
            Platform features
          </div>
          <h2 className="text-[clamp(28px,3vw,36px)] font-semibold text-th-txt mb-4 tracking-tight">
            Everything your bank needs to stay secure
          </h2>
          <p className="text-base text-th-txt2 max-w-[500px] leading-relaxed mb-12">
            A complete cybersecurity training ecosystem designed around how banks actually operate.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-th-brd rounded-2xl overflow-hidden border border-th-brd">
            {FEATURES.map((f, i) => {
              const color = isDark ? f.colorDark : f.colorLight
              const bg    = isDark ? f.bgDark    : f.bgLight
              return (
                <div
                  key={i}
                  className="bg-th-srf p-7 hover:bg-th-hov transition-colors duration-150"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: bg }}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                    </svg>
                  </div>
                  <div className="text-[15px] font-medium text-th-txt mb-2">{f.title}</div>
                  <div className="text-sm text-th-txt2 leading-relaxed">{f.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 sm:px-12 py-20 border-t border-th-brds">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-3 font-medium">
            How it works
          </div>
          <h2 className="text-[clamp(28px,3vw,36px)] font-semibold text-th-txt mb-4 tracking-tight">
            From onboarding to certification
          </h2>
          <p className="text-base text-th-txt2 max-w-[460px] leading-relaxed mb-16">
            A simple, structured flow for both admins and employees.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connector line */}
            <div className="absolute hidden lg:block top-[27px] left-[12.5%] right-[12.5%] h-px bg-blue-200 dark:bg-blue-500/20" />
            {STEPS.map((step, i) => (
              <div key={i} className="text-center relative z-10">
                <div className="w-14 h-14 rounded-full border border-blue-200 dark:border-blue-500/40 bg-th-bg flex items-center justify-center mx-auto mb-6 text-lg font-semibold text-blue-600 dark:text-blue-400">
                  {step.n}
                </div>
                <div className="text-[15px] font-medium text-th-txt mb-2">{step.t}</div>
                <div className="text-sm text-th-txt2 leading-relaxed">{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-th-brds px-6 sm:px-12 py-24 text-center">
        <div className="max-w-[600px] mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/25 text-blue-700 dark:text-blue-400 text-xs px-4 py-1.5 rounded-full mb-7">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            CBK &amp; Kenya Data Protection Act compliant
          </div>

          <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-th-txt mb-5 leading-tight tracking-tight">
            Ready to protect your bank from the inside out?
          </h2>
          <p className="text-base text-th-txt2 mb-10 leading-relaxed">
            FortiBank LMS gives your security team full visibility over staff cyber awareness
            and gives employees the tools to stay one step ahead of threats.
          </p>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-lg text-[15px] font-medium transition-all duration-150"
          >
            Sign in
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-th-brds px-6 sm:px-12 py-7 flex items-center justify-between flex-wrap gap-4">
        <div className="text-sm text-th-muted">
          &copy; 2026 FortiBank Security Training. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link href="/privacy-policy" className="text-sm text-th-muted hover:text-th-txt2 transition-colors">Privacy policy</Link>
          <Link href="/terms-of-use" className="text-sm text-th-muted hover:text-th-txt2 transition-colors">Terms of use</Link>
        </div>
      </footer>

    </div>
  )
}
