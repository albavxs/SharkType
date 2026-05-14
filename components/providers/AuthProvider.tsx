'use client'

import {
  useCallback,
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from 'react'
import type { Session, User, MobileOtpType } from '@supabase/supabase-js'
import type { AuthActionResult, AuthProfile, SignUpActionResult } from '@/lib/auth-types'
import { createClient } from '@/lib/supabase/client'
import {
  getAuthCallbackUrl,
  getSupabaseEnv,
  getSupabaseEnvErrorMessage,
  type SupabaseEnvVarName,
} from '@/lib/supabase/env'
import { isValidUsername, sanitizeUsername } from '@/lib/usernames'

interface AuthContextValue {
  user: User | null
  session: Session | null
  profile: AuthProfile | null
  isLoading: boolean
  supabaseConfigured: boolean
  supabaseMissingVars: SupabaseEnvVarName[]
  pendingVerificationEmail: string | null
  signInWithGitHub: () => Promise<AuthActionResult>
  signInWithPassword: (email: string, password: string) => Promise<AuthActionResult>
  signUpWithPassword: (input: {
    username: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<SignUpActionResult>
  verifyOtp: (email: string, token: string, type: MobileOtpType) => Promise<AuthActionResult>
  resendEmailCode: (email: string) => Promise<AuthActionResult>
  resetPassword: (email: string) => Promise<AuthActionResult>
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
  const supabaseEnv = getSupabaseEnv()
  const supabaseConfigured = supabaseEnv.configured
  const supabaseMissingVars = supabaseEnv.missingVars
  const supabaseConfigError = supabaseConfigured ? null : getSupabaseEnvErrorMessage(supabaseEnv)

  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<AuthProfile | null>(null)
  const [isLoading, setIsLoading] = useState(supabaseConfigured)
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return window.localStorage.getItem(PENDING_VERIFICATION_KEY)
  })

  const refreshProfile = useCallback(async () => {
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
  }, [supabaseConfigured])

  useEffect(() => {
    if (!supabaseConfigured) return

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
  }, [refreshProfile, supabaseConfigured])

  async function signInWithGitHub(): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: supabaseConfigError ?? 'Supabase is not configured.' }
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
      return { error: supabaseConfigError ?? 'Supabase is not configured.' }
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
      return { error: supabaseConfigError ?? 'Supabase is not configured.', needsVerification: false }
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
      
      // Armazenamos o username nos metadados para quando o usuário confirmar o OTP
      const { error } = await supabase.auth.signInWithOtp({
        email: input.email,
        options: {
          data: {
            username,
            display_name: username,
          },
          shouldCreateUser: true,
          emailRedirectTo: undefined, // Remove explicitamente qualquer redirecionamento
        },
      })

      if (error) return { error: error.message, needsVerification: false }

      // No fluxo de OTP, sempre precisamos de verificação
      window.localStorage.setItem(PENDING_VERIFICATION_KEY, input.email)
      setPendingVerificationEmail(input.email)

      return { error: null, needsVerification: true }
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Email sign-up failed.',
        needsVerification: false,
      }
    }
  }

  async function verifyOtp(email: string, token: string, type: MobileOtpType): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: supabaseConfigError ?? 'Supabase is not configured.' }
    }

    try {
      const supabase = createClient()
      // Se o tipo for 'signup', tentamos 'email' primeiro caso venha do fluxo de signInWithOtp
      const otpType = type === 'signup' ? 'email' : type

      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: otpType as any,
      })

      if (error) return { error: error.message }

      if (type === 'signup' || type === 'email') {
        window.localStorage.removeItem(PENDING_VERIFICATION_KEY)
        setPendingVerificationEmail(null)
      }
      
      await refreshProfile().catch(() => {})

      return { error: null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Verification failed.' }
    }
  }

  async function resendEmailCode(email: string): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: supabaseConfigError ?? 'Supabase is not configured.' }
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

  async function resetPassword(email: string): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: supabaseConfigError ?? 'Supabase is not configured.' }
    }

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: getAuthCallbackUrl('/settings'),
      })

      return { error: error?.message ?? null }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Password reset request failed.' }
    }
  }

  async function updateProfile(input: { username: string; displayName?: string | null }): Promise<AuthActionResult> {
    if (!supabaseConfigured) {
      return { error: supabaseConfigError ?? 'Supabase is not configured.' }
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
    supabaseMissingVars,
    pendingVerificationEmail,
    signInWithGitHub,
    signInWithPassword,
    signUpWithPassword,
    verifyOtp,
    resendEmailCode,
    resetPassword,
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
