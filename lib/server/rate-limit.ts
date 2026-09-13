import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'

interface RateLimitEntry {
  timestamps: number[]
}

interface RateLimitResult {
  success: boolean
  remaining: number
}

type ThrottleRpcRow = {
  success?: unknown
  remaining?: unknown
}

type ThrottleRpcError = {
  message?: string
}

type ThrottleRpcClient = {
  rpc: (
    name: 'consume_request_throttle',
    args: {
      p_key: string
      p_max_requests: number
      p_window_seconds: number
    }
  ) => PromiseLike<{
    data: ThrottleRpcRow[] | ThrottleRpcRow | null
    error: ThrottleRpcError | null
  }>
}

const memoryStore = new Map<string, RateLimitEntry>()
let warnedAboutMemoryProductionFallback = false

function takeFromMemory(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const windowStart = now - windowMs

  const entry = memoryStore.get(key) ?? { timestamps: [] }
  entry.timestamps = entry.timestamps.filter((timestamp) => timestamp > windowStart)

  if (entry.timestamps.length >= maxRequests) {
    memoryStore.set(key, entry)
    return { success: false, remaining: 0 }
  }

  entry.timestamps.push(now)
  memoryStore.set(key, entry)

  return { success: true, remaining: maxRequests - entry.timestamps.length }
}

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  if (process.env.NODE_ENV === 'production' && !warnedAboutMemoryProductionFallback) {
    console.warn(
      '[rateLimit] In-memory limiter is for non-critical routes only. Use sharedRateLimit for security-sensitive operations.'
    )
    warnedAboutMemoryProductionFallback = true
  }

  return takeFromMemory(key, maxRequests, windowMs)
}

export async function sharedRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): Promise<RateLimitResult> {
  try {
    const admin = createAdminClient() as unknown as ThrottleRpcClient
    const windowSeconds = Math.max(1, Math.ceil(windowMs / 1000))
    const { data, error } = await admin.rpc('consume_request_throttle', {
      p_key: key,
      p_max_requests: maxRequests,
      p_window_seconds: windowSeconds,
    })

    if (error) throw new Error(error.message || 'Shared rate limit query failed.')

    const result = Array.isArray(data) ? data[0] : data
    if (!result || typeof result.success !== 'boolean') {
      throw new Error('Invalid shared rate limit response.')
    }

    return {
      success: result.success,
      remaining: typeof result.remaining === 'number' && Number.isFinite(result.remaining)
        ? result.remaining
        : 0,
    }
  } catch (error) {
    console.error('[rateLimit] shared limiter unavailable:', error instanceof Error ? error.message : error)

    // Development can keep working before local migrations are applied. In a
    // production runtime we fail closed so a missing throttle schema cannot
    // silently turn into an unlimited endpoint.
    if (process.env.NODE_ENV !== 'production') {
      return takeFromMemory(key, maxRequests, windowMs)
    }

    return { success: false, remaining: 0 }
  }
}
