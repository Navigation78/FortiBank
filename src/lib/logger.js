// src/lib/logger.js
// Centralized structured logger. Every error gets: timestamp, level, message,
// error code, stack trace, and arbitrary context so you can debug from logs alone.

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 }
const MIN_LEVEL = process.env.NODE_ENV === 'production' ? LEVELS.warn : LEVELS.debug

function formatEntry(level, message, meta = {}) {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    env: process.env.NODE_ENV,
    ...meta,
  }
}

function print(level, entry) {
  const line = JSON.stringify(entry)
  if (level === 'error') {
    console.error(line)
  } else if (level === 'warn') {
    console.warn(line)
  } else {
    console.log(line)
  }
}

export const logger = {
  /**
   * Log an error with full diagnostic info.
   * @param {Error|unknown} err
   * @param {object}        context  – extra key-value pairs (userId, route, input, etc.)
   */
  error(err, context = {}) {
    if (LEVELS.error > MIN_LEVEL) return
    const entry = formatEntry('error', err?.message || String(err), {
      errorName:  err?.name   || 'Error',
      errorCode:  err?.code   || 'UNKNOWN',
      statusCode: err?.statusCode,
      stack:      err?.stack  || null,
      context:    { ...err?.context, ...context },
    })
    print('error', entry)
  },

  warn(message, context = {}) {
    if (LEVELS.warn > MIN_LEVEL) return
    print('warn', formatEntry('warn', message, { context }))
  },

  info(message, context = {}) {
    if (LEVELS.info > MIN_LEVEL) return
    print('info', formatEntry('info', message, { context }))
  },

  debug(message, context = {}) {
    if (LEVELS.debug > MIN_LEVEL) return
    print('debug', formatEntry('debug', message, { context }))
  },
}
