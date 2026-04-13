// src/app/api/phishing/track/route.js
// GET — tracks email opens via 1x1 pixel.
// Called when the email is opened by the recipient.
// No auth required — token is the identifier.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'

// 1x1 transparent GIF
const PIXEL = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
  'base64'
)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token     = searchParams.get('token')
  const eventType = searchParams.get('type') || 'opened'

  if (token) {
    try {
      // Find the target by token
      const { data: target } = await supabaseAdmin
        .from('phishing_targets')
        .select('id, result')
        .eq('tracking_token', token)
        .single()

      if (target) {
        const now = new Date().toISOString()

        // Only update if not already clicked (preserve first interaction)
        if (target.result === 'sent') {
          await supabaseAdmin
            .from('phishing_targets')
            .update({ result: 'opened', opened_at: now })
            .eq('id', target.id)
        }

        // Log the event
        await supabaseAdmin
          .from('phishing_click_events')
          .insert({
            target_id:  target.id,
            event_type: eventType,
            occurred_at: now,
          })
      }
    } catch (err) {
      // Silently fail — never break the email rendering
      console.error('Tracking pixel error:', err)
    }
  }

  // Always return the pixel regardless of errors
  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      'Content-Type':  'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma':        'no-cache',
    },
  })
}