// src/lib/email.js
// Resend email client with retry logic for transient failures.

import { Resend } from 'resend'
import { withRetry } from '@/lib/retry'
import { logger } from '@/lib/logger'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = `${process.env.RESEND_FROM_NAME || 'FortiBank Security'} <${process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'}>`

async function sendEmail(payload, label) {
  return withRetry(
    async () => {
      const { data, error } = await resend.emails.send(payload)
      if (error) {
        // Treat rate-limit and server errors as retryable by attaching a status
        const retryableStatuses = [429, 500, 502, 503, 504]
        const err = new Error(error.message || 'Resend API error')
        err.statusCode = retryableStatuses.includes(error.statusCode) ? error.statusCode : 400
        throw err
      }
      return data
    },
    { label, maxAttempts: 3, baseDelay: 500 }
  )
}

// ── Send a phishing simulation email ─────────────────────────
export async function sendPhishingEmail({
  to,
  recipientName,
  emailSubject,
  senderName,
  senderAddress,
  emailBodyHtml,
  trackingToken,
  appUrl,
}) {
  const baseUrl   = appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const clickUrl  = `${baseUrl}/phishing-click/${trackingToken}`
  const openPixel = `${baseUrl}/api/phishing/track?token=${trackingToken}&type=opened`

  let html = emailBodyHtml
    .replace(/\{\{name\}\}/g,          recipientName || 'Employee')
    .replace(/\{\{phishing_link\}\}/g, clickUrl)

  html += `<img src="${openPixel}" width="1" height="1" style="display:none" alt="" />`

  try {
    const data = await sendEmail(
      {
        from:    FROM,
        to,
        subject: emailSubject,
        html,
        headers: { 'X-Entity-Ref-ID': trackingToken },
      },
      `phishing-email to ${to}`
    )
    return { success: true, messageId: data?.id }
  } catch (err) {
    logger.error(err, { context: 'sendPhishingEmail', to, trackingToken })
    return { success: false, error: err.message }
  }
}

// ── Send a risk alert email to the employee ──────────────────
export async function sendRiskAlertEmail({
  to,
  recipientName,
  severity,
  score,
  roleName,
  appUrl,
}) {
  const baseUrl      = appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const dashboardUrl = `${baseUrl}/risk-score`
  const modulesUrl   = `${baseUrl}/modules`

  const isCritical = severity === 'critical'
  const color      = isCritical ? '#ef4444' : '#f97316'
  const label      = isCritical ? 'CRITICAL RISK ALERT' : 'HIGH RISK WARNING'

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#0f172a;font-family:system-ui,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;">
        <div style="background:${color}20;border-bottom:1px solid ${color}40;padding:24px;">
          <p style="margin:0;color:${color};font-size:12px;font-weight:600;letter-spacing:1px;">${label}</p>
          <h1 style="margin:8px 0 0;color:#f1f5f9;font-size:20px;">Your cybersecurity risk score needs attention</h1>
        </div>
        <div style="padding:24px;">
          <p style="color:#94a3b8;margin:0 0 16px;">Dear ${recipientName},</p>
          <p style="color:#94a3b8;margin:0 0 24px;">
            Your FortiBank cybersecurity risk score has reached <strong style="color:#f1f5f9;">${score}/100</strong>,
            which has triggered a ${severity} threshold alert for your role as <strong style="color:#f1f5f9;">${roleName}</strong>.
          </p>
          <div style="background:#0f172a;border:1px solid ${color}40;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px;">
            <p style="margin:0;color:#64748b;font-size:12px;">Current Risk Score</p>
            <p style="margin:8px 0 0;color:${color};font-size:40px;font-weight:700;">${score}</p>
            <p style="margin:4px 0 0;color:${color};font-size:14px;font-weight:600;">${isCritical ? 'Critical Risk' : 'High Risk'}</p>
          </div>
          <p style="color:#94a3b8;margin:0 0 8px;font-weight:600;font-size:14px;">What you should do:</p>
          <ul style="color:#94a3b8;margin:0 0 24px;padding-left:20px;line-height:1.8;">
            <li>Complete all outstanding training modules</li>
            <li>Retake any quizzes you did not pass</li>
            <li>Be extra vigilant about phishing emails</li>
            <li>Report any suspicious emails immediately</li>
          </ul>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <a href="${modulesUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;">Start Training Now</a>
            <a href="${dashboardUrl}" style="display:inline-block;background:#1e293b;border:1px solid #334155;color:#94a3b8;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;">View Risk Details</a>
          </div>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #334155;">
          <p style="margin:0;color:#475569;font-size:12px;">This is an automated security alert from the FortiBank Cybersecurity Training Platform. Do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const data = await sendEmail(
      {
        from:    FROM,
        to,
        subject: `${isCritical ? '[CRITICAL]' : '[WARNING]'} ${label} - Your risk score is ${score}/100`,
        html,
      },
      `risk-alert-email to ${to}`
    )
    return { success: true, messageId: data?.id }
  } catch (err) {
    logger.error(err, { context: 'sendRiskAlertEmail', to, severity, score })
    return { success: false, error: err.message }
  }
}

// ── Send a certificate issued email ──────────────────────────
export async function sendCertificateEmail({
  to,
  recipientName,
  roleName,
  certificateNo,
  issuedAt,
  appUrl,
}) {
  const baseUrl = appUrl || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const certUrl = `${baseUrl}/certificates`

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#0f172a;font-family:system-ui,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155;">
        <div style="background:#16a34a20;border-bottom:1px solid #16a34a40;padding:24px;">
          <p style="margin:0;color:#4ade80;font-size:12px;font-weight:600;letter-spacing:1px;">CERTIFICATE AWARDED</p>
          <h1 style="margin:8px 0 0;color:#f1f5f9;font-size:20px;">Congratulations on completing your training!</h1>
        </div>
        <div style="padding:24px;">
          <p style="color:#94a3b8;margin:0 0 16px;">Dear ${recipientName},</p>
          <p style="color:#94a3b8;margin:0 0 24px;">
            You have successfully completed all cybersecurity training modules for your role as
            <strong style="color:#f1f5f9;">${roleName}</strong>. Your certificate has been issued.
          </p>
          <div style="background:#0f172a;border:1px solid #16a34a40;border-radius:8px;padding:20px;margin-bottom:24px;">
            <p style="margin:0;color:#64748b;font-size:12px;">Certificate Number</p>
            <p style="margin:8px 0 0;color:#4ade80;font-size:18px;font-weight:700;font-family:monospace;">${certificateNo}</p>
            <p style="margin:8px 0 0;color:#64748b;font-size:12px;">Issued: ${new Date(issuedAt).toLocaleDateString('en-KE', { dateStyle: 'long' })}</p>
          </div>
          <a href="${certUrl}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;">View My Certificate</a>
        </div>
        <div style="padding:16px 24px;border-top:1px solid #334155;">
          <p style="margin:0;color:#475569;font-size:12px;">FortiBank Cybersecurity Training Platform</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    const data = await sendEmail(
      {
        from:    FROM,
        to,
        subject: `Certificate Awarded - ${roleName} Cybersecurity Training`,
        html,
      },
      `certificate-email to ${to}`
    )
    return { success: true, messageId: data?.id }
  } catch (err) {
    logger.error(err, { context: 'sendCertificateEmail', to, certificateNo })
    return { success: false, error: err.message }
  }
}
