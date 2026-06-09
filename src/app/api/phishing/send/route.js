// src/app/api/phishing/send/route.js
// POST - sends phishing simulation emails to targeted employees. Admin only.

// Extend the Vercel function timeout to 60 s to handle large campaigns without being cut off.
export const maxDuration = 60

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { sendPhishingEmail } from '@/lib/email'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'
import { ValidationError, ForbiddenError } from '@/lib/errors'

export const POST = withApiHandler(async (request) => {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return unauthorizedResponse(networkError)

  const { data: adminCheck } = await supabaseAdmin
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single()

  if (adminCheck?.roles?.name !== 'system_admin') {
    throw new ForbiddenError('Admin access required')
  }

  if (!process.env.DEV_TEST_EMAIL) {
    return NextResponse.json(
      { error: 'DEV_TEST_EMAIL is not set — add it to .env.local (local) or Vercel environment variables (production) to receive phishing test emails.' },
      { status: 500 }
    )
  }

  const body = await request.json()
  const { campaignId } = body

  if (!campaignId) {
    throw new ValidationError('campaignId is required', { field: 'campaignId' })
  }

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

  await supabaseAdmin
    .from('phishing_campaigns')
    .update({ status: 'active', started_at: new Date().toISOString() })
    .eq('id', campaignId)

  const appUrl       = process.env.NEXT_PUBLIC_APP_URL || 'https://forti-bank.vercel.app'
  const results      = { sent: 0, failed: 0, errors: [] }
  const testEmail    = process.env.DEV_TEST_EMAIL

  for (const target of insertedTargets) {
    const targetUser = targetUsers.find(u => u.id === target.user_id)
    if (!targetUser) continue

    const emailResult = await sendPhishingEmail({
      to:            testEmail,
      recipientName: targetUser.full_name,
      emailSubject:  `[→ ${targetUser.full_name}] ` + campaign.email_subject,
      senderName:    campaign.email_sender_name,
      senderAddress: campaign.email_sender_addr,
      emailBodyHtml: campaign.email_body_html,
      trackingToken: target.tracking_token,
      appUrl,
    })

    if (emailResult.success) {
      await supabaseAdmin
        .from('phishing_targets')
        .update({ result: 'sent', sent_at: new Date().toISOString() })
        .eq('id', target.id)
      results.sent++
    } else {
      results.failed++
      results.errors.push({
        userId:   target.user_id,
        employee: targetUser.full_name,
        email:    targetUser.email,
        error:    emailResult.error,
      })
    }

    await new Promise(resolve => setTimeout(resolve, 50))
  }

  return NextResponse.json({
    message: `Campaign sent. ${results.sent} emails delivered to ${testEmail}, ${results.failed} failed.`,
    ...results,
  })
})
