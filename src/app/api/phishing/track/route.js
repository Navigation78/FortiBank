// src/app/api/phishing/track/route.js
// GET - tracks email opens via 1x1 pixel.
// No auth required - token is the identifier.
// Always returns the pixel — never breaks email rendering.

import { NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'
import { logger } from '@/lib/logger'

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
      const { data: target } = await supabaseAdmin
        .from('phishing_targets')
        .select('id, result')
        .eq('tracking_token', token)
        .single()

      if (target) {
        const now = new Date().toISOString()

        if (target.result === 'sent') {
          await supabaseAdmin
            .from('phishing_targets')
            .update({ result: 'opened', opened_at: now })
            .eq('id', target.id)
        }

        await supabaseAdmin
          .from('phishing_click_events')
          .insert({ target_id: target.id, event_type: eventType, occurred_at: now })
      }
    } catch (err) {
      // Never break email rendering — log silently
      logger.error(err, { context: 'phishing/track', token })
    }
  }

  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      'Content-Type':  'image/gif',
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma':        'no-cache',
    },
  })
}
