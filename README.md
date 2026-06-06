# FortiBank LMS

> **Securing People. Strengthening Banks.**

A full-stack cybersecurity training platform built for Kenyan commercial banking institutions. FortiBank LMS delivers role-based training modules, live phishing simulations, real-time employee risk scoring, and compliance reporting - aligned with Central Bank of Kenya (CBK) guidelines and the Kenya Data Protection Act (2019).

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [The 12 Staff Roles](#the-12-staff-roles)
- [Training Modules](#training-modules)
- [Risk Score System](#risk-score-system)
- [Phishing Simulation](#phishing-simulation)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)
- [Test Accounts](#test-accounts)

---

## Overview

FortiBank LMS addresses the weakest link in any bank's cybersecurity posture - its people. Rather than generic security awareness content, the platform delivers targeted training based on each employee's specific role and risk exposure. A bank teller faces different threats than a branch manager, and the training reflects that.

The system combines three core pillars:

1. **Training** - Interactive modules with HTML content, embedded YouTube videos, and graded quizzes
2. **Testing** - Live phishing simulation campaigns that measure real employee behavior
3. **Monitoring** - Real-time risk scoring and analytics that give management visibility over organizational cyber risk

---

## Features

### Employee-Facing
- Role-specific training paths - each of the 12 roles sees only relevant modules
- NetAcad-style interactive module viewer with 7 content sections per module
- Timed quizzes with pass/fail grading and multiple attempt support
- Personal risk score dashboard with phishing and quiz breakdown
- Downloadable PDF completion certificates
- Phishing simulation awareness - employees see results after campaigns

### Admin-Facing
- Full user management - create, invite, assign roles, activate/deactivate
- Module management - create and publish training modules with HTML content blocks
- Phishing campaign builder - custom email templates, target role selection, send tracking
- Real-time analytics - completion rates, department risk heatmaps, phishing trends
- Employee Dashboards - preview any of the 12 role dashboards
- CSV export for compliance reporting (users, risk, phishing, completion)
- Risk alert system - automatic email alerts when employee scores cross thresholds

### Security & Compliance
- Supabase Row Level Security (RLS) across all tables
- Role-based access control - no employee can access admin routes
- Audit logging across all significant actions
- Aligned with CBK Cybersecurity Guidelines
- Aligned with Kenya Data Protection Act (2019)
- 72-hour breach notification workflow support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 18, Tailwind CSS v3.4 |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (invite-only, no public signup) |
| Storage | Supabase Storage |
| Email | Resend |
| PDF Generation | pdf-lib |
| Charts | Recharts |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Login, forgot password, reset password
│   ├── (dashboard)/               # All employee-facing pages
│   │   ├── dashboard/             # 11 role-specific dashboard pages
│   │   ├── modules/               # Module list and viewer
│   │   ├── phishing/              # Employee phishing results
│   │   ├── risk-score/            # Personal risk score page
│   │   ├── results/               # Quiz results history
│   │   ├── certificates/          # Earned certificates
│   │   └── profile/               # Profile and password change
│   ├── admin/                     # All admin pages
│   │   ├── users/                 # User management
│   │   ├── modules/               # Module management
│   │   ├── phishing/              # Campaign management
│   │   ├── analytics/             # Charts and analytics
│   │   └── reports/               # Employee dashboards overview
│   └── api/                       # All API routes
├── components/
│   ├── layout/                    # Sidebar, Topbar, PageWrapper, Footer
│   ├── dashboard/                 # DashboardTemplate, StatsCard, RiskScoreGauge
│   ├── modules/                   # ModuleCard, ModuleViewer, VideoPlayer
│   ├── quiz/                      # QuizCard, QuizTimer, QuizResults
│   ├── phishing/                  # CampaignCard, PhishingStats, SimulationBadge
│   ├── analytics/                 # Chart components (Recharts)
│   ├── admin/                     # Admin forms and tables
│   └── ui/                        # Shared UI primitives
├── hooks/                         # useAuth, useModules, useProgress, useQuiz, useRiskScore
├── lib/                           # Supabase clients, email, PDF generator, risk calculator
├── contexts/                      # AuthContext, NotificationContext
├── constants/                     # Roles, menu items, threat categories
└── utils/                         # Date formatters, validators, role redirects

supabase/
├── migrations/                    # 24 SQL migration files
└── seed.sql                       # Initial roles and data
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project
- A Resend account

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/fortibank-lms.git
cd fortibank-lms

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in your values (see Environment Variables section)

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

---

## Environment Variables

Create a `.env.local` file in the root of your project:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=security@yourdomain.com
RESEND_FROM_NAME=FortiBank Security

# Development only - redirects all emails to this address
# Remove in production
DEV_TEST_EMAIL=your_real_email@gmail.com
```

> **Note:** In development, Resend's free tier only sends to the verified signup email. Set `DEV_TEST_EMAIL` to your Resend account email. In production, verify a custom domain on Resend to send to any address.

---

## Database

FortiBank uses Supabase (PostgreSQL) with 18 tables, 3 views, and several stored functions.

### Running Migrations

Run all 24 migration files in `supabase/migrations/` in numbered order (001 through 024) in the Supabase SQL editor.

Then run:
```
supabase/seed.sql
```

### Key Tables

| Table | Purpose |
|---|---|
| `users` | Employee profiles |
| `roles` | The 12 staff roles |
| `user_roles` | Links users to roles |
| `modules` | Training module metadata |
| `module_content` | HTML content blocks per module |
| `module_role_access` | Which roles can access which modules |
| `quizzes` | Quiz configuration per module |
| `quiz_questions` | Questions and options |
| `quiz_attempts` | Employee quiz attempt records |
| `phishing_campaigns` | Campaign configuration |
| `phishing_targets` | Per-employee campaign targets with tracking tokens |
| `phishing_click_events` | Click tracking records |
| `risk_scores` | Calculated risk scores per employee |
| `risk_alerts` | Active risk alerts |
| `certificates` | Issued completion certificates |
| `user_module_progress` | Module progress tracking |

### Key Database Functions

```sql
calculate_user_risk_score(p_user_id UUID)  -- recalculates composite risk score
current_user_role()                         -- returns the role of the current session user
is_admin()                                  -- returns true if current user is system_admin
```

### Views

```sql
users_with_roles          -- joins users + roles for easy querying
user_quiz_best_scores     -- best score per user per module quiz
campaign_stats            -- aggregate phishing stats per campaign
```

### Supabase Configuration

In your Supabase project dashboard:

1. **Authentication → URL Configuration** - add these redirect URLs:
   ```
   http://localhost:3000/reset-password
   https://yourdomain.com/reset-password
   ```

2. **Storage** - create two public buckets:
   - `certificates`
   - `module-content`

---

## The 12 Staff Roles

| Category | Role | Dashboard Path |
|---|---|---|
| Leadership | Branch Manager | `/dashboard/branch-manager` |
| Leadership | Assistant Branch Manager | `/dashboard/assistant-branch-manager` |
| Departmental Heads | Credit Manager | `/dashboard/credit-manager` |
| Departmental Heads | Customer Service Manager | `/dashboard/customer-service-manager` |
| Departmental Heads | Relationship Manager | `/dashboard/relationship-manager` |
| Professional Staff | Relationship Officer | `/dashboard/relationship-officer` |
| Professional Staff | Credit Officer | `/dashboard/credit-officer` |
| Professional Staff | Service Recovery Officer | `/dashboard/service-recovery-officer` |
| Frontline Staff | Head Teller | `/dashboard/head-teller` |
| Frontline Staff | Bank Teller | `/dashboard/teller` |
| Frontline Staff | Customer Service Assistant | `/dashboard/customer-service-assistant` |
| System | System Administrator | `/admin` |

> There is no public signup. The system administrator creates all user accounts via the admin panel and employees receive an invite email from Supabase.

---

## Training Modules

The platform ships with 8 cybersecurity training modules:

| # | Title | Duration | Target Roles |
|---|---|---|---|
| 1 | Introduction to Cybersecurity | 35 min | All roles |
| 2 | Phishing Awareness & Email Safety | 40 min | All roles |
| 3 | Password Security & MFA | 30 min | All roles |
| 4 | Social Engineering Tactics | 35 min | All roles |
| 5 | Data Handling & Privacy Regulations | 35 min | All roles |
| 6 | Insider Threats & Access Control | 35 min | Leadership & Managers |
| 7 | Executive Cybersecurity Risk Management | 40 min | Leadership & Managers |
| 8 | Incident Response Procedures | 35 min | All roles |

Each module contains 7 sections following the NetAcad structure:
- Introduction text
- Concept sections with HTML content
- Embedded YouTube video
- Real-world banking scenarios
- Practical application content
- Summary and key takeaways
- Graded quiz (70% pass threshold)

---

## Risk Score System

Each employee has a composite risk score (0–100) calculated from two factors:

```
Composite Score = (Phishing Click Rate × 0.60) + (Quiz Fail Rate × 0.40)
```

### Risk Thresholds by Category

| Category | Warning | Critical |
|---|---|---|
| Leadership | 45 | 58 |
| Departmental Heads | 50 | 63 |
| Professional Staff | 55 | 68 |
| Frontline Staff | 58 | 72 |
| System Admin | 40 | 55 |

### Risk Levels

| Score | Level | Color |
|---|---|---|
| 0 – 44 | Low Risk | Green |
| 45 – 57 | Moderate Risk | Yellow |
| 58 – 72 | High Risk | Orange |
| 73 – 100 | Critical Risk | Red |

When a score crosses a warning or critical threshold, the system automatically creates a `risk_alerts` record and sends an email notification to the employee via Resend.

---

## Phishing Simulation

Admins can create and launch phishing simulation campaigns:

1. **Create campaign** - set email subject, sender name, sender address, and HTML email body
2. **Select target roles** - choose which staff categories receive the simulation
3. **Launch** - the system generates a unique tracking token per employee and sends emails
4. **Track** - when an employee clicks the phishing link, it records the event and updates their risk score
5. **Review** - campaign stats show sent count, click rate, and per-employee results

> In development, set `DEV_TEST_EMAIL` in `.env.local` to receive all simulation emails in one inbox. Each email's subject line is prefixed with the target employee's name so you can distinguish them.

---

## Admin Panel

The admin panel (`/admin`) is accessible only to users with the `system_admin` role.

### Key Admin Routes

| Route | Purpose |
|---|---|
| `/admin` | Overview dashboard with key metrics |
| `/admin/users` | User list, create, edit, assign roles |
| `/admin/users/create` | Invite a new employee |
| `/admin/modules` | Module list |
| `/admin/modules/create` | Create a new training module |
| `/admin/phishing` | Campaign list |
| `/admin/phishing/create` | Create a phishing campaign |
| `/admin/analytics` | Charts - completion rates, risk trends, phishing |
| `/admin/reports` | Employee dashboards - preview any role's view |

### Admin Sidebar

The admin sidebar uses a **green** accent color to visually distinguish it from the employee-facing sidebar which uses blue.

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Project → Settings → Environment Variables
# Add all variables from .env.local
```

### Pre-deployment Checklist

- [ ] All Supabase migrations have been run
- [ ] Storage buckets `certificates` and `module-content` are created
- [ ] Supabase redirect URLs include your production domain
- [ ] `NEXT_PUBLIC_APP_URL` is set to your production URL
- [ ] `DEV_TEST_EMAIL` is removed from production environment
- [ ] A custom domain is verified on Resend for production email sending
- [ ] All 8 modules have been created and published via `/admin/modules/create`
- [ ] At least one system admin account exists

---

## Test Accounts

For development and testing, 12 test accounts cover all roles. All accounts use Gmail `+` aliases and land in the same inbox.

| Role | Email | Password |
|---|---|---|
| System Admin | julianjeri650+admin@gmail.com | FortiBank@2024! |
| Branch Manager | julianjeri650+branchmanager@gmail.com | FortiBank@2024! |
| Assistant Branch Manager | julianjeri650+asstmanager@gmail.com | FortiBank@2024! |
| Credit Manager | julianjeri650+creditmanager@gmail.com | FortiBank@2024! |
| Customer Service Manager | julianjeri650+csmanager@gmail.com | FortiBank@2024! |
| Relationship Manager | julianjeri650+relmanager@gmail.com | FortiBank@2024! |
| Relationship Officer | julianjeri650+relofficer@gmail.com | FortiBank@2024! |
| Credit Officer | julianjeri650+creditofficer@gmail.com | FortiBank@2024! |
| Service Recovery Officer | julianjeri650+recoveryofficer@gmail.com | FortiBank@2024! |
| Head Teller | julianjeri650+headteller@gmail.com | FortiBank@2024! |
| Bank Teller | julianjeri650+teller@gmail.com | FortiBank@2024! |
| Customer Service Assistant | julianjeri650+csassistant@gmail.com | FortiBank@2024! |

> Remove or change all test accounts before deploying to production.

---

## PostCSS Configuration

The project uses Tailwind CSS v3.4 with a standard `postcss.config.js`:

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Tailwind configuration lives in `tailwind.config.js` at the project root. Theme colors are defined as CSS variables in `src/app/globals.css` and referenced via the `extend.colors` section of `tailwind.config.js`.

---

## License

This project was built as a portfolio and academic project. All rights reserved.

---

## Live Demo

[https://forti-bank.vercel.app](https://forti-bank.vercel.app)

---

## Author

Built by Julia Migwi · [GitHub](https://github.com/yourusername) · [LinkedIn](https://linkedin.com/in/yourprofile)

> *"The weakest link in any security system is the human element."*