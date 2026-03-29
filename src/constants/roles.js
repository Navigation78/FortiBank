// ============================================================
// src/constants/roles.js
// Single source of truth for all role names and configuration.
// Import from here everywhere — never hardcode role strings.
// ============================================================

export const ROLES = {
  // Leadership
  BRANCH_MANAGER:           'branch_manager',
  ASSISTANT_BRANCH_MANAGER: 'assistant_branch_manager',

  // Departmental Heads
  CREDIT_MANAGER:           'credit_manager',
  CUSTOMER_SERVICE_MANAGER: 'customer_service_manager',
  RELATIONSHIP_MANAGER:     'relationship_manager',

  // Professional Staff / Senior Officers
  RELATIONSHIP_OFFICER:     'relationship_officer',
  CREDIT_OFFICER:           'credit_officer',
  SERVICE_RECOVERY_OFFICER: 'service_recovery_officer',

  // Frontline Staff / Operations
  HEAD_TELLER:              'head_teller',
  TELLER:                   'teller',
  CUSTOMER_SERVICE_ASSISTANT: 'customer_service_assistant',

  // System
  SYSTEM_ADMIN:             'system_admin',
}

// Role categories
export const ROLE_CATEGORIES = {
  LEADERSHIP:          'Leadership',
  DEPARTMENTAL_HEADS:  'Departmental Heads',
  PROFESSIONAL_STAFF:  'Professional Staff',
  FRONTLINE_STAFF:     'Frontline Staff',
  SYSTEM:              'System',
}

// Roles that get the employee-facing dashboard + training modules
export const EMPLOYEE_ROLES = [
  ROLES.BRANCH_MANAGER,
  ROLES.ASSISTANT_BRANCH_MANAGER,
  ROLES.CREDIT_MANAGER,
  ROLES.CUSTOMER_SERVICE_MANAGER,
  ROLES.RELATIONSHIP_MANAGER,
  ROLES.RELATIONSHIP_OFFICER,
  ROLES.CREDIT_OFFICER,
  ROLES.SERVICE_RECOVERY_OFFICER,
  ROLES.HEAD_TELLER,
  ROLES.TELLER,
  ROLES.CUSTOMER_SERVICE_ASSISTANT,
]

// Roles that get the admin panel (no training modules)
export const ADMIN_ROLES = [
  ROLES.SYSTEM_ADMIN,
]

// Leadership roles (strictest thresholds)
export const LEADERSHIP_ROLES = [
  ROLES.BRANCH_MANAGER,
  ROLES.ASSISTANT_BRANCH_MANAGER,
]

// Departmental head roles
export const DEPARTMENTAL_HEAD_ROLES = [
  ROLES.CREDIT_MANAGER,
  ROLES.CUSTOMER_SERVICE_MANAGER,
  ROLES.RELATIONSHIP_MANAGER,
]

// Professional staff roles
export const PROFESSIONAL_STAFF_ROLES = [
  ROLES.RELATIONSHIP_OFFICER,
  ROLES.CREDIT_OFFICER,
  ROLES.SERVICE_RECOVERY_OFFICER,
]

// Frontline roles
export const FRONTLINE_ROLES = [
  ROLES.HEAD_TELLER,
  ROLES.TELLER,
  ROLES.CUSTOMER_SERVICE_ASSISTANT,
]

// Display names matching the database
export const ROLE_LABELS = {
  [ROLES.BRANCH_MANAGER]:           'Branch Manager',
  [ROLES.ASSISTANT_BRANCH_MANAGER]: 'Assistant Branch Manager / Operations Manager',
  [ROLES.CREDIT_MANAGER]:           'Credit Manager',
  [ROLES.CUSTOMER_SERVICE_MANAGER]: 'Customer Service Manager',
  [ROLES.RELATIONSHIP_MANAGER]:     'Relationship Manager',
  [ROLES.RELATIONSHIP_OFFICER]:     'Relationship Officer',
  [ROLES.CREDIT_OFFICER]:           'Credit Officer',
  [ROLES.SERVICE_RECOVERY_OFFICER]: 'Service Recovery Officer',
  [ROLES.HEAD_TELLER]:              'Head Teller / Vault Custodian',
  [ROLES.TELLER]:                   'Bank Teller',
  [ROLES.CUSTOMER_SERVICE_ASSISTANT]: 'Customer Service Assistant',
  [ROLES.SYSTEM_ADMIN]:             'System Administrator',
}

// Risk thresholds per role (mirrors the database values)
export const ROLE_THRESHOLDS = {
  [ROLES.BRANCH_MANAGER]:           { warning: 45, critical: 58 },
  [ROLES.ASSISTANT_BRANCH_MANAGER]: { warning: 45, critical: 58 },
  [ROLES.CREDIT_MANAGER]:           { warning: 50, critical: 63 },
  [ROLES.CUSTOMER_SERVICE_MANAGER]: { warning: 50, critical: 63 },
  [ROLES.RELATIONSHIP_MANAGER]:     { warning: 50, critical: 63 },
  [ROLES.RELATIONSHIP_OFFICER]:     { warning: 55, critical: 68 },
  [ROLES.CREDIT_OFFICER]:           { warning: 55, critical: 68 },
  [ROLES.SERVICE_RECOVERY_OFFICER]: { warning: 55, critical: 68 },
  [ROLES.HEAD_TELLER]:              { warning: 58, critical: 72 },
  [ROLES.TELLER]:                   { warning: 58, critical: 72 },
  [ROLES.CUSTOMER_SERVICE_ASSISTANT]: { warning: 58, critical: 72 },
  [ROLES.SYSTEM_ADMIN]:             { warning: 40, critical: 55 },
}

// Risk score color coding for UI
export const RISK_LEVELS = {
  LOW:      { label: 'Low Risk',      color: 'green',  max: 39  },
  MEDIUM:   { label: 'Medium Risk',   color: 'yellow', max: 54  },
  WARNING:  { label: 'High Risk',     color: 'orange', max: 69  },
  CRITICAL: { label: 'Critical Risk', color: 'red',    max: 100 },
}