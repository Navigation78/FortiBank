// ============================================================
// src/hooks/useRole.js
// Role check helpers.
// Use these in components to conditionally render UI.
// ============================================================

import { useAuth } from '@/hooks/useAuth'
import {
  ROLES,
  EMPLOYEE_ROLES,
  ADMIN_ROLES,
  LEADERSHIP_ROLES,
  DEPARTMENTAL_HEAD_ROLES,
  PROFESSIONAL_STAFF_ROLES,
  FRONTLINE_ROLES,
} from '@/constants/roles'

export function useRole() {
  const { role, profile, loading } = useAuth()

  return {
    role,
    loading,

    // ── Individual role checks ────────────────────────────────
    isBranchManager:          role === ROLES.BRANCH_MANAGER,
    isAssistantBranchManager: role === ROLES.ASSISTANT_BRANCH_MANAGER,
    isCreditManager:          role === ROLES.CREDIT_MANAGER,
    isCustomerServiceManager: role === ROLES.CUSTOMER_SERVICE_MANAGER,
    isRelationshipManager:    role === ROLES.RELATIONSHIP_MANAGER,
    isRelationshipOfficer:    role === ROLES.RELATIONSHIP_OFFICER,
    isCreditOfficer:          role === ROLES.CREDIT_OFFICER,
    isServiceRecoveryOfficer: role === ROLES.SERVICE_RECOVERY_OFFICER,
    isHeadTeller:             role === ROLES.HEAD_TELLER,
    isTeller:                 role === ROLES.TELLER,
    isCustomerServiceAssistant: role === ROLES.CUSTOMER_SERVICE_ASSISTANT,
    isSystemAdmin:            role === ROLES.SYSTEM_ADMIN,

    // ── Category checks ───────────────────────────────────────
    isLeadership:         LEADERSHIP_ROLES.includes(role),
    isDepartmentalHead:   DEPARTMENTAL_HEAD_ROLES.includes(role),
    isProfessionalStaff:  PROFESSIONAL_STAFF_ROLES.includes(role),
    isFrontlineStaff:     FRONTLINE_ROLES.includes(role),
    isEmployeeRole:       EMPLOYEE_ROLES.includes(role),
    isAdminRole:          ADMIN_ROLES.includes(role),

    // ── Risk thresholds for current user ─────────────────────
    warningThreshold:  profile?.risk_warning_threshold  ?? 55,
    criticalThreshold: profile?.risk_critical_threshold ?? 70,

    // ── Helper: check if user has a specific role ─────────────
    hasRole: (requiredRole) => role === requiredRole,

    // ── Helper: check if user has any of the given roles ──────
    hasAnyRole: (...requiredRoles) => requiredRoles.includes(role),
  }
}

export default useRole