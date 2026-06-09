'use client'

import Link from 'next/link'
import { AlertTriangle, AlertOctagon } from 'lucide-react'

export default function AlertBanner({ severity, riskScore }) {
  const isCritical = severity === 'critical'

  const styles = isCritical
    ? {
        wrapper: 'bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30',
        icon:    'text-red-500 dark:text-red-400',
        title:   'text-red-700 dark:text-red-400',
        body:    'text-red-600 dark:text-red-300',
        link:    'text-red-700 dark:text-red-300 underline hover:text-red-900 dark:hover:text-red-100',
        badge:   'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
      }
    : {
        wrapper: 'bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30',
        icon:    'text-orange-500 dark:text-orange-400',
        title:   'text-orange-700 dark:text-orange-400',
        body:    'text-orange-600 dark:text-orange-300',
        link:    'text-orange-700 dark:text-orange-300 underline hover:text-orange-900 dark:hover:text-orange-100',
        badge:   'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300',
      }

  const Icon = isCritical ? AlertOctagon : AlertTriangle

  return (
    <div className={`rounded-xl px-4 py-3 mb-6 flex items-center gap-3 ${styles.wrapper}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${styles.icon}`} />

      <div className="flex-1 min-w-0">
        <span className={`font-semibold text-sm ${styles.title}`}>
          {isCritical ? 'Critical Risk Alert' : 'High Risk Warning'}
        </span>
        <span className={`text-sm ml-2 ${styles.body}`}>
          Your risk score of{' '}
          <span className={`font-bold px-1.5 py-0.5 rounded ${styles.badge}`}>{riskScore}</span>
          {' '}requires immediate attention.{' '}
          <Link href="/risk-score" className={`text-sm font-medium ${styles.link}`}>
            View details →
          </Link>
        </span>
      </div>
    </div>
  )
}
