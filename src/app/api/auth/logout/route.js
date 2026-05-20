// src/app/api/auth/logout/route.js
// POST - clears Supabase auth cookies accumulated over multiple sessions.

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()

  const response = NextResponse.json({ success: true })

  for (const cookie of allCookies) {
    if (cookie.name.startsWith('sb-')) {
      response.cookies.set(cookie.name, '', {
        maxAge: 0,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      })
    }
  }

  return response
}
