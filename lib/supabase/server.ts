import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database'
import { getSupabaseEnv } from './env'

export async function createClient() {
  const env = getSupabaseEnv()
  if (!env.configured) {
    throw new Error('Supabase env vars are missing.')
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // Server Components can't always write cookies; route handlers and proxy cover refresh persistence.
        }
      },
    },
  })
}
