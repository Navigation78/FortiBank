import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import { canAccessPath, getDashboardUrl } from '@/utils/roleRedirect'

const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password', '/unauthorized']
const ALWAYS_PUBLIC = ['/phishing-click']
const PASSWORD_CHANGE_ROUTE = '/change-password'

export async function middleware(request) {
  const { pathname } = request.nextUrl

  if (ALWAYS_PUBLIC.some(route => pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // ✅ Fix #7 — response declared once, never reassigned inside setAll
  let response = NextResponse.next({ request })

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
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // ── Not logged in ──────────────────────────────────────────
  if (!user) {
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
      return response
    }
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // ── Logged in ──────────────────────────────────────────────
  const mustChangePassword = user.user_metadata?.must_change_password === true

  // Force password change before anything else
  if (mustChangePassword && pathname !== PASSWORD_CHANGE_ROUTE) {
    return NextResponse.redirect(new URL(PASSWORD_CHANGE_ROUTE, request.url))
  }

  // ✅ Fix #8 — fetch role once
  let role = null
  if (!mustChangePassword) {
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('roles(name)')
      .eq('user_id', user.id)
      .single()
    role = userRole?.roles?.name
  }

  // Already logged in — redirect away from auth pages
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL(getDashboardUrl(role), request.url))
  }

  // Already changed password — redirect away from change-password
  if (pathname === PASSWORD_CHANGE_ROUTE && !mustChangePassword) {
    return NextResponse.redirect(new URL(getDashboardUrl(role), request.url))
  }

  if (pathname === PASSWORD_CHANGE_ROUTE) {
    return response
  }

  // No role assigned
  if (!role) {
    if (pathname === '/unauthorized') return response
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  // Role-based access control
  if (!canAccessPath(role, pathname)) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return response
}

export const config = {
  matcher: [
    // ✅ Fix #6 — api/ excluded
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webpo)$).*)',
  ],
}