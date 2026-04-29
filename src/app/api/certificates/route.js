// src/app/api/certificates/route.js
// GET  — fetch current user's certificates
// POST — check eligibility and award certificate if qualified


import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { generateCertificatePDF } from '@/lib/pdfGenerator'
import { uploadCertificate } from '@/lib/storage'
import { sendCertificateEmail } from '@/lib/email'

export async function GET() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('certificates')
    .select(`*, roles ( display_name, category )`)
    .eq('user_id', user.id)
    .eq('is_revoked', false)
    .order('issued_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ certificates: data || [] })
}

export async function POST() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get user profile and role
  const { data: profile } = await supabaseAdmin
    .from('users_with_roles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile?.role) {
    return NextResponse.json({ error: 'No role assigned' }, { status: 400 })
  }

  // Check if certificate already exists
  const { data: existing } = await supabaseAdmin
    .from('certificates')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_revoked', false)
    .single()

  if (existing) {
    return NextResponse.json({ message: 'Certificate already exists', alreadyAwarded: true })
  }

  // Get all modules assigned to this role
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

  // Check all modules are completed
  const moduleIds = assignedModules.map(m => m.modules?.id).filter(Boolean)

  const { data: progress } = await supabaseAdmin
    .from('user_module_progress')
    .select('module_id, status')
    .eq('user_id', user.id)
    .in('module_id', moduleIds)

  const completedModules = progress?.filter(p => p.status === 'completed') || []

  if (completedModules.length < moduleIds.length) {
    return NextResponse.json({
      eligible: false,
      message: `Complete all modules first. ${completedModules.length}/${moduleIds.length} done.`,
      completed: completedModules.length,
      total: moduleIds.length,
    })
  }

  // Check all quizzes are passed
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
        eligible: false,
        message: `Pass all quizzes first. ${passedQuizzes.length}/${quizIds.length} passed.`,
        passedQuizzes: passedQuizzes.length,
        totalQuizzes: quizIds.length,
      })
    }
  }

  // ✅ User is eligible — generate certificate
  const { data: roleData } = await supabaseAdmin
    .from('roles')
    .select('id, display_name')
    .eq('name', profile.role)
    .single()

  const now       = new Date()
  const validUntil = new Date(now)
  validUntil.setFullYear(validUntil.getFullYear() + 1)

  // Generate certificate number
  const certNo = `CERT-${now.getFullYear()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

  // Generate PDF
  const pdfBytes = await generateCertificatePDF({
    recipientName: profile.full_name,
    roleName:      roleData.display_name,
    certificateNo: certNo,
    issuedAt:      now.toISOString(),
    validUntil:    validUntil.toISOString(),
  })

  // Upload to Supabase Storage
  const { url: pdfUrl } = await uploadCertificate({
    userId:         user.id,
    certificateNo:  certNo,
    pdfBytes,
  })

  // Save certificate record
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

  // Send congratulations email
  await sendCertificateEmail({
    to:            profile.email,
    recipientName: profile.full_name,
    roleName:      roleData.display_name,
    certificateNo: certNo,
    issuedAt:      now.toISOString(),
  })

  return NextResponse.json({
    eligible:    true,
    certificate,
    message:     'Certificate awarded successfully!',
  }, { status: 201 })
}