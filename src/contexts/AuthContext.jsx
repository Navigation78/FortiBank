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
        if (event === 'SIGNED_IN' && session?.user) {
          setSession(session)
          setUser(session.user)

          const profileData = await fetchProfile(session.user.id)
          if (profileData) {
            setProfile(profileData)
            setRole(profileData.role)
          }
        }

        if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setRole(null)
          setProfile(null)
          router.push('/login')
        }

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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setLoading(false)
      return { error }
    }

    // Fetch profile to get role for redirect
    const profileData = await fetchProfile(data.user.id)
    if (profileData) {
      setProfile(profileData)
      setRole(profileData.role)
      setLoading(false)
      return { data, redirectTo: getDashboardUrl(profileData.role) }
    }

    setLoading(false)
    return { data, redirectTo: '/dashboard' }
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
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    return { error }
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