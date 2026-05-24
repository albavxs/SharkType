/**
 * Rate limiter in-memory simples (sliding window).
 * Para produção, substituir por Upstash Redis.
 */

interface RateLimitEntry {
  timestamps: number[]
}

const store = new Map<string, RateLimitEntry>()

export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now()
  const windowStart = now - windowMs

  const entry = store.get(key) ?? { timestamps: [] }

  // Remove timestamps fora da janela
  entry.timestamps = entry.timestamps.filter(t => t > windowStart)

  if (entry.timestamps.length >= maxRequests) {
    store.set(key, entry)
    return { success: false, remaining: 0 }
  }

  entry.timestamps.push(now)
  store.set(key, entry)

  return { success: true, remaining: maxRequests - entry.timestamps.length }
}
