import { Suspense } from 'react'
import VerifyEmailClient from '@/components/auth/VerifyEmailClient'

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailClient />
    </Suspense>
  )
}
