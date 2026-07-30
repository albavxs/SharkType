import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import type { Database } from './database'
import { assertSupabaseConfigured, getSupabaseAuthCookieName, getSupabaseEnv } from './env'

export async function createClient(response?: NextResponse) {
  const env = assertSupabaseConfigured(getSupabaseEnv())

  const cookieStore = await cookies()

  return createServerClient<Database>(env.url, env.publishableKey, {
    cookieOptions: {
      name: getSupabaseAuthCookieName(env.url),
    },
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          if (response) {
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
          } else {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          }
        } catch {
          // Server Components can't always write cookies; route handlers and proxy cover refresh persistence.
        }
      },
    },
  })
}
