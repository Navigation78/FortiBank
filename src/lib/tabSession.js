'use client'

const TAB_ID_KEY = 'fortibank-tab-id'

function createTabId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getTabId() {
  if (typeof window === 'undefined') return null

  try {
    const existing = sessionStorage.getItem(TAB_ID_KEY)
    if (existing) return existing

    const tabId = createTabId()
    sessionStorage.setItem(TAB_ID_KEY, tabId)
    window.name = window.name || tabId
    return tabId
  } catch {
    if (!window.name) window.name = createTabId()
    return window.name
  }
}

export function applyTabHeaders(headers = new Headers()) {
  const nextHeaders = new Headers(headers)
  const tabId = getTabId()

  if (tabId && !nextHeaders.has('X-Tab-ID')) {
    nextHeaders.set('X-Tab-ID', tabId)
  }

  return nextHeaders
}
