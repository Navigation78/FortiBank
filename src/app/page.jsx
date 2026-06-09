'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Home',     href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'Modules',  href: '#modules' },
  { label: 'About',    href: '#about' },
  { label: 'Contact',  href: '#contact' },
]

const MODULES = [
  {
    badge: 'CRITICAL', badgeColor: '#dc2626',
    tag: 'Phishing Awareness',
    title: 'Identifying Phishing Attacks',
    desc: 'Spot deceptive emails, SMS and social engineering attempts targeting banking staff.',
    icon: 'M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25',
    color: '#dc2626', bg: 'rgba(220,38,38,0.08)', label: 'Core module',
  },
  {
    badge: 'POPULAR', badgeColor: '#7c3aed',
    tag: 'Access Control',
    title: 'Password & Authentication',
    desc: 'MFA setup, strong credential practices and secure login behaviours in banking systems.',
    icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
    color: '#7c3aed', bg: 'rgba(124,58,237,0.08)', label: 'All roles',
  },
  {
    badge: 'NEW', badgeColor: '#0891b2',
    tag: 'Data Protection',
    title: 'Customer Data Handling',
    desc: 'Kenya Data Protection Act compliance and safe handling of sensitive financial data.',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    color: '#0891b2', bg: 'rgba(8,145,178,0.08)', label: 'All roles',
  },
  {
    badge: 'CRITICAL', badgeColor: '#dc2626',
    tag: 'Incident Response',
    title: 'Reporting Security Incidents',
    desc: 'Escalate suspicious activity, contain breaches and document incidents for CBK.',
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
    color: '#dc2626', bg: 'rgba(220,38,38,0.08)', label: 'Management',
  },
  {
    badge: 'ROLE-BASED', badgeColor: '#16a34a',
    tag: 'Teller Training',
    title: 'Branch-Level Security',
    desc: 'Daily security routines, card fraud detection and suspicious transaction red flags.',
    icon: 'M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z',
    color: '#16a34a', bg: 'rgba(22,163,74,0.08)', label: 'Teller path',
  },
  {
    badge: 'NEW', badgeColor: '#0891b2',
    tag: 'Regulatory Compliance',
    title: 'CBK Cyber Regulations',
    desc: 'Understanding the Central Bank of Kenya\'s cybersecurity framework and your obligations.',
    icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5',
    color: '#0891b2', bg: 'rgba(8,145,178,0.08)', label: 'Compliance',
  },
]

const STEPS = [
  {
    n: '01',
    icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
    title: 'Role Assignment',
    desc: 'Admin invites employees by email and assigns their banking role. No self-signup, so you have full access control from day one.',
  },
  {
    n: '02',
    icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
    title: 'Auto-Assigned Curriculum',
    desc: 'Modules are matched to each role automatically. Tellers, managers and officers each see only what matters to them.',
  },
  {
    n: '03',
    icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5',
    title: 'Train & Certify',
    desc: 'Staff complete interactive modules and pass graded quizzes. Certificates are issued and phishing resilience is tested live.',
  },
]

const TESTIMONIALS = [
  {
    quote: 'FortiBank LMS transformed how we handle security awareness. Our phishing click rates dropped 60% within three months.',
    name: 'Amara Osei', role: 'Head of IT Security, KCB',
    img: 'https://images.unsplash.com/photo-1611432579402-7037e3e2c1e4?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'The role-based modules are exactly what we needed. Tellers and managers now get training relevant to their daily risk exposure.',
    name: 'Kwame Muthoni', role: 'Compliance Manager, Equity Bank',
    img: 'https://images.unsplash.com/photo-1679117349740-c46c819d0373?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'Audit season used to be stressful. Now we export a compliance report in seconds. Every certificate is CBK-ready.',
    name: 'Fatuma Njoroge', role: 'Branch Manager, Standard Chartered',
    img: 'https://images.unsplash.com/photo-1612115958726-9af4b6bd28d1?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'The phishing simulation engine revealed vulnerabilities we never knew existed. Training gaps were fixed in days.',
    name: 'David Kimani', role: 'CISO, Co-operative Bank',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
  },
  {
    quote: 'Certificate generation for CBK audits used to take days. FortiBank does it instantly. Verified and downloadable.',
    name: 'Grace Wanjiku', role: 'IT Manager, NCBA Bank',
    img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
  },
]

const TABS = [
  { id: 'all',      label: 'All Modules' },
  { id: 'critical', label: 'Critical' },
  { id: 'role',     label: 'Role-Based' },
]

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted]   = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  useEffect(() => setMounted(true), [])

  const isDark = theme === 'dark'

  const visibleModules =
    activeTab === 'critical' ? MODULES.filter(m => m.badge === 'CRITICAL') :
    activeTab === 'role'     ? MODULES.filter(m => m.badge === 'ROLE-BASED' || m.badge === 'POPULAR') :
    MODULES

  return (
    <div className="min-h-screen w-full bg-th-bg text-th-txt overflow-x-hidden" style={{ fontFamily: 'system-ui, sans-serif' }}>

      {/* ── NAV ─────────────────────────────────────────────────────── */}
      <nav className="flex items-center justify-between px-6 sm:px-16 py-4 border-b border-th-brd fixed top-0 left-0 w-full bg-th-bar/95 z-50 backdrop-blur-sm">
        <img src="/FortiBank%20LogoO.png" alt="FortiBank" className="max-w-[140px] max-h-9 w-auto object-contain dark:hidden" />
        <img src="/FortiBank%20Logo%20darkmode%20clean.png" alt="FortiBank" className="max-w-[140px] max-h-9 w-auto object-contain hidden dark:block" />

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} className="text-sm text-th-txt2 hover:text-th-txt hover:underline underline-offset-4 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="flex items-center justify-center w-9 h-9 rounded-lg text-th-txt2 hover:text-th-txt hover:bg-th-hov border border-th-brd transition-all"
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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

      {/* spacer so fixed nav doesn't cover content */}
      <div className="h-[73px]" />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-16 py-16 md:py-24 max-w-[1200px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left — copy */}
          <div className="flex-1 text-left">
            <h1 className="text-[clamp(36px,4.5vw,60px)] font-bold leading-[1.1] text-th-txt mb-6 tracking-tight">
              Fortify Every<br />
              Employee.{' '}
              <span className="text-blue-600 dark:text-blue-400">Defend</span><br />
              Every Branch.
            </h1>

            <p className="text-base text-th-txt2 max-w-[420px] mb-8 leading-relaxed">
              Role-based cybersecurity training, live phishing simulations, and real-time
              risk scoring, all purpose-built for the financial sector.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-600/20"
              >
                Get started
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right — hero image */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[540px]">
              {/* square card frame */}
              <div
                className="relative overflow-hidden w-full shadow-2xl"
                style={{ borderRadius: '24px', aspectRatio: '1/1' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80"
                  alt="Banking security professional"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-blue-900/10 to-transparent" />
              </div>
              {/* floating stat — left */}
              <div className="absolute -left-6 top-12 bg-white dark:bg-th-elv border border-th-brd rounded-2xl px-4 py-3 shadow-xl text-center min-w-[100px]">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
                <div className="text-[11px] text-th-txt2 leading-tight mt-0.5">Staff roles<br />covered</div>
              </div>
              {/* floating stat — right */}
              <div className="absolute -right-4 bottom-16 bg-blue-600 rounded-2xl px-4 py-3 shadow-xl text-center min-w-[90px]">
                <div className="text-2xl font-bold text-white">CBK</div>
                <div className="text-[11px] text-blue-100 leading-tight mt-0.5">Regulation<br />aligned</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS STRIP ───────────────────────────────────────────── */}
      <section id="features" className="border-y border-th-brd bg-th-srf px-6 sm:px-16 py-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-th-brds">
          {[
            {
              icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
              title: 'Role-Based Training',
              desc: 'Modules tailored to each of the 12 banking roles',
            },
            {
              icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
              title: 'CBK Compliant',
              desc: 'Certificates and reports ready for regulatory audits',
            },
            {
              icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
              title: 'Live Risk Scoring',
              desc: 'Real-time composite scores updated per employee',
            },
          ].map((b, i) => (
            <div key={i} className="flex items-center gap-4 py-4 sm:py-0 sm:px-8 first:pl-0 last:pr-0">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={b.icon} />
                </svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-th-txt">{b.title}</div>
                <div className="text-xs text-th-txt2 mt-0.5">{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORY CARDS ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-16 py-16 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card 1 — Phishing Simulation */}
          <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex flex-col justify-between p-8 text-white" style={{ background: '#0f2044' }}>
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=700&q=80"
                alt="Phishing simulation"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-bold text-red-400 tracking-widest uppercase mb-3">Live Simulation</div>
              <h3 className="text-3xl font-bold leading-tight mb-3">
                Phishing<br />Simulation<br />Engine
              </h3>
              <p className="text-sm text-blue-200 max-w-[260px] leading-relaxed">
                Launch real phishing campaigns across your workforce and track vulnerability in real time.
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-[#0f2044] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Explore
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <div className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">-60% click rate</div>
            </div>
          </div>

          {/* Card 2 — Training Modules */}
          <div className="relative rounded-3xl overflow-hidden min-h-[300px] flex flex-col justify-between p-8 text-white" style={{ background: '#1e3a5f' }}>
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80"
                alt="Training modules"
                className="w-full h-full object-cover opacity-20"
              />
            </div>
            <div className="relative z-10">
              <div className="text-xs font-bold text-blue-300 tracking-widest uppercase mb-3">Role-Based</div>
              <h3 className="text-3xl font-bold leading-tight mb-3">
                Training<br />Modules<br />& Quizzes
              </h3>
              <p className="text-sm text-blue-200 max-w-[260px] leading-relaxed">
                Interactive modules with graded quizzes, embedded videos and CBK-verified certificates.
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between mt-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-white text-[#1e3a5f] px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-50 transition-colors"
              >
                Explore
                <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <div className="bg-blue-400 text-white text-xs font-bold px-3 py-1.5 rounded-full">8 modules</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODULES SECTION ──────────────────────────────────────────── */}
      <section id="modules" className="px-6 sm:px-16 py-16 bg-th-srf">
        <div className="max-w-[1200px] mx-auto">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-2 font-medium">Training library</div>
              <h2 className="text-[clamp(26px,3vw,34px)] font-bold text-th-txt tracking-tight">Our Modules</h2>
            </div>
            <div className="flex gap-1 bg-th-srf border border-th-brd rounded-xl p-1">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-th-txt2 hover:text-th-txt'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleModules.map((m, i) => (
              <div
                key={i}
                className="bg-th-srf border border-th-brd rounded-2xl p-5 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: m.bg }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={m.color} strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: m.badgeColor }}>
                    {m.badge}
                  </span>
                </div>
                <div className="text-[11px] text-th-muted uppercase tracking-wider mb-1">{m.tag}</div>
                <div className="text-[15px] font-semibold text-th-txt mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {m.title}
                </div>
                <div className="text-sm text-th-txt2 leading-relaxed mb-4">{m.desc}</div>
                <div className="flex items-center justify-between pt-3 border-t border-th-brds">
                  <span className="text-xs text-th-muted">{m.label}</span>
                  <Link href="/login" className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Access →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="px-6 sm:px-16 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="relative rounded-3xl overflow-hidden" style={{ background: '#0f2044' }}>
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1560472355-536de3962603?auto=format&fit=crop&w=1400&q=80"
                alt="Banking security"
                className="w-full h-full object-cover opacity-10"
              />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 sm:px-14 py-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
                  Build a Cyber-Resilient<br />Workforce For Your Bank
                </h2>
                <p className="text-blue-200 text-sm max-w-[400px] leading-relaxed">
                  FortiBank gives security leaders full visibility over staff cyber awareness and the tools to act fast on real threats.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-7 py-3.5 rounded-xl text-sm font-semibold transition-all shadow-lg whitespace-nowrap"
                >
                  Start protecting your bank
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="about" className="px-6 sm:px-16 py-16 bg-th-srf">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-4">
            <div className="text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase font-medium mb-2">Simple process</div>
            <h2 className="text-[clamp(26px,3vw,34px)] font-bold text-th-txt mb-3">Steps to onboard your entire bank</h2>
            <p className="text-base text-th-txt2 max-w-[440px] mx-auto">
              The right solution for compliance-driven cybersecurity training at scale
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            {STEPS.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center bg-th-srf border border-th-brd rounded-2xl p-8">
                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center mb-4">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                  </svg>
                </div>
                <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 tracking-wider">{step.n}</div>
                <div className="text-base font-semibold text-th-txt mb-2">{step.title}</div>
                <div className="text-sm text-th-txt2 leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>

          {/* secondary content panel */}
          <div className="mt-8 rounded-3xl overflow-hidden relative" style={{ background: '#1e3a5f' }}>
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1493119508027-2b584f234d6c?auto=format&fit=crop&w=1200&q=80"
                alt="Banking compliance"
                className="w-full h-full object-cover opacity-15"
              />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-10 py-12">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Come with us to make your bank more secure and more compliant</h3>
                <p className="text-blue-200 text-sm leading-relaxed max-w-[420px]">
                  We are here to show you tips and insights that help your institution reach its fullest compliance potential.
                  Join us and let us explore the simple yet effective ways to make your security training excellent, naturally.
                </p>
              </div>
              <Link
                href="/login"
                className="flex-shrink-0 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all"
              >
                Read more
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG / CONTENT SECTION ───────────────────────────────────── */}
      <section className="px-6 sm:px-16 py-16">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-14">

            {/* Left — copy */}
            <div className="flex-1 order-2 lg:order-1">
              <div className="text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase font-medium mb-3">Cyber intelligence</div>
              <h2 className="text-[clamp(24px,3vw,36px)] font-bold text-th-txt mb-5 leading-tight">
                Stay one step ahead<br />of every cyber threat
              </h2>
              <p className="text-base text-th-txt2 mb-4 leading-relaxed">
                Banking institutions are the most targeted sector in East Africa. FortiBank LMS arms your entire
                workforce, from tellers to branch managers, with the knowledge to detect, avoid, and report
                threats before damage occurs.
              </p>
              <p className="text-sm text-th-txt2 mb-8 leading-relaxed">
                Our phishing simulation engine reveals real vulnerabilities in your organisation while generating
                automatic retraining triggers for at-risk employees. Threat intelligence, delivered at scale.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all"
              >
                Read more
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>

            {/* Right — image */}
            <div className="flex-1 order-1 lg:order-2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80"
                  alt="Security team training"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="px-6 sm:px-16 py-16 bg-th-srf">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs text-blue-600 dark:text-blue-400 tracking-widest uppercase font-medium mb-2">Trusted by Kenyan banks</div>
            <h2 className="text-[clamp(26px,3vw,34px)] font-bold text-th-txt">What security leaders say</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <div key={i} className="bg-th-bg border border-th-brd rounded-2xl p-5 flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-th-txt2 leading-relaxed flex-1 mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-2.5 pt-3 border-t border-th-brds">
                  <img src={t.img} alt={t.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-th-txt">{t.name}</div>
                    <div className="text-[11px] text-th-muted">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────── */}
      <section id="contact" className="px-6 sm:px-16 py-16">
        <div className="max-w-[1200px] mx-auto text-center">
          <h2 className="text-2xl font-bold text-th-txt mb-2">
            Stay in the loop with cyber threat intelligence
          </h2>
          <p className="text-sm text-th-txt2 mb-7 max-w-[420px] mx-auto">
            CBK regulatory updates, phishing trend reports, and security awareness tips for banking professionals.
          </p>
          <div className="flex gap-2 max-w-[400px] mx-auto">
            <input
              type="email"
              placeholder="Your work email"
              className="flex-1 bg-th-ibg border border-th-ibrd rounded-lg px-4 py-2.5 text-sm text-th-txt placeholder:text-th-muted outline-none focus:border-blue-500 transition-colors"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 flex-shrink-0">
              Subscribe
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-th-brd bg-th-srf px-6 sm:px-16 py-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

            {/* Brand col */}
            <div className="col-span-2 sm:col-span-2 lg:col-span-1">
              <img src="/FortiBank%20LogoO.png" alt="FortiBank" className="max-w-[120px] max-h-8 w-auto object-contain dark:hidden mb-3" />
              <img src="/FortiBank%20Logo%20darkmode%20clean.png" alt="FortiBank" className="max-w-[120px] max-h-8 w-auto object-contain hidden dark:block mb-3" />
              <p className="text-sm text-th-txt2 leading-relaxed max-w-[200px]">
                Cybersecurity training purpose-built for Kenyan banking institutions. Nurturing compliance, naturally.
              </p>
              <div className="flex gap-3 mt-5">
                {/* LinkedIn */}
                <a href="#" className="w-8 h-8 rounded-lg bg-th-hov border border-th-brd flex items-center justify-center text-th-txt2 hover:text-blue-600 transition-colors">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                {/* X (formerly Twitter) */}
                <a href="#" className="w-8 h-8 rounded-lg bg-th-hov border border-th-brd flex items-center justify-center text-th-txt2 hover:text-th-txt transition-colors">
                  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.738-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>
                </a>
              </div>
            </div>

            {/* Link columns */}
            {[
              { title: 'Platform',    links: ['Features', 'Modules', 'Analytics', 'Certificates'] },
              { title: 'Compliance',  links: ['CBK Framework', 'Data Protection', 'Audit Reports', 'Privacy Policy'] },
              { title: 'Company',     links: ['About', 'Blog', 'Contact', 'Terms of Use'] },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-xs font-bold text-th-txt tracking-widest uppercase mb-4">{col.title}</div>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-th-txt2 hover:text-th-txt transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-th-brds flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-sm text-th-muted">&copy; 2026 FortiBank Security Training. All rights reserved.</div>
            <div className="flex gap-5">
              <Link href="/privacy-policy" className="text-sm text-th-muted hover:text-th-txt2 underline underline-offset-2 transition-colors">Privacy policy</Link>
              <Link href="/terms-of-use" className="text-sm text-th-muted hover:text-th-txt2 underline underline-offset-2 transition-colors">Terms of use</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
