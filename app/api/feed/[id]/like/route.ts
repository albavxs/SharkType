import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const supabase = (await createClient()) as unknown as SupabaseClient<any>
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const feedEventId = parseInt(params.id, 10)
    if (isNaN(feedEventId)) {
      return NextResponse.json({ error: 'Invalid feed event ID' }, { status: 400 })
    }

    // Verificar se o evento existe
    const eventRes = await supabase
      .from('feed_events')
      .select('id')
      .eq('id', feedEventId)
      .single()

    if (eventRes.error || !eventRes.data) {
      return NextResponse.json({ error: 'Feed event not found' }, { status: 404 })
    }

    // Tentar inserir o like (unique constraint evita duplicatas)
    const likeRes = await supabase
      .from('feed_likes')
      .insert({
        feed_event_id: feedEventId,
        user_id: user.id,
      })
      .select()
      .single()

    if (likeRes.error) {
      // Se for constraint violation, o like já existe
      if (likeRes.error.code === '23505') {
        return NextResponse.json({ error: 'Already liked' }, { status: 409 })
      }
      throw likeRes.error
    }

    return NextResponse.json({ like: likeRes.data }, { status: 201 })
  } catch (err) {
    console.error('Error liking feed event:', err)
    return NextResponse.json({ error: 'Failed to like event' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const supabase = (await createClient()) as unknown as SupabaseClient<any>
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const feedEventId = parseInt(params.id, 10)
    if (isNaN(feedEventId)) {
      return NextResponse.json({ error: 'Invalid feed event ID' }, { status: 400 })
    }

    // Deletar o like (RLS garante que so pode deletar seus proprios likes)
    const deleteRes = await supabase
      .from('feed_likes')
      .delete()
      .eq('feed_event_id', feedEventId)
      .eq('user_id', user.id)

    if (deleteRes.error) {
      throw deleteRes.error
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Error unliking feed event:', err)
    return NextResponse.json({ error: 'Failed to unlike event' }, { status: 500 })
  }
}
