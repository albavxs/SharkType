import type { MetadataRoute } from 'next'
import { tracks } from '@/data/tracks'
import { absoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = [
    '/',
    '/tracks',
    '/plus',
    '/typing-practice',
    '/code-typing-practice',
    '/treino-de-digitacao',
    '/leaderboard',
    '/community',
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: route === '/' ? 'weekly' as const : 'monthly' as const,
      priority: route === '/' ? 1 : 0.8,
    })),
    ...tracks.map((track) => ({
      url: absoluteUrl(`/tracks/${track.id}`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
