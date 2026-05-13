import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './database'
import { getSupabaseEnv } from './env'

export async function updateSession(request: NextRequest) {
  const env = getSupabaseEnv()
  let response = NextResponse.next({
    request,
  })

  if (!env.configured) return response

  const supabase = createServerClient<Database>(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

        response = NextResponse.next({
          request,
        })

        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  await supabase.auth.getClaims()

  return response
}
