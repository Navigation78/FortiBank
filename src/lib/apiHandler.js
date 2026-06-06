// src/lib/apiHandler.js
// Wraps every API route handler so that:
//   1. Uncaught exceptions are caught — the server never returns an empty/crashed response
//   2. Errors are logged with full diagnostic context (type, code, stack, route)
//   3. Responses always carry a consistent { error, code } shape
//   4. Known AppError subclasses map to their correct HTTP status codes
//   5. Truly unknown errors return a safe generic message (no internals leak to clients)

import { NextResponse } from 'next/server'
import { AppError, NetworkError, ValidationError, AuthError, ForbiddenError, NotFoundError, ERROR_CODES } from '@/lib/errors'
import { logger } from '@/lib/logger'

/**
 * Wraps a Next.js route handler function with structured error handling.
 *
 * Usage:
 *   export const GET = withApiHandler(async (request, context) => { ... })
 *
 * @param {(req: Request, ctx: any) => Promise<Response>} handler
 * @returns {(req: Request, ctx: any) => Promise<Response>}
 */
export function withApiHandler(handler) {
  return async function wrappedHandler(request, context) {
    const route = request?.nextUrl?.pathname ?? request?.url ?? 'unknown'
    const method = request?.method ?? 'UNKNOWN'

    try {
      return await handler(request, context)
    } catch (err) {
      return handleError(err, { route, method })
    }
  }
}

/**
 * Classifies an error and returns the appropriate NextResponse.
 * Also logs every error so nothing is silently swallowed.
 */
export function handleError(err, context = {}) {
  // ── Known application errors ──────────────────────────────
  if (err instanceof AppError) {
    const isServerError = err.statusCode >= 500
    logger.error(err, context)

    // Don't leak internal details for 5xx errors in production
    const clientMessage = isServerError && process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred. Please try again later.'
      : err.message

    return NextResponse.json(
      { error: clientMessage, code: err.code },
      { status: err.statusCode }
    )
  }

  // ── JSON parse / body read errors ────────────────────────
  if (err instanceof SyntaxError) {
    const wrapped = new ValidationError('Invalid JSON in request body', { originalMessage: err.message })
    logger.error(wrapped, context)
    return NextResponse.json(
      { error: wrapped.message, code: wrapped.code },
      { status: 400 }
    )
  }

  // ── Network / fetch-level errors ──────────────────────────
  if (err instanceof TypeError && err.message?.includes('fetch')) {
    const wrapped = new NetworkError('Network request failed', { originalMessage: err.message })
    logger.error(wrapped, context)
    return NextResponse.json(
      { error: 'A network error occurred. Please try again.', code: ERROR_CODES.NETWORK_ERROR },
      { status: 503 }
    )
  }

  // ── Truly unknown / unexpected errors ────────────────────
  const unknown = new Error(err?.message || 'Unknown error')
  unknown.name      = err?.name      || 'UnknownError'
  unknown.code      = ERROR_CODES.UNKNOWN
  unknown.stack     = err?.stack
  unknown.context   = context

  logger.error(unknown, { ...context, originalErrorName: err?.name })

  return NextResponse.json(
    {
      error: 'Something went wrong. Our team has been notified. Please try again.',
      code: ERROR_CODES.UNKNOWN,
    },
    { status: 500 }
  )
}
