import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database'

export type PlanId = 'free' | 'plus'
export type AccessRole = 'user' | 'super_admin'
export type AccessSource = 'anonymous' | 'profile' | 'subscription' | 'manual_grant' | 'super_admin'

export interface UserAccess {
  plan: PlanId
  role: AccessRole
  sources: AccessSource[]
  isAuthenticated: boolean
  isPlus: boolean
  isSuperAdmin: boolean
}

type DBClient = SupabaseClient<Database>

const SHARKCODER_USERNAME = 'sharkcoder'

export const anonymousAccess: UserAccess = {
  plan: 'free',
  role: 'user',
  sources: ['anonymous'],
  isAuthenticated: false,
  isPlus: false,
  isSuperAdmin: false,
}

function isActiveStatus(status: unknown): boolean {
  return status === 'active' || status === 'manual_grant' || status === 'past_due' || status === 'overdue'
}

function hasFutureExpiry(expiresAt: unknown): boolean {
  if (typeof expiresAt !== 'string' || expiresAt.trim().length === 0) return true
  return new Date(expiresAt).getTime() > Date.now()
}

export async function getUserAccess(supabase: DBClient, user: User | null): Promise<UserAccess> {
  if (!user) return anonymousAccess

  const sources: AccessSource[] = []
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, username, is_super_user')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) throw profileError

  const isSuperAdmin = Boolean(profile?.is_super_user) || profile?.username === SHARKCODER_USERNAME
  if (isSuperAdmin) {
    return {
      plan: 'plus',
      role: 'super_admin',
      sources: ['profile', 'super_admin'],
      isAuthenticated: true,
      isPlus: true,
      isSuperAdmin: true,
    }
  }

  if (profile) sources.push('profile')

  const { data: entitlements, error: entitlementError } = await supabase
    .from('user_entitlements')
    .select('plan_id, status, source, expires_at')
    .eq('user_id', user.id)
    .eq('plan_id', 'plus')

  if (entitlementError) throw entitlementError

  const hasPlus = (entitlements ?? []).some((entitlement) =>
    isActiveStatus(entitlement.status) && hasFutureExpiry(entitlement.expires_at)
  )

  for (const entitlement of entitlements ?? []) {
    if (entitlement.source === 'manual_grant') sources.push('manual_grant')
    if (entitlement.source === 'asaas') sources.push('subscription')
  }

  return {
    plan: hasPlus ? 'plus' : 'free',
    role: 'user',
    sources: sources.length > 0 ? Array.from(new Set(sources)) : ['profile'],
    isAuthenticated: true,
    isPlus: hasPlus,
    isSuperAdmin: false,
  }
}

export async function requireSuperAdmin(supabase: DBClient, user: User | null): Promise<UserAccess> {
  const access = await getUserAccess(supabase, user)
  if (!access.isSuperAdmin) {
    throw new Error('Forbidden.')
  }
  return access
}
