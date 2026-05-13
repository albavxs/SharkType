'use client'

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { AuthActionResult, AuthProfile, SignUpActionResult } from '@/lib/auth-types'
import { createClient } from '@/lib/supabase/client'
import { getAuthCallbackUrl, isSupabaseConfigured } from '@/lib/supabase/env'
import { isValidUsername, sanitizeUsername } from '@/lib/usernames'

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: AuthProfile | null
  isLoading: boolean
  supabaseConfigured: boolean
  pendingVerificationEmail: string | null
  signInWithGitHub: () => Promise<AuthActionResult>
  signInWithPassword: (email: string, password: string) => Promise<AuthActionResult>
  signUpWithPassword: (input: {
    username: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<SignUpActionResult>
  verifyEmailCode: (email: string, token: string) => Promise<AuthActionResult>
  resendEmailCode: (email: string) => Promise<AuthActionResult>
  updateProfile: (input: { username: string; displayName?: string | null }) => Promise<AuthActionResult>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const PENDING_VERIFICATION_KEY = 'sharktype-pending-verification-email'

async function parseJsonError(response: Response): Promise<string> {
  try {
    const payload = (await response.json()) as { error?: string }
    return payload.error ?? 'Request failed.'
  } catch {
    return 'Request failed.'
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null)

  const supabaseConfigured = useMemo(() => isSupabaseConfigured(), [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const savedEmail = window.localStorage.getItem(PENDING_VERIFICATION_KEY)
    if (savedEmail) setPendingVerificationEmail(savedEmail)
  }, [])

  async function refreshProfile() {
    if (!supabaseConfigured) return

    const response = await fetch('/api/me/profile', { cache: 'no-store' })
    if (response.status === 401) {
      setProfile(null)
      return
    }

    if (!response.ok) {
      throw new Error(await parseJsonError(response))
    }

    const payload = (await response.json()) as { profile: AuthProfile }
    setProfile(payload.profile)
  }

  useEffect(() => {
    if (!supabaseConfigured) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    let active = true

    async function hydrate() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (!active) return

      setSession(currentSession)
      setUser(currentSession?.user ?? null)

      if (currentSession?.user) {
        try {
          await refreshProfile()
        } catch {
          setProfile(null)
        }
      }

      if (active) setIsLoading(false)
    }

    void hydrate()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      startTransition(() => {
        setSession(nextSession)
        setUser(nextSession?.user ?? null)
      })

      if (!nextSession?.user) {
        setProfile(null)
        setIsLoading(false)
        return
      }

      void refreshProfile().catch(() => {
        setProfile(null)
      })
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [supabaseConfigured])

  async function signInWithGitHub(): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: 'Supabase is not configured.' }
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: getAuthCallbackUrl('/'),
        },
      })

      return { error: error?.message ?? null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'GitHub sign-in failed.' }
    }
  }

  async function signInWithPassword(email: string, password: string): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: 'Supabase is not configured.' }
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return { error: error?.message ?? null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Email sign-in failed.' }
    }
  }

  async function signUpWithPassword(input: {
    username: string
    email: string
    password: string
    confirmPassword: string
  }): Promise<SignUpActionResult> {
    if (!supabaseConfigured) {
      return { error: 'Supabase is not configured.', needsVerification: false }
    }

    const username = sanitizeUsername(input.username)
    if (!isValidUsername(username)) {
      return {
        error: 'Username must be 3-20 chars using lowercase letters, numbers, or underscores.',
        needsVerification: false,
      }
    }

    if (input.password.length < 8) {
      return {
        error: 'Password must be at least 8 characters long.',
        needsVerification: false,
      }
    }

    if (input.password !== input.confirmPassword) {
      return {
        error: 'Password confirmation does not match.',
        needsVerification: false,
      }
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          emailRedirectTo: getAuthCallbackUrl('/'),
          data: {
            username,
            display_name: username,
            provider: 'email',
          },
        },
      })

      if (error) return { error: error.message, needsVerification: false }

      const needsVerification = !data.session
      if (needsVerification) {
        window.localStorage.setItem(PENDING_VERIFICATION_KEY, input.email)
        setPendingVerificationEmail(input.email)
      }

      return { error: null, needsVerification }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Email sign-up failed.',
        needsVerification: false,
      }
    }
  }

  async function verifyEmailCode(email: string, token: string): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: 'Supabase is not configured.' }
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      })

      if (error) return { error: error.message }

      window.localStorage.removeItem(PENDING_VERIFICATION_KEY)
      setPendingVerificationEmail(null)
      await refreshProfile().catch(() => {})

      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Email verification failed.' }
    }
  }

  async function resendEmailCode(email: string): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: 'Supabase is not configured.' }
    }

    try {
      const response = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        return { error: await parseJsonError(response) }
      }

      window.localStorage.setItem(PENDING_VERIFICATION_KEY, email)
      setPendingVerificationEmail(email)
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Could not resend the code.' }
    }
  }

  async function updateProfile(input: { username: string; displayName?: string | null }): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: 'Supabase is not configured.' }
    }

    try {
      const response = await fetch('/api/me/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      })

      if (!response.ok) {
        return { error: await parseJsonError(response) }
      }

      const payload = (await response.json()) as { profile: AuthProfile }
      setProfile(payload.profile)
      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Could not update profile.' }
    }
  }

  async function signOut() {
    if (!supabaseConfigured) return

    const supabase = createClient()
    await supabase.auth.signOut()
    setProfile(null)
  }

  const value: AuthContextValue = {
    user,
    session,
    profile,
    isLoading,
    supabaseConfigured,
    pendingVerificationEmail,
    signInWithGitHub,
    signInWithPassword,
    signUpWithPassword,
    verifyEmailCode,
    resendEmailCode,
    updateProfile,
    signOut,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider.')
  return context
}
