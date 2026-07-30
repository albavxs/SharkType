'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database'
import { assertSupabaseConfigured, getSupabaseAuthCookieName, getSupabaseEnv } from './env'

let browserClient: SupabaseClient<Database> | null = null

export function createClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient

  const env = assertSupabaseConfigured(getSupabaseEnv())

  browserClient = createBrowserClient<Database>(env.url, env.publishableKey, {
    cookieOptions: {
      name: getSupabaseAuthCookieName(env.url),
    },
  })
  return browserClient
}
