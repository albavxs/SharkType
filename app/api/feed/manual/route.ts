import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'
import { ensureProfileForUser } from '@/lib/server/auth-profile'
import { getFeedEventById, type FeedManualPostPayload, type ManualPostCategory } from '@/lib/server/feed-store'
import { rateLimit } from '@/lib/server/rate-limit'

const MAX_MANUAL_POST_BYTES = 8 * 1024
const MAX_TITLE_LENGTH = 120
const MAX_BODY_LENGTH = 1200

type LocalizedInput = {
  pt?: unknown
  en?: unknown
}

function normalizeLocalizedInput(
  value: LocalizedInput | null | undefined,
  maxLength: number
) {
  const pt = typeof value?.pt === 'string' ? value.pt.trim() : ''
  const en = typeof value?.en === 'string' ? value.en.trim() : ''
  const primary = pt || en
  if (!primary) return null
  if (pt.length > maxLength || en.length > maxLength || primary.length > maxLength) return null

  return {
    pt: pt || en,
    en: en || pt,
  }
}

function isManualPostCategory(value: unknown): value is ManualPostCategory {
  return value === 'ranked_tip' || value === 'language_fact' || value === 'announcement'
}

export async function POST(request: Request) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const contentLength = Number(request.headers.get('content-length') ?? '0')
  if (Number.isFinite(contentLength) && contentLength > MAX_MANUAL_POST_BYTES) {
    return NextResponse.json({ error: 'Manual post payload is too large.' }, { status: 400 })
  }

  const profile = await ensureProfileForUser(supabase, user)
  if (!profile.isSuperUser) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
  }

  const { success } = rateLimit(`manual-post:${user.id}`, 10, 60 * 60 * 1000)
  if (!success) {
    return NextResponse.json({ error: 'Rate limited.' }, { status: 429 })
  }

  let body: {
    title?: LocalizedInput
    body?: LocalizedInput
    category?: unknown
  }

  try {
    body = (await request.json()) as typeof body
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const title = normalizeLocalizedInput(body.title, MAX_TITLE_LENGTH)
  const content = normalizeLocalizedInput(body.body, MAX_BODY_LENGTH)
  if (!title || !content || !isManualPostCategory(body.category)) {
    return NextResponse.json({ error: 'Invalid manual post payload.' }, { status: 400 })
  }

  const payload: FeedManualPostPayload = {
    title,
    body: content,
    category: body.category,
  }

  const inserted = await supabase
    .from('feed_events')
    .insert({
      user_id: user.id,
      event_type: 'manual_post',
      payload,
    })
    .select('id')
    .single()

  if (inserted.error) {
    return NextResponse.json({ error: 'Could not create manual feed post.' }, { status: 500 })
  }

  const event = await getFeedEventById(supabase, inserted.data.id)
  if (!event) {
    return NextResponse.json({ error: 'Could not load created manual feed post.' }, { status: 500 })
  }

  return NextResponse.json({ event }, { status: 201 })
}
