import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserAccess } from '@/lib/server/access-control'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  try {
    const access = await getUserAccess(supabase, user)
    return NextResponse.json({ access })
  } catch (accessError) {
    console.error('[access] load failed:', accessError instanceof Error ? accessError.message : accessError)
    return NextResponse.json({ error: 'Could not load access state.' }, { status: 500 })
  }
}
