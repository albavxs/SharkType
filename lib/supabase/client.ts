'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database'
import { getSupabaseEnv } from './env'

let browserClient: SupabaseClient<Database> | null = null

export function createClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient

  const env = getSupabaseEnv()
  if (!env.configured) {
    throw new Error('Supabase env vars are missing.')
  }

  browserClient = createBrowserClient<Database>(env.url, env.publishableKey)
  return browserClient
}
