// src/components/phishing/CampaignCard.jsx
// Shows a single phishing test result for the employee

import { AlertTriangle, Check, Lightbulb } from 'lucide-react'
import Link from 'next/link'

const RESULT_CONFIG = {
  not_sent: { label: 'Pending',   color: 'text-th-txt2',                              bg: 'bg-th-hov',         border: 'border-th-brd'        },
  sent:     { label: 'Received',  color: 'text-blue-600 dark:text-blue-400',          bg: 'bg-blue-500/10',    border: 'border-blue-500/20'   },
  opened:   { label: 'Opened',    color: 'text-yellow-600 dark:text-yellow-400',      bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20' },
  clicked:  { label: 'Clicked',   color: 'text-red-600 dark:text-red-400',            bg: 'bg-red-500/10',     border: 'border-red-500/20',   icon: AlertTriangle },
  reported: { label: 'Reported',  color: 'text-green-600 dark:text-green-400',        bg: 'bg-green-500/10',   border: 'border-green-500/20', icon: Check },
}

export default function CampaignCard({ target }) {
  const campaign = target.phishing_campaigns
  const config   = RESULT_CONFIG[target.result] || RESULT_CONFIG.not_sent

  function formatDate(dateStr) {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('en-KE', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className={`bg-th-srf border rounded-xl p-5 ${
      target.result === 'clicked'
        ? 'border-red-500/30'
        : target.result === 'reported'
          ? 'border-green-500/30'
          : 'border-th-brd'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-th-txt font-medium text-sm truncate">
            {campaign?.name || 'Phishing Simulation'}
          </p>
          <p className="text-th-muted text-xs mt-0.5">
            Sent: {formatDate(target.sent_at)}
          </p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border flex-shrink-0 ${config.bg} ${config.border} ${config.color} flex items-center gap-1`}>
          {config.icon && <config.icon className="w-3 h-3" />}
          {config.label}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-1.5 text-xs text-th-muted">
        {target.opened_at && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">·</span>
            Opened at {new Date(target.opened_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} on {formatDate(target.opened_at)}
          </div>
        )}
        {target.clicked_at && (
          <div className="flex items-center gap-2">
            <span className="text-red-500">·</span>
            Link clicked at {new Date(target.clicked_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
        {target.reported_at && (
          <div className="flex items-center gap-2">
            <span className="text-green-500">·</span>
            Reported at {new Date(target.reported_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {/* Tip for clicked */}
      {target.result === 'clicked' && (
        <div className="mt-3 pt-3 border-t border-th-brd">
          <p className="text-th-muted text-xs">
            <Lightbulb className="w-3 h-3 inline mr-1" />
            Always hover over links before clicking and verify the sender domain carefully.
          </p>
        </div>
      )}

      {/* Praise for reported */}
      {target.result === 'reported' && (
        <div className="mt-3 pt-3 border-t border-th-brd">
          <p className="text-green-600 dark:text-green-400 text-xs">
            <Check className="w-3 h-3 inline mr-1" />
            Great job identifying and reporting this phishing attempt!
          </p>
        </div>
      )}
    </div>
  )
}
