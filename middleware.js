import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()

  // Purge accumulated sb-* Supabase auth-token cookie chunks.
  // These were written by @supabase/ssr in older sessions and caused
  // 494 REQUEST_HEADER_TOO_LARGE errors on Vercel once they grew large enough.
  // Setting Max-Age=0 in the response tells the browser to delete each one.
  try {
    for (const cookie of request.cookies.getAll()) {
      if (cookie.name.startsWith('sb-') && cookie.name.includes('-auth-token')) {
        response.cookies.set({
          name:    cookie.name,
          value:   '',
          maxAge:  0,
          path:    '/',
        })
      }
    }
  } catch {
    // Non-fatal.
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
