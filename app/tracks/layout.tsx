import type { Metadata } from 'next'
import { buildSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = buildSeoMetadata({
  title: 'SharkType Tracks | Programming typing practice',
  description: 'Choose typing tracks for programming concepts, web development, DevOps, cybersecurity, English typing, and multilingual practice.',
  path: '/tracks',
  keywords: ['typing tracks', 'programming typing tracks', 'treino de digitacao para programacao', 'code typing'],
})

export default function TracksLayout({ children }: { children: React.ReactNode }) {
  return children
}
