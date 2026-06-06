// src/app/api/admin/campaigns/[campaignId]/resend/route.js
// POST - Resends phishing emails to targets that still have result = 'not_sent'

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { sendPhishingEmail } from '@/lib/email'
import { getRouteUser, unauthorizedResponse } from '@/lib/supabaseRoute'
import { withApiHandler } from '@/lib/apiHandler'

const isDev = process.env.NODE_ENV === 'development'

async function verifyAdmin(request) {
  const { user, networkError } = await getRouteUser(request)
  if (!user) return networkError ? unauthorizedResponse(true) : null
  const { data: roleData } = await supabaseAdmin
    .from('user_roles').select('roles(name)').eq('user_id', user.id).single()
  if (roleData?.roles?.name !== 'system_admin') return null
  return user
}

export const POST = withApiHandler(async (request, { params }) => {
  const admin = await verifyAdmin(request)
  if (admin instanceof Response) return admin
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { campaignId } = await params

  const { data: campaign, error: campaignError } = await supabaseAdmin
    .from('phishing_campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()

  if (campaignError || !campaign) {
    return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
  }

  const { data: pendingTargets, error: targetsError } = await supabaseAdmin
    .from('phishing_targets')
    .select('*, users(email, full_name)')
    .eq('campaign_id', campaignId)
    .eq('result', 'not_sent')

  if (targetsError) {
    return NextResponse.json({ error: targetsError.message }, { status: 500 })
  }

  if (!pendingTargets || pendingTargets.length === 0) {
    return NextResponse.json({
      message: 'All targets have already received the email. No resend needed.',
      sent:    0,
      failed:  0,
    })
  }

  const appUrl   = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const devEmail = process.env.DEV_TEST_EMAIL
  const results  = { sent: 0, failed: 0 }

  for (const target of pendingTargets) {
    if (!target.users) continue

    const deliveryEmail = isDev ? devEmail : target.users.email
    const subjectPrefix = isDev ? `[DEV → ${target.users.full_name}] ` : ''

    const emailResult = await sendPhishingEmail({
      to:            deliveryEmail,
      recipientName: target.users.full_name,
      emailSubject:  subjectPrefix + campaign.email_subject,
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
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }

  const devNote = isDev
    ? `DEV MODE — all ${results.sent} emails delivered to ${devEmail}. Subject line shows real recipient name.`
    : null

  return NextResponse.json({
    message: `Resend complete. ${results.sent} delivered, ${results.failed} failed.`,
    ...(devNote && { devNote }),
    ...results,
  })
})
