// src/utils/validators.js

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password) {
  return password && password.length >= 8
}

export function isValidEmployeeId(id) {
  return /^[A-Z]{2}\d{3,6}$/i.test(id)
}

export function validateUserForm({ full_name, email, password, role_id }) {
  const errors = {}
  if (!full_name?.trim())    errors.full_name = 'Full name is required'
  if (!isValidEmail(email))  errors.email     = 'Valid email is required'
  if (!isValidPassword(password)) errors.password = 'Password must be at least 8 characters'
  if (!role_id)              errors.role_id   = 'Please select a role'
  return { errors, isValid: Object.keys(errors).length === 0 }
}

export function validateModuleForm({ title, content_blocks }) {
  const errors = {}
  if (!title?.trim()) errors.title = 'Module title is required'
  if (!content_blocks || content_blocks.length === 0) {
    errors.content = 'At least one content section is required'
  }
  return { errors, isValid: Object.keys(errors).length === 0 }
}

export function validateCampaignForm({ name, email_subject, email_body_html }) {
  const errors = {}
  if (!name?.trim())           errors.name          = 'Campaign name is required'
  if (!email_subject?.trim())  errors.email_subject = 'Email subject is required'
  if (!email_body_html?.trim()) errors.email_body   = 'Email body is required'
  if (!email_body_html?.includes('{{phishing_link}}')) {
    errors.phishing_link = 'Email body must include {{phishing_link}} merge tag'
  }
  return { errors, isValid: Object.keys(errors).length === 0 }
}