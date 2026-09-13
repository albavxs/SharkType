import type { Metadata } from 'next'
import IntentLanding from '@/components/seo/IntentLanding'
import { buildSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = buildSeoMetadata({
  title: 'Typing practice for code and English | SharkType',
  description: 'Practice typing online with programming snippets, English drills, multilingual text, and focused developer tracks.',
  path: '/typing-practice',
  keywords: ['typing practice', 'english typing practice', 'online typing practice', 'developer typing'],
})

export default function TypingPracticePage() {
  return (
    <IntentLanding
      eyebrow="Typing practice"
      title="Typing practice built for developers and language learners"
      description="SharkType helps you practice speed and accuracy with code syntax, English typing, and structured tracks for repeated daily training."
      points={[
        'Free public snippets in every track.',
        'Programming syntax, punctuation, and indentation.',
        'Progress, streaks, leaderboard, and focused modes.',
      ]}
    />
  )
}
