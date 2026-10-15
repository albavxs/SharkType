'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSupabaseEnv } from '@/lib/supabase/env'

const LINK_DESTINATIONS: Record<string, string> = {
  recovery: '/reset-password',
  signup: '/home',
  email: '/home',
  invite: '/home',
  magiclink: '/home',
  email_change: '/home',
}

// Supabase's default email templates ({{ .ConfirmationURL }}) land on the Site
// URL with the session in the hash (implicit flow). The PKCE browser client
// rejects that hash, so pick it up here and continue to the right page.
// Links built with token_hash go through /auth/confirm and never reach this.
export default function EmailLinkHandler() {
  const router = useRouter()

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1))
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    const destination = LINK_DESTINATIONS[params.get('type') ?? '']

    if (!destination || !accessToken || !refreshToken) return
    if (!getSupabaseEnv().configured) return

    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}`)

    // setSession validates the access token with Supabase before saving it.
    // If it fails, /reset-password shows its "invalid recovery link" state and
    // /home stays signed out.
    void createClient()
      .auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .catch(() => null)
      .finally(() => router.replace(destination))
  }, [router])

  return null
}
