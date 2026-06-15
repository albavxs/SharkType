import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'

export const runtime = 'nodejs'
export const maxDuration = 30

const MAX_BYTES = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export async function POST(request: Request) {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const supabase = (await createClient()) as unknown as SupabaseClient<any>
  const { data: { user }, error: authErr } = await supabase.auth.getUser()
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'File too large. Max 2MB.' }, { status: 413 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use jpeg, png or webp.' }, { status: 415 })
  }

  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type === 'image/png' ? 'png' : 'webp'
  const path = `${user.id}/avatar.${ext}`
  const arrayBuffer = await file.arrayBuffer()

  // Magic bytes validation — rejeita SVG/HTML disfarçados de imagem (C3)
  const bytes = new Uint8Array(arrayBuffer.slice(0, 12))
  const isJPEG = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
  const isPNG  = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
  const isWebP = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50
  if (!isJPEG && !isPNG && !isWebP) {
    return NextResponse.json({ error: 'Invalid file type. Use jpeg, png or webp.' }, { status: 415 })
  }

  const { error: uploadErr } = await supabase.storage
    .from('avatars')
    .upload(path, arrayBuffer, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type,
    })

  if (uploadErr) {
    const uploadMessage = String(uploadErr.message ?? '')
    const hint = uploadMessage
      ? `${uploadMessage} Ensure the avatars bucket exists and allows authenticated uploads.`
      : 'Could not upload avatar. Ensure the avatars bucket exists and allows authenticated uploads.'
    return NextResponse.json({ error: hint }, { status: 500 })
  }

  const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(path)
  const hashBuf = await crypto.subtle.digest("SHA-256", arrayBuffer)
  const hashHex = Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2,"0")).join("").slice(0,8)
  const avatarUrl = `${publicUrlData.publicUrl}?v=${hashHex}`

  const { error: updateErr } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: 'Could not update avatar on the profile row.' }, { status: 500 })
  }

  return NextResponse.json({ avatarUrl })
}
