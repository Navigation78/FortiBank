'use client'
// src/contexts/AuthContext.jsx
// Global auth state — wraps the entire app.
// Provides: user, session, role, loading, and auth methods.

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { getDashboardUrl } from '@/utils/roleRedirect'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)// Create a context for auth state

export function AuthProvider({ children }) {
  const supabase = createClient()
  const router = useRouter()

  const [user, setUser]       = useState(null)
  const [session, setSession] = useState(null)
  const [role, setRole]       = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch the user's role and profile from public.users_with_roles
  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('users_with_roles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching profile:', error.message)
      return null
    }

    return data
  }

  // Initialize auth state on mount
  useEffect(() => {
    async function initAuth() {
      setLoading(true)

      // Get current session
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setSession(session)
        setUser(session.user)

        const profileData = await fetchProfile(session.user.id)
        if (profileData) {
          setProfile(profileData)
          setRole(profileData.role)
        }
      }

      setLoading(false)
    }

    initAuth()

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (event, session) => {

    // ✅ 1. Handle token refresh separately (no heavy work)
    if (event === 'TOKEN_REFRESHED') {
      setSession(session)
      return
    }

    // ✅ 2. Prevent duplicate re-renders / loops
    if (event === 'SIGNED_IN' && session?.user && !user) {
      setSession(session)
      setUser(session.user)

      const profileData = await fetchProfile(session.user.id)
      if (profileData) {
        setProfile(profileData)
        setRole(profileData.role)
      }
    }

    // ✅ 3. Sign out cleanup
    if (event === 'SIGNED_OUT') {
      setSession(null)
      setUser(null)
      setRole(null)
      setProfile(null)
      router.push('/login')
    }

    // ✅ 4. Password recovery redirect
    if (event === 'PASSWORD_RECOVERY') {
      router.push('/reset-password')
    }
  }
)
    return () => subscription.unsubscribe()
  }, [])

  // ── Auth methods ────────────────────────────────────────────

  async function signIn({ email, password }) {
  setLoading(true)
  
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    setLoading(false)
    return { error: { message: data.error } }
  }

  // Now refresh the client-side session from the cookie the server just set
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    setSession(session)
    setUser(session.user)
    const profileData = await fetchProfile(session.user.id)
    if (profileData) {
      setProfile(profileData)
      setRole(profileData.role)
    }
  }

  setLoading(false)
  return { data, redirectTo: data.redirectTo }
}
  async function signOut() {
    await supabase.auth.signOut()
    // onAuthStateChange handles the redirect
  }

  async function sendPasswordResetEmail(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
    })
    return { error }
  }

  async function updatePassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
      data: {
        must_change_password: false,
      },
    })

    if (!error && data?.user) {
      setUser(data.user)

      const { data: sessionData } = await supabase.auth.getSession()
      if (sessionData?.session) {
        setSession(sessionData.session)
      }
    }

    return { data, error }
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
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider')
  }
  return context
}
