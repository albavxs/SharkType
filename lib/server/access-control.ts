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

  // P0 containment: privileged access is derived only from the authenticated
  // profile flag. A username is display identity and must never grant admin.
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

  // Paid/manual entitlements are intentionally disabled while the entitlement
  // schema is rolled back and audited. Normal authenticated users fail closed
  // to the free plan instead of failing open or throwing PGRST205.
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
