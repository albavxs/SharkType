import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'
import { getSupabaseEnv, getSupabaseEnvErrorPayload } from '@/lib/supabase/env'

/**
 * GET /api/achievements — catalogo publico.
 * Retorna [] se a tabela ainda nao foi migrada (graceful para envs sem 004 aplicado).
 */
export async function GET() {
  const env = getSupabaseEnv()
  if (!env.configured) {
    return NextResponse.json(getSupabaseEnvErrorPayload(env), { status: 503 })
  }

  const supabase = (await createClient()) as unknown as SupabaseClient<any>
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('category')
    .order('threshold', { nullsFirst: false })

  if (error) {
    // Tabela ausente -> retorna lista vazia
    if (error.code === '42P01' || String(error.message ?? '').includes('does not exist')) {
      return NextResponse.json({ achievements: [] })
    }
    return safeErrorResponse(err, 'Could not load profile.', 500)
  }

  const achievements = (data ?? []).map(row => ({
    id: row.id,
    category: row.category,
    threshold: row.threshold,
    icon: row.icon,
    name: { pt: row.name_pt, en: row.name_en },
    description: { pt: row.description_pt, en: row.description_en },
  }))

  return NextResponse.json({ achievements })
}
