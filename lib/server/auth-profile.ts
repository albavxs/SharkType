import type { User, SupabaseClient } from '@supabase/supabase-js'
import type { AuthProfile } from '@/lib/auth-types'
import type { Database } from '@/lib/supabase/database'
import { buildUsernameCandidate, sanitizeUsername } from '@/lib/usernames'

type DBClient = SupabaseClient<any>

function inferProvider(user: User): string | null {
  return user.app_metadata.provider ?? user.identities?.[0]?.provider ?? null
}

function inferDisplayName(user: User): string | null {
  const metadata = user.user_metadata ?? {}
  return metadata.display_name ?? metadata.full_name ?? metadata.name ?? null
}

function inferAvatarUrl(user: User): string | null {
  const metadata = user.user_metadata ?? {}
  return metadata.avatar_url ?? metadata.picture ?? null
}

function inferRequestedUsername(user: User): string {
  const metadata = user.user_metadata ?? {}
  const emailLocalPart = user.email?.split('@')[0] ?? 'shark'

  return sanitizeUsername(
    metadata.username ??
      metadata.preferred_username ??
      metadata.user_name ??
      metadata.login ??
      metadata.name ??
      emailLocalPart
  )
}

function mapProfile(row: Database['public']['Tables']['profiles']['Row']): AuthProfile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    provider: row.provider,
    emailVerified: row.email_verified,
    localImportedAt: row.local_imported_at,
    onboardingCompleted: row.onboarding_completed,
  }
}

export async function getOwnProfile(supabase: DBClient, userId: string): Promise<AuthProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data ? mapProfile(data) : null
}

export async function ensureProfileForUser(supabase: DBClient, user: User): Promise<AuthProfile> {
  const existing = await getOwnProfile(supabase, user.id)
  const basePayload = {
    display_name: inferDisplayName(user),
    avatar_url: inferAvatarUrl(user),
    provider: inferProvider(user),
    email_verified: Boolean(user.email_confirmed_at),
    onboarding_completed: inferProvider(user) === 'email' ? true : existing?.onboardingCompleted ?? false,
  }

  if (existing) {
    const { data, error } = await supabase
      .from('profiles')
      .update(basePayload)
      .eq('id', user.id)
      .select('*')
      .single()

    if (error) throw error
    return mapProfile(data)
  }

  const desired = inferRequestedUsername(user)
  let lastError: Error | null = null

  for (let attempt = 0; attempt < 25; attempt++) {
    const username = buildUsernameCandidate(desired, attempt)
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        username,
        ...basePayload,
      })
      .select('*')
      .single()

    if (!error && data) return mapProfile(data)

    const message = error?.message?.toLowerCase() ?? ''
    if (!message.includes('duplicate') && !message.includes('unique')) {
      throw error
    }

    lastError = error
  }

  throw lastError ?? new Error('Unable to allocate a unique username.')
}

export async function updateProfileIdentity(
  supabase: DBClient,
  userId: string,
  input: {
    username: string
    displayName?: string | null
    onboardingCompleted?: boolean
  }
): Promise<AuthProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      username: input.username,
      display_name: input.displayName ?? null,
      onboarding_completed: input.onboardingCompleted ?? true,
    })
    .eq('id', userId)
    .select('*')
    .single()

  if (error) throw error
  return mapProfile(data)
}
