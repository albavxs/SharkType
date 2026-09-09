import type { Metadata } from 'next'
import IntentLanding from '@/components/seo/IntentLanding'
import { buildSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = buildSeoMetadata({
  title: 'Code typing practice | SharkType',
  description: 'Improve programming typing speed with snippets for TypeScript, Python, Rust, Go, JavaScript, SQL, DevOps, and more.',
  path: '/code-typing-practice',
  keywords: ['code typing practice', 'programming typing practice', 'typing code', 'developer typing practice'],
})

export default function CodeTypingPracticePage() {
  return (
    <IntentLanding
      eyebrow="Code typing practice"
      title="Practice typing real programming syntax"
      description="Train the characters developers actually type: braces, operators, indentation, function signatures, shell commands, SQL queries, and framework patterns."
      points={[
        'Tracks for language syntax and programming concepts.',
        'Free samples before Plus advanced snippets.',
        'Accuracy-first feedback with WPM and raw WPM.',
      ]}
    />
  )
}
