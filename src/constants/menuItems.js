// src/constants/menuItems.js
// Navigation items for employee sidebar

export const EMPLOYEE_NAV_ITEMS = [
  {
    label: 'Dashboard',                                                                                    
    icon:  'dashboard',
    href:  null, // set dynamically from getDashboardUrl(role)
  },
  {
    label: 'My Modules',
    icon:  'modules',
    href:  '/modules',
  },
  {
    label: 'Phishing Tests',
    icon:  'phishing',
    href:  '/phishing',
  },
  {
    label: 'Risk Score',
    icon:  'risk',
    href:  '/risk-score',
  },
  {
    label: 'Results',
    icon:  'results',
    href:  '/results',
  },
  {
    label: 'Certificates',
    icon:  'cert',
    href:  '/certificates',
  },
  {
    label: 'Profile',
    icon:  'profile',
    href:  '/profile',
  },
]

export const ADMIN_NAV_ITEMS = [
  { label: 'Overview',   href: '/admin',            exact: true },
  { label: 'Users',      href: '/admin/users' },
  { label: 'Modules',    href: '/admin/modules' },
  { label: 'Phishing',   href: '/admin/phishing' },
  { label: 'Analytics',  href: '/admin/analytics' },
  { label: 'Reports',    href: '/admin/reports' },
]