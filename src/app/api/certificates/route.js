// src/app/api/certificates/route.js
// GET  - fetch the authenticated user's certificates (one per module)
// POST - check all accessible modules and award any pending certificates

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { awardModuleCertificate } from '@/lib/certificateService'
import { withApiHandler } from '@/lib/apiHandler'

export const GET = withApiHandler(async (request) => {
  const { user, supabase, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data, error } = await supabase
    .from('certificates')
    .select(`*, modules ( id, title )`)
    .eq('user_id', user.id)
    .eq('is_revoked', false)
    .order('issued_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ certificates: data || [] })
})

export const POST = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  // Determine which modules the user can access via their role
  const { data: profile } = await supabaseAdmin
    .from('users_with_roles')
    .select('role_id')
    .eq('id', user.id)
    .single()

  let moduleIds = []

  if (profile?.role_id) {
    const { data: access } = await supabaseAdmin
      .from('module_role_access')
      .select('module_id')
      .eq('role_id', profile.role_id)

    moduleIds = (access || []).map(r => r.module_id)
  }

  if (moduleIds.length === 0) {
    return NextResponse.json({ awarded: [], message: 'No modules assigned to your role.' })
  }

  // Try to award a certificate for each module
  const results = await Promise.allSettled(
    moduleIds.map(mid => awardModuleCertificate(user.id, mid))
  )

  const awarded = results
    .filter(r => r.status === 'fulfilled' && r.value.awarded)
    .map(r => r.value.certificate)

  return NextResponse.json({
    awarded,
    message: awarded.length > 0
      ? `${awarded.length} certificate${awarded.length > 1 ? 's' : ''} awarded!`
      : 'No new certificates at this time.',
  }, { status: awarded.length > 0 ? 201 : 200 })
})
