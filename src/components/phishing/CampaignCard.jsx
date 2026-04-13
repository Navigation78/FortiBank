// src/components/phishing/CampaignCard.jsx
// Shows a single phishing test result for the employee


import Link from 'next/link'

const RESULT_CONFIG = {
  not_sent: { label: 'Pending',   color: 'text-slate-400',  bg: 'bg-slate-700/50',   border: 'border-slate-600/30'  },
  sent:     { label: 'Received',  color: 'text-blue-400',   bg: 'bg-blue-500/10',    border: 'border-blue-500/20'   },
  opened:   { label: 'Opened',    color: 'text-yellow-400', bg: 'bg-yellow-500/10',  border: 'border-yellow-500/20' },
  clicked:  { label: 'Clicked ⚠️', color: 'text-red-400',  bg: 'bg-red-500/10',     border: 'border-red-500/20'    },
  reported: { label: 'Reported ✓', color: 'text-green-400', bg: 'bg-green-500/10',   border: 'border-green-500/20'  },
}

export default function CampaignCard({ target }) {
  const campaign = target.phishing_campaigns
  const config   = RESULT_CONFIG[target.result] || RESULT_CONFIG.not_sent

  function formatDate(dateStr) {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-KE', {
      day: 'numeric', month: 'short', year: 'numeric'
    })
  }

  return (
    <div className={`bg-slate-900 border rounded-xl p-5 ${
      target.result === 'clicked'
        ? 'border-red-500/30'
        : target.result === 'reported'
          ? 'border-green-500/30'
          : 'border-slate-800'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">
            {campaign?.name || 'Phishing Simulation'}
          </p>
          <p className="text-slate-500 text-xs mt-0.5">
            Sent: {formatDate(target.sent_at)}
          </p>
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border flex-shrink-0 ${config.bg} ${config.border} ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* Timeline */}
      <div className="space-y-1.5 text-xs text-slate-500">
        {target.opened_at && (
          <div className="flex items-center gap-2">
            <span className="text-yellow-400">·</span>
            Opened at {new Date(target.opened_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} on {formatDate(target.opened_at)}
          </div>
        )}
        {target.clicked_at && (
          <div className="flex items-center gap-2">
            <span className="text-red-400">·</span>
            Link clicked at {new Date(target.clicked_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
        {target.reported_at && (
          <div className="flex items-center gap-2">
            <span className="text-green-400">·</span>
            Reported at {new Date(target.reported_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>

      {/* Tip for clicked */}
      {target.result === 'clicked' && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <p className="text-slate-500 text-xs">
            💡 Always hover over links before clicking and verify the sender domain carefully.
          </p>
        </div>
      )}

      {/* Praise for reported */}
      {target.result === 'reported' && (
        <div className="mt-3 pt-3 border-t border-slate-800">
          <p className="text-green-400 text-xs">
            ✓ Great job identifying and reporting this phishing attempt!
          </p>
        </div>
      )}
    </div>
  )
}