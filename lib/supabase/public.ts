import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from './database'
import { assertSupabaseConfigured, getSupabaseEnv } from './env'

export function createPublicClient() {
  const env = assertSupabaseConfigured(getSupabaseEnv())

  return createSupabaseClient<Database>(env.url, env.publishableKey)
}
