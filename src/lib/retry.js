// src/lib/retry.js
// Retry with exponential back-off for transient network/service failures.

import { logger } from '@/lib/logger'

/**
 * @param {() => Promise<T>}  fn
 * @param {{
 *   maxAttempts?: number,   // default 3
 *   baseDelay?:  number,    // ms, default 300
 *   maxDelay?:   number,    // ms cap, default 5000
 *   shouldRetry?: (err: unknown, attempt: number) => boolean,
 *   label?:      string,    // for log messages
 * }} options
 * @returns {Promise<T>}
 */
export async function withRetry(fn, options = {}) {
  const {
    maxAttempts = 3,
    baseDelay   = 300,
    maxDelay    = 5000,
    shouldRetry = defaultShouldRetry,
    label       = 'operation',
  } = options

  let lastError

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err

      const isLast = attempt === maxAttempts
      const retry  = !isLast && shouldRetry(err, attempt)

      if (!retry) {
        logger.warn(`[retry] ${label} failed after ${attempt} attempt(s), not retrying`, {
          attempt,
          error: err?.message,
        })
        throw err
      }

      const delay = Math.min(baseDelay * 2 ** (attempt - 1), maxDelay)
      logger.warn(`[retry] ${label} attempt ${attempt} failed, retrying in ${delay}ms`, {
        attempt,
        error: err?.message,
      })
      await sleep(delay)
    }
  }

  throw lastError
}

function defaultShouldRetry(err) {
  // Retry on network/timeout errors and 503/429 HTTP status codes
  if (!err) return false
  const status = err?.statusCode ?? err?.status
  if (status === 429 || status === 503 || status === 504) return true
  // Retry if there is no HTTP status (raw network failure)
  if (typeof status === 'undefined' || status === null) return true
  return false
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
