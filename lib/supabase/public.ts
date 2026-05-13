import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database'
import { getSupabaseEnv } from './env'

export function createPublicClient() {
  const env = getSupabaseEnv()
  if (!env.configured) {
    throw new Error('Supabase env vars are missing.')
  }

  return createSupabaseClient<Database>(env.url, env.publishableKey)
}
