interface RateLimitEntry {
  timestamps: number[]
}

interface RateLimitBackend {
  kind: string
  take: (key: string, maxRequests: number, windowMs: number) => { success: boolean; remaining: number }
}

const memoryStore = new Map<string, RateLimitEntry>()
let warnedAboutMemoryProductionFallback = false

function takeFromMemory(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number } {
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

function getRateLimitBackend(): RateLimitBackend {
  const configuredBackend = process.env.RATE_LIMIT_BACKEND?.trim().toLowerCase()

  if (configuredBackend && configuredBackend !== 'memory' && !warnedAboutMemoryProductionFallback) {
    console.warn(
      `[rateLimit] Unsupported RATE_LIMIT_BACKEND="${configuredBackend}". Falling back to in-memory limiter.`
    )
    warnedAboutMemoryProductionFallback = true
  }

  if (process.env.NODE_ENV === 'production' && !warnedAboutMemoryProductionFallback) {
    console.warn(
      '[rateLimit] Using in-memory limiter in production. Configure a shared backend before broad rollout.'
    )
    warnedAboutMemoryProductionFallback = true
  }

  return {
    kind: 'memory',
    take: takeFromMemory,
  }
}

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number } {
  return getRateLimitBackend().take(key, maxRequests, windowMs)
}
