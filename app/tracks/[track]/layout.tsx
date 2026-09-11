import type { Metadata } from 'next'
import { getTrackById } from '@/data/tracks'
import { buildSeoMetadata } from '@/lib/seo'

interface TrackLayoutProps {
  children: React.ReactNode
  params: Promise<{
    track: string
  }>
}

export async function generateMetadata({ params }: TrackLayoutProps): Promise<Metadata> {
  const { track: trackId } = await params
  const track = getTrackById(trackId)

  if (!track) {
    return buildSeoMetadata({
      title: 'Track not found | SharkType',
      description: 'Practice typing code and text with SharkType.',
      path: `/tracks/${trackId}`,
    })
  }

  return buildSeoMetadata({
    title: `${track.name.en} typing practice | SharkType`,
    description: `${track.description.en}. Treine digitacao e pratique code typing com os snippets publicos do SharkType.`,
    path: `/tracks/${track.id}`,
    keywords: [
      `${track.name.en} typing practice`,
      `${track.name.pt} treino de digitacao`,
      'programming typing practice',
      'code typing',
    ],
  })
}

export default function TrackLayout({ children }: TrackLayoutProps) {
  return children
}
