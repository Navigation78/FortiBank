// src/app/api/admin/campaigns/route.js
// GET  — all campaigns with stats
// POST — create new phishing campaign

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'

async function verifyAdmin(cookieStore) {
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
  if (!user) return null
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') return null
  return user
}

export async function GET() {
  const cookieStore = await cookies()
  const admin = await verifyAdmin(cookieStore)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('campaign_stats')
    .select('*')
    .order('campaign_id', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaigns: data })
}

export async function POST(request) {
  const cookieStore = await cookies()
  const admin = await verifyAdmin(cookieStore)
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const {
    name, description, email_subject, email_sender_name,
    email_sender_addr, email_body_html, role_ids,
  } = body

  if (!name || !email_subject || !email_body_html) {
    return NextResponse.json({ error: 'name, email_subject and email_body_html are required' }, { status: 400 })
  }

  // Get role IDs from names if provided
  let targetRoleIds = null
  if (role_ids && role_ids.length > 0) {
    targetRoleIds = role_ids
  }

  const { data: campaign, error } = await supabaseAdmin
    .from('phishing_campaigns')
    .insert({
      name,
      description,
      email_subject,
      email_sender_name: email_sender_name || 'IT Helpdesk',
      email_sender_addr: email_sender_addr || 'helpdesk@fortibank-it.com',
      email_body_html,
      target_role_ids: targetRoleIds,
      status:          'draft',
      created_by:      admin.id,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ campaign }, { status: 201 })
}