// ============================================================
// middleware.js
// Runs on every request BEFORE the page renders.
// Handles: auth protection, role-based access, redirects.
// ============================================================

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { canAccessPath, getDashboardUrl } from '@/utils/roleRedirect'

// Routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/forgot-password',
  '/reset-password',
  '/unauthorized',
]

const PASSWORD_CHANGE_ROUTE = '/change-password'

// Routes that are always public regardless (phishing click tracking)
const ALWAYS_PUBLIC = [
  '/phishing-click',
]

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Always allow public routes
  if (ALWAYS_PUBLIC.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Create a response to potentially modify cookies
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Create Supabase server client (reads cookies for session)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Get current session
  const { data: { user } } = await supabase.auth.getUser()

  // ── Not logged in ─────────────────────────────────────────
  if (!user) {
    // Allow public routes through
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      return response
    }

    // Redirect to login for any protected route
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Logged in ─────────────────────────────────────────────

  const mustChangePassword = user.user_metadata?.must_change_password === true

  if (mustChangePassword && pathname !== PASSWORD_CHANGE_ROUTE) {
    return NextResponse.redirect(new URL(PASSWORD_CHANGE_ROUTE, request.url))
  }

  // Redirect away from auth pages if already logged in
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    if (mustChangePassword) {
      return NextResponse.redirect(new URL(PASSWORD_CHANGE_ROUTE, request.url))
    }

    // Fetch role to redirect to correct dashboard
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)
      .single()

    const role = userRole?.roles?.name
    return NextResponse.redirect(new URL(getDashboardUrl(role), request.url))
  }

  if (pathname === PASSWORD_CHANGE_ROUTE && !mustChangePassword) {
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)
      .single()

    const role = userRole?.roles?.name
    return NextResponse.redirect(new URL(getDashboardUrl(role), request.url))
  }

  // Fetch the user's role for access control
  if (pathname === PASSWORD_CHANGE_ROUTE) {
    return response
  }

  const { data: userRole } = await supabase
    .from('user_roles')
    .select('roles(name)')
    .eq('user_id', user.id)
    .single()

  const role = userRole?.roles?.name

  // If user has no role assigned yet, send to unauthorized
  if (!role) {
    if (pathname === '/unauthorized') return response
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Check if the user's role can access this path
  if (!canAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all routes EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files (images, logo etc.)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
