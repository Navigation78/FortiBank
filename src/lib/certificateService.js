// src/lib/certificateService.js
// Awards a module certificate when the user passes the final exam.
// Called from the quiz submit route (auto) and certificates API (manual check).

import supabaseAdmin from '@/lib/supabaseAdmin'
import { generateCertificatePDF } from '@/lib/pdfGenerator'
import { uploadCertificate } from '@/lib/storage'
import { sendCertificateEmail } from '@/lib/email'
import { createNotification, NOTIFICATION_TYPES } from '@/lib/notificationService'

/**
 * Awards a module certificate to a user if they have passed the final exam
 * and do not already hold a certificate for this module.
 *
 * Returns { awarded, certificate?, reason? }
 */
export async function awardModuleCertificate(userId, moduleId) {
  // Already awarded?
  const { data: existing } = await supabaseAdmin
    .from('certificates')
    .select('id')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .eq('is_revoked', false)
    .maybeSingle()

  if (existing) {
    return { awarded: false, reason: 'already_awarded' }
  }

  // Final exam quiz for this module
  const { data: examQuiz } = await supabaseAdmin
    .from('quizzes')
    .select('id')
    .eq('module_id', moduleId)
    .eq('quiz_type', 'final_exam')
    .maybeSingle()

  if (!examQuiz) {
    return { awarded: false, reason: 'no_final_exam' }
  }

  // Did the user pass it?
  const { data: best } = await supabaseAdmin
    .from('user_quiz_best_scores')
    .select('passed')
    .eq('user_id', userId)
    .eq('quiz_id', examQuiz.id)
    .maybeSingle()

  if (!best?.passed) {
    return { awarded: false, reason: 'exam_not_passed' }
  }

  // Module info
  const { data: module } = await supabaseAdmin
    .from('modules')
    .select('id, title')
    .eq('id', moduleId)
    .single()

  if (!module) {
    return { awarded: false, reason: 'module_not_found' }
  }

  // User profile
  const { data: profile } = await supabaseAdmin
    .from('users_with_roles')
    .select('full_name, email')
    .eq('id', userId)
    .single()

  if (!profile) {
    return { awarded: false, reason: 'user_not_found' }
  }

  const now        = new Date()
  const validUntil = new Date(now)
  validUntil.setFullYear(validUntil.getFullYear() + 1)

  const certNo = `CERT-${now.getFullYear()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  const pdfBytes = await generateCertificatePDF({
    recipientName: profile.full_name,
    moduleName:    module.title,
    certificateNo: certNo,
    issuedAt:      now.toISOString(),
    validUntil:    validUntil.toISOString(),
  })

  const { url: pdfUrl } = await uploadCertificate({
    userId,
    certificateNo: certNo,
    pdfBytes,
  })

  const { data: certificate, error: certError } = await supabaseAdmin
    .from('certificates')
    .insert({
      user_id:        userId,
      module_id:      moduleId,
      certificate_no: certNo,
      issued_at:      now.toISOString(),
      valid_until:    validUntil.toISOString(),
      pdf_url:        pdfUrl,
    })
    .select()
    .single()

  if (certError) {
    throw new Error(certError.message)
  }

  // Non-blocking side effects
  sendCertificateEmail({
    to:            profile.email,
    recipientName: profile.full_name,
    moduleName:    module.title,
    certificateNo: certNo,
    issuedAt:      now.toISOString(),
  }).catch(() => {})

  await createNotification({
    userId,
    title:   'Certificate awarded!',
    message: `Congratulations! You have earned your certificate for "${module.title}" (No. ${certNo}).`,
    type:    NOTIFICATION_TYPES.CERTIFICATE,
    link:    '/certificates',
  })

  return { awarded: true, certificate }
}
