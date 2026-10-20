import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'
import { getUnexpectedAuthCallbackUrl } from '@/lib/auth-redirect'

export async function proxy(request: NextRequest) {
  // Some Supabase configurations fall back to the Site URL and deliver a
  // one-time PKCE code to '/'. Process it before rendering the public landing.
  const callbackUrl = getUnexpectedAuthCallbackUrl(request.url)
  if (callbackUrl) {
    const response = NextResponse.redirect(callbackUrl, 307)
    response.headers.set('Cache-Control', 'no-store')
    response.headers.set('Referrer-Policy', 'no-referrer')
    return response
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
