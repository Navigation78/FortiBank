// src/lib/csvDownload.js
// Utility for exporting data as CSV files

function escapeCell(value) {
  const s = String(value ?? '')
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}

export function downloadCSV(filename, headers, rows) {
  const lines = [
    headers.map(escapeCell).join(','),
    ...rows.map(row => row.map(escapeCell).join(',')),
  ]
  const blob = new Blob([lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function formatTimestamp(date) {
  return date.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function csvFilename(label, date) {
  const d = date.toISOString().slice(0, 10)
  return `${label}-${d}.csv`
}
