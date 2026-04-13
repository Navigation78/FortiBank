
// src/app/api/phishing/send/route.js
// POST — sends phishing simulation emails to targeted employees.
// Admin only. Uses Resend via email.js.

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { sendPhishingEmail } from '@/lib/email'

export async function POST(request) {
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

  // Verify admin
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: adminCheck } = await supabaseAdmin
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single()

  if (adminCheck?.roles?.name !== 'system_admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await request.json()
  const { campaignId } = body

  if (!campaignId) {
    return NextResponse.json({ error: 'campaignId is required' }, { status: 400 })
  }

  // Fetch campaign details
  const { data: campaign, error: campaignError } = await supabaseAdmin
    .from('phishing_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()

  if (campaignError || !campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
    return NextResponse.json({ error: 'Campaign has already been sent' }, { status: 400 })
  }

  // Get target users based on role_ids
  let usersQuery = supabaseAdmin
    .from('users_with_roles')
    .select('id, email, full_name, role')
    .eq('is_active', true)

  if (campaign.target_role_ids && campaign.target_role_ids.length > 0) {
    const { data: targetRoles } = await supabaseAdmin
      .from('roles')
      .select('name')
      .in('id', campaign.target_role_ids)

    const roleNames = targetRoles?.map(r => r.name) || []
    if (roleNames.length > 0) {
      usersQuery = usersQuery.in('role', roleNames)
    }
  }

  const { data: targetUsers, error: usersError } = await usersQuery

  if (usersError || !targetUsers || targetUsers.length === 0) {
    return NextResponse.json({ error: 'No target users found' }, { status: 400 })
  }

  // Create phishing_targets records
  const targets = targetUsers.map(u => ({
    campaign_id: campaignId,
    user_id:     u.id,
    result:      'not_sent',
  }))

  const { data: insertedTargets, error: insertError } = await supabaseAdmin
    .from('phishing_targets')
    .insert(targets)
    .select()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Update campaign status to active
  await supabaseAdmin
    .from('phishing_campaigns')
    .update({ status: 'active', started_at: new Date().toISOString() })
    .eq('id', campaignId)

  // Send emails
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const results = { sent: 0, failed: 0, errors: [] }

  for (const target of insertedTargets) {
    const targetUser = targetUsers.find(u => u.id === target.user_id)
    if (!targetUser) continue

    const emailResult = await sendPhishingEmail({
      to:             targetUser.email,
      recipientName:  targetUser.full_name,
      emailSubject:   campaign.email_subject,
      senderName:     campaign.email_sender_name,
      senderAddress:  campaign.email_sender_addr,
      emailBodyHtml:  campaign.email_body_html,
      trackingToken:  target.tracking_token,
      appUrl,
    })

    if (emailResult.success) {
      // Mark as sent
      await supabaseAdmin
        .from('phishing_targets')
        .update({ result: 'sent', sent_at: new Date().toISOString() })
        .eq('id', target.id)
      results.sent++
    } else {
      results.failed++
      results.errors.push({ userId: target.user_id, error: emailResult.error })
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return NextResponse.json({
    message: `Campaign sent. ${results.sent} emails delivered, ${results.failed} failed.`,
    ...results,
  })
}