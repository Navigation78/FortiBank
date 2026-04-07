
// src/utils/roleRedirect.js
// Maps a role name to its correct dashboard URL.
// Used in middleware and after login to redirect users.

import { ROLES, EMPLOYEE_ROLES, ADMIN_ROLES } from '@/constants/roles'

// Maps each role to its home dashboard URL
// Leadership and departmental heads share grouped dashboards
// to avoid over-engineering the route structure
export const ROLE_DASHBOARD_MAP = {
  // Leadership → their own dashboard
  [ROLES.BRANCH_MANAGER]:           '/dashboard/branch-manager',
  [ROLES.ASSISTANT_BRANCH_MANAGER]: '/dashboard/assistant-branch-manager',

  // Departmental Heads → each has own dashboard
  [ROLES.CREDIT_MANAGER]:           '/dashboard/credit-manager',
  [ROLES.CUSTOMER_SERVICE_MANAGER]: '/dashboard/customer-service-manager',
  [ROLES.RELATIONSHIP_MANAGER]:     '/dashboard/relationship-manager',

  // Professional Staff → each has own dashboard
  [ROLES.RELATIONSHIP_OFFICER]:     '/dashboard/relationship-officer',
  [ROLES.CREDIT_OFFICER]:           '/dashboard/credit-officer',
  [ROLES.SERVICE_RECOVERY_OFFICER]: '/dashboard/service-recovery-officer',

  // Frontline Staff → each has own dashboard
  [ROLES.HEAD_TELLER]:              '/dashboard/head-teller',
  [ROLES.TELLER]:                   '/dashboard/teller',
  [ROLES.CUSTOMER_SERVICE_ASSISTANT]: '/dashboard/customer-service-assistant',

  // System Admin → admin panel
  [ROLES.SYSTEM_ADMIN]:             '/admin',
}

/**
 * Returns the correct dashboard URL for a given role.
 * Falls back to /dashboard if role is unknown.
 */
export function getDashboardUrl(role) {
  return ROLE_DASHBOARD_MAP[role] ?? '/dashboard'
}

/**
 * Returns true if the role belongs to the employee-facing dashboard
 */
export function isEmployeeRole(role) {
  return EMPLOYEE_ROLES.includes(role)
}

/**
 * Returns true if the role belongs to the admin panel
 */
export function isAdminRole(role) {
  return ADMIN_ROLES.includes(role)
}

/**
 * Given a pathname, returns whether the current role is
 * allowed to access that path.
 */
export function canAccessPath(role, pathname) {
  // Admin panel — system_admin only
  if (pathname.startsWith('/admin')) {
    return isAdminRole(role)
  }

  // Role-specific dashboards — each role can only access their own
  

  for (const [path, requiredRole] of Object.entries(roleDashboards)) {
    if (pathname.startsWith(path)) {
      return role === requiredRole
    }
  }

  // All other authenticated routes accessible to any role
  return true
}