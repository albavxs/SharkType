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

export const anonymousAccess: UserAccess = {
  plan: 'free',
  role: 'user',
  sources: ['anonymous'],
  isAuthenticated: false,
  isPlus: false,
  isSuperAdmin: false,
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

  const isSuperAdmin = Boolean(profile?.is_super_user)
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

  const { data: entitlement, error: entitlementError } = await supabase
    .from('user_entitlements')
    .select('status, source, expires_at')
    .eq('user_id', user.id)
    .eq('plan_id', 'plus')
    .in('status', ['active', 'manual_grant'])
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (entitlementError) {
    // During deploy/migration ordering, fail closed instead of breaking auth or granting access.
    if (entitlementError.code === '42P01' || entitlementError.code === 'PGRST205') {
      console.warn('[access-control] entitlement schema unavailable; defaulting to free access.')
    } else {
      throw entitlementError
    }
  }

  const entitlementNotExpired = entitlement
    ? !entitlement.expires_at || new Date(entitlement.expires_at).getTime() > Date.now()
    : false

  if (entitlement && entitlementNotExpired) {
    const source: AccessSource = entitlement.source === 'manual_grant' ? 'manual_grant' : 'subscription'
    return {
      plan: 'plus',
      role: 'user',
      sources: [...sources, source],
      isAuthenticated: true,
      isPlus: true,
      isSuperAdmin: false,
    }
  }

  return {
    plan: 'free',
    role: 'user',
    sources: sources.length > 0 ? sources : ['profile'],
    isAuthenticated: true,
    isPlus: false,
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
