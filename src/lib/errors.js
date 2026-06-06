// src/lib/errors.js
// Structured error classes for every failure category in the system.
// All API handlers should throw these instead of returning raw error strings.

export const ERROR_CODES = {
  // Category 1: User/Input Errors
  VALIDATION_ERROR:     'VALIDATION_ERROR',
  MISSING_FIELD:        'MISSING_FIELD',
  INVALID_FORMAT:       'INVALID_FORMAT',

  // Category 2: Auth Errors
  UNAUTHORIZED:         'UNAUTHORIZED',
  FORBIDDEN:            'FORBIDDEN',
  SESSION_EXPIRED:      'SESSION_EXPIRED',

  // Category 3: Network/External Errors
  NETWORK_ERROR:        'NETWORK_ERROR',
  SERVICE_UNAVAILABLE:  'SERVICE_UNAVAILABLE',
  TIMEOUT:              'TIMEOUT',
  EMAIL_SEND_FAILED:    'EMAIL_SEND_FAILED',

  // Category 4: System/Runtime Errors
  RUNTIME_ERROR:        'RUNTIME_ERROR',
  DB_ERROR:             'DB_ERROR',
  STORAGE_ERROR:        'STORAGE_ERROR',
  NULL_REFERENCE:       'NULL_REFERENCE',

  // Category 5: Business Logic Errors
  NOT_FOUND:            'NOT_FOUND',
  CONFLICT:             'CONFLICT',
  BUSINESS_RULE:        'BUSINESS_RULE',
  MAX_ATTEMPTS:         'MAX_ATTEMPTS',
  NOT_ELIGIBLE:         'NOT_ELIGIBLE',

  // Category 6: Unknown
  UNKNOWN:              'UNKNOWN',
}

export class AppError extends Error {
  constructor(message, statusCode = 500, code = ERROR_CODES.UNKNOWN, context = {}) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.context = context
    this.timestamp = new Date().toISOString()
    // Preserve stack trace in V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

// Category 1 — User/Input Errors (HTTP 400)
export class ValidationError extends AppError {
  constructor(message, context = {}) {
    super(message, 400, ERROR_CODES.VALIDATION_ERROR, context)
    this.name = 'ValidationError'
  }
}

// Category 2 — Auth Errors
export class AuthError extends AppError {
  constructor(message = 'Unauthorized', networkError = false) {
    super(message, networkError ? 503 : 401, networkError ? ERROR_CODES.SERVICE_UNAVAILABLE : ERROR_CODES.UNAUTHORIZED)
    this.name = 'AuthError'
    this.networkError = networkError
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403, ERROR_CODES.FORBIDDEN)
    this.name = 'ForbiddenError'
  }
}

// Category 3 — Network/External Errors (HTTP 503)
export class NetworkError extends AppError {
  constructor(message = 'External service unavailable', context = {}) {
    super(message, 503, ERROR_CODES.NETWORK_ERROR, context)
    this.name = 'NetworkError'
  }
}

export class EmailError extends AppError {
  constructor(message = 'Failed to send email', context = {}) {
    super(message, 503, ERROR_CODES.EMAIL_SEND_FAILED, context)
    this.name = 'EmailError'
  }
}

// Category 4 — System/Runtime Errors (HTTP 500)
export class RuntimeError extends AppError {
  constructor(message = 'An internal error occurred', context = {}) {
    super(message, 500, ERROR_CODES.RUNTIME_ERROR, context)
    this.name = 'RuntimeError'
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', context = {}) {
    super(message, 500, ERROR_CODES.DB_ERROR, context)
    this.name = 'DatabaseError'
  }
}

// Category 5 — Business Logic Errors
export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', context = {}) {
    super(message, 404, ERROR_CODES.NOT_FOUND, context)
    this.name = 'NotFoundError'
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists', context = {}) {
    super(message, 409, ERROR_CODES.CONFLICT, context)
    this.name = 'ConflictError'
  }
}

export class BusinessLogicError extends AppError {
  constructor(message, statusCode = 422, context = {}) {
    super(message, statusCode, ERROR_CODES.BUSINESS_RULE, context)
    this.name = 'BusinessLogicError'
  }
}

// Maps a raw Supabase/unknown error to the closest AppError subclass
export function classifyError(err) {
  if (err instanceof AppError) return err

  const message = err?.message || String(err)
  const status  = err?.status

  // Supabase network failures have no numeric status
  if (err && typeof status !== 'number' && !status) {
    return new NetworkError(message, { originalError: message })
  }

  if (status === 401) return new AuthError(message)
  if (status === 403) return new ForbiddenError(message)
  if (status === 404) return new NotFoundError(message)
  if (status === 409) return new ConflictError(message)
  if (status >= 400 && status < 500) return new ValidationError(message)
  if (status === 503) return new NetworkError(message)

  return new RuntimeError(message, { originalError: message, originalStatus: status })
}
