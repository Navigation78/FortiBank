// src/app/api/certificates/route.js
// GET  - fetch current user's certificates
// POST - check eligibility and award certificate if qualified

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { generateCertificatePDF } from '@/lib/pdfGenerator'
import { uploadCertificate } from '@/lib/storage'
import { sendCertificateEmail } from '@/lib/email'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { createNotification, NOTIFICATION_TYPES } from '@/lib/notificationService'
import { withApiHandler } from '@/lib/apiHandler'

export const GET = withApiHandler(async (request) => {
  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data, error } = await supabase
    .from('certificates')
    .select(`*, roles ( display_name, category )`)
    .eq('user_id', user.id)
    .eq('is_revoked', false)
    .order('issued_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ certificates: data || [] })
})

export const POST = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data: profile } = await supabaseAdmin
    .from('users_with_roles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.role) {
    return NextResponse.json({ error: 'No role assigned' }, { status: 400 })
  }

  const { data: existing } = await supabaseAdmin
    .from('certificates')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_revoked', false)
    .single()

  if (existing) {
    return NextResponse.json({ message: 'Certificate already exists', alreadyAwarded: true })
  }

  const { data: assignedModules } = await supabaseAdmin
    .from('module_role_access')
    .select(`
      modules (
        id,
        quizzes ( id, pass_score )
      )
    `)
    .eq('role_id', profile.role_id || (
      await supabaseAdmin.from('roles').select('id').eq('name', profile.role).single()
    ).data?.id)

  if (!assignedModules || assignedModules.length === 0) {
    return NextResponse.json({ error: 'No modules assigned to this role' }, { status: 400 })
  }

  const moduleIds = assignedModules.map(m => m.modules?.id).filter(Boolean)

  const { data: progress } = await supabaseAdmin
    .from('user_module_progress')
    .select('module_id, status')
    .eq('user_id', user.id)
    .in('module_id', moduleIds)

  const completedModules = progress?.filter(p => p.status === 'completed') || []

  if (completedModules.length < moduleIds.length) {
    return NextResponse.json({
      eligible:  false,
      message:   `Complete all modules first. ${completedModules.length}/${moduleIds.length} done.`,
      completed: completedModules.length,
      total:     moduleIds.length,
    })
  }

  const quizIds = assignedModules
    .flatMap(m => m.modules?.quizzes || [])
    .map(q => q.id)
    .filter(Boolean)

  if (quizIds.length > 0) {
    const { data: bestScores } = await supabaseAdmin
      .from('user_quiz_best_scores')
      .select('quiz_id, passed')
      .eq('user_id', user.id)
      .in('quiz_id', quizIds)

    const passedQuizzes = bestScores?.filter(s => s.passed) || []

    if (passedQuizzes.length < quizIds.length) {
      return NextResponse.json({
        eligible:      false,
        message:       `Pass all quizzes first. ${passedQuizzes.length}/${quizIds.length} passed.`,
        passedQuizzes: passedQuizzes.length,
        totalQuizzes:  quizIds.length,
      })
    }
  }

  const { data: roleData } = await supabaseAdmin
    .from('roles')
    .select('id, display_name')
    .eq('name', profile.role)
    .single()

  const now       = new Date()
  const validUntil = new Date(now)
  validUntil.setFullYear(validUntil.getFullYear() + 1)

  const certNo = `CERT-${now.getFullYear()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  const pdfBytes = await generateCertificatePDF({
    recipientName: profile.full_name,
    roleName:      roleData.display_name,
    certificateNo: certNo,
    issuedAt:      now.toISOString(),
    validUntil:    validUntil.toISOString(),
  })

  const { url: pdfUrl } = await uploadCertificate({
    userId:        user.id,
    certificateNo: certNo,
    pdfBytes,
  })

  const { data: certificate, error: certError } = await supabaseAdmin
    .from('certificates')
    .insert({
      user_id:        user.id,
      role_id:        roleData.id,
      certificate_no: certNo,
      issued_at:      now.toISOString(),
      valid_until:    validUntil.toISOString(),
      pdf_url:        pdfUrl,
    })
    .select()
    .single()

  if (certError) {
    return NextResponse.json({ error: certError.message }, { status: 500 })
  }

  await sendCertificateEmail({
    to:            profile.email,
    recipientName: profile.full_name,
    roleName:      roleData.display_name,
    certificateNo: certNo,
    issuedAt:      now.toISOString(),
  })

  await createNotification({
    userId:  user.id,
    title:   'Certificate awarded!',
    message: `Congratulations! You have earned your ${roleData.display_name} training certificate (No. ${certNo}). Valid for one year.`,
    type:    NOTIFICATION_TYPES.CERTIFICATE,
    link:    '/certificates',
  })

  return NextResponse.json({ eligible: true, certificate, message: 'Certificate awarded successfully!' }, { status: 201 })
})
