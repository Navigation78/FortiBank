'use client'

// src/components/ErrorBoundary.jsx
// Reusable React error boundary. Catches rendering errors in child trees.
// Usage: <ErrorBoundary fallback={<p>Custom fallback</p>}><Component /></ErrorBoundary>

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Log client-side rendering errors with component stack
    console.error('[ErrorBoundary] Rendering error caught:', {
      message:        error?.message,
      name:           error?.name,
      componentStack: info?.componentStack,
      timestamp:      new Date().toISOString(),
    })
  }

  handleReset() {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) return this.props.fallback

    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5 p-6 text-center">
        <div className="mb-3 text-3xl">⚠</div>
        <h3 className="mb-1 text-base font-semibold text-th-txt">Something went wrong</h3>
        <p className="mb-4 text-sm text-th-muted">
          {this.state.error?.message || 'An unexpected error occurred in this section.'}
        </p>
        <button
          onClick={() => this.handleReset()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }
}
