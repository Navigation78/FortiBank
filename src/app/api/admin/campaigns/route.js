// src/app/api/admin/campaigns/route.js
// GET  - all campaigns with stats
// POST - create new phishing campaign

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError } from '@/lib/errors'

async function verifyAdmin(request) {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return networkError ? unauthorizedResponse(true) : null
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') return null
  return user
}

export const GET = withApiHandler(async (request) => {
  const admin = await verifyAdmin(request)
  if (admin instanceof Response) return admin
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('campaign_stats')
    .select('*')
    .order('campaign_id', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaigns: data })
})

export const POST = withApiHandler(async (request) => {
  const admin = await verifyAdmin(request)
  if (admin instanceof Response) return admin
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    name, description, email_subject, email_sender_name,
    email_sender_addr, email_body_html, role_ids,
  } = body

  if (!name || !email_subject || !email_body_html) {
    throw new ValidationError('name, email_subject and email_body_html are required', {
      fields: ['name', 'email_subject', 'email_body_html'],
    })
  }

  const targetRoleIds = (role_ids && role_ids.length > 0) ? role_ids : null

  const { data: campaign, error } = await supabaseAdmin
    .from('phishing_campaigns')
    .insert({
      name,
      description,
      email_subject,
      email_sender_name: email_sender_name || 'IT Helpdesk',
      email_sender_addr: email_sender_addr || 'helpdesk@fortibank-it.com',
      email_body_html,
      target_role_ids:   targetRoleIds,
      status:            'draft',
      created_by:        admin.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaign }, { status: 201 })
})
