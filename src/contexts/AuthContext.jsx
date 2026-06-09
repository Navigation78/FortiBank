'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { applyTabHeaders, getTabId } from '@/lib/tabSession'
import { canAccessPath, getDashboardUrl } from '@/utils/roleRedirect'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const supabase = useRef(createClient()).current
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authInitialized, setAuthInitialized] = useState(false)

  const profileRequestId = useRef(0)
  const fetchedUserId = useRef(null)

  useEffect(() => {
    getTabId()
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const nativeFetch = window.fetch.bind(window)

    window.fetch = async (input, options = {}) => {
      // _tokenRefreshRetry is an internal flag — strip it before passing to native fetch
      const { _tokenRefreshRetry, ...fetchOptions } = options

      const requestUrl = typeof input === 'string' ? input : input?.url
      const url = requestUrl ? new URL(requestUrl, window.location.origin) : null
      const shouldTagRequest = url?.origin === window.location.origin && url.pathname.startsWith('/api/')

      if (!shouldTagRequest) {
        return nativeFetch(input, fetchOptions)
      }

      const headers = applyTabHeaders(fetchOptions.headers)

      if (!headers.has('Authorization')) {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()

        if (currentSession?.access_token) {
          headers.set('Authorization', `Bearer ${currentSession.access_token}`)
        }
      }

      const response = await nativeFetch(input, { ...fetchOptions, headers })

      // On 401, refresh the token once and retry. The refreshed session is stored by
      // Supabase in localStorage so all tabs pick it up via onAuthStateChange.
      if (response.status === 401 && !_tokenRefreshRetry) {
        const { data: { session: refreshed }, error: refreshErr } = await supabase.auth.refreshSession()
        if (!refreshErr && refreshed?.access_token) {
          return window.fetch(input, { ...fetchOptions, _tokenRefreshRetry: true })
        }
      }

      return response
    }

    return () => {
      window.fetch = nativeFetch
    }
  }, [supabase])

  const resetProfileState = useCallback(() => {
    profileRequestId.current += 1
    fetchedUserId.current = null
    setRole(null)
    setProfile(null)
  }, [])

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('users_with_roles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  }, [supabase])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (event === 'PASSWORD_RECOVERY') {
        router.push('/reset-password')
        return
      }

      if (event === 'SIGNED_OUT') {
        setSession(null)
        setUser(null)
        resetProfileState()
        setAuthInitialized(true)
        setLoading(false)
        router.push('/login')
        return
      }

      if (
        event === 'INITIAL_SESSION' ||
        event === 'SIGNED_IN' ||
        event === 'TOKEN_REFRESHED' ||
        event === 'USER_UPDATED'
      ) {
        const nextUser = nextSession?.user ?? null
        setSession(nextSession)
        setUser(nextUser)

        if (!nextUser || (fetchedUserId.current !== null && nextUser.id !== fetchedUserId.current)) {
          resetProfileState()
        }

        setAuthInitialized(true)
        setLoading(!!nextUser)
      }
    })

    return () => subscription.unsubscribe()
  }, [resetProfileState, router, supabase])

  useEffect(() => {
    if (!authInitialized) return

    if (!user?.id) {
      setLoading(false)
      return
    }

    if (fetchedUserId.current === user.id && profile) {
      setLoading(false)
      return
    }

    let cancelled = false
    const requestId = profileRequestId.current + 1
    profileRequestId.current = requestId
    setLoading(true)

    async function loadProfile() {
      try {
        const profileData = await fetchProfile(user.id)

        if (cancelled || profileRequestId.current !== requestId) return

        fetchedUserId.current = user.id
        setProfile(profileData)
        setRole(profileData?.role ?? null)
      } catch (err) {
        if (!cancelled && profileRequestId.current === requestId) {
          console.error('[Auth] Failed to load profile:', err.message)
          setProfile(null)
          setRole(null)
        }
      } finally {
        if (!cancelled && profileRequestId.current === requestId) {
          setLoading(false)
        }
      }
    }

    loadProfile()

    return () => {
      cancelled = true
    }
  }, [authInitialized, fetchProfile, profile, user?.id])

  useEffect(() => {
    if (!authInitialized || loading) return
    if (!pathname) return

    const publicRoutes = ['/', '/login', '/forgot-password', '/reset-password', '/unauthorized', '/privacy-policy', '/terms-of-use']
    const isPublicRoute = publicRoutes.some(route =>
      route === '/' ? pathname === '/' : pathname.startsWith(route)
    )
    const isAlwaysPublic = pathname.startsWith('/phishing-click')

    if (isAlwaysPublic) return

    if (!user) {
      if (!isPublicRoute) {
        router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`)
      }
      return
    }

    const mustChangePassword = user.user_metadata?.must_change_password === true

    if (mustChangePassword && pathname !== '/change-password') {
      router.replace('/change-password')
      return
    }

    if (!mustChangePassword && pathname === '/change-password') {
      router.replace(getDashboardUrl(role))
      return
    }

    if (isPublicRoute) {
      router.replace(getDashboardUrl(role))
      return
    }

    if (role && !canAccessPath(role, pathname)) {
      router.replace('/unauthorized')
    }
  }, [authInitialized, loading, pathname, role, router, user])

  async function signIn({ email, password }) {
    setLoading(true)
    resetProfileState()

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: applyTabHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      setLoading(false)
      return { error: { message: data.error } }
    }

    try {
      if (!data.session?.access_token || !data.session?.refresh_token) {
        setLoading(false)
        return { error: { message: 'No session was returned by the server' } }
      }

      const { data: sessionData, error: setError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })

      if (setError) {
        setLoading(false)
        return { error: setError }
      }

      const nextSession = sessionData?.session ?? data.session
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setAuthInitialized(true)

      if (nextSession?.user?.user_metadata?.must_change_password) {
        return { data, redirectTo: '/change-password' }
      }

      return { data, redirectTo: data.redirectTo }
    } catch (err) {
      setLoading(false)
      console.error('[signIn] Unexpected error:', err)
      return { error: { message: 'An unexpected error occurred during sign in' } }
    }
  }

  async function signOut() {
    setUser(null)
    setSession(null)
    resetProfileState()
    setLoading(false)

    await fetch('/api/auth/logout', { method: 'POST', headers: applyTabHeaders() })
    await supabase.auth.signOut()
  }

  async function sendPasswordResetEmail(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })
    return { error }
  }

  async function updateAvatarUrl(url) {
    const { data, error } = await supabase.auth.updateUser({ data: { avatar_url: url } })
    if (!error && data?.user) {
      setUser(data.user)
      setProfile(prev => prev ? { ...prev, avatar_url: url } : prev)
    }
    return { error }
  }

  async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
      data: { must_change_password: false },
    })

    if (!error && data?.user) {
      setUser(data.user)
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()
      if (currentSession) setSession(currentSession)
    }

    return { data, error }
  }

  async function authenticatedFetch(url, options = {}) {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession()

    const headers = applyTabHeaders(options.headers)

    if (currentSession?.access_token) {
      headers.set('Authorization', `Bearer ${currentSession.access_token}`)
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }

  const value = {
    user,
    session,
    role,
    profile,
    loading,
    isAuthenticated: !!user,
    signIn,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    updateAvatarUrl,
    authenticatedFetch,
    supabase,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider')
  }
  return context
}
