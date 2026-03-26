'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const SceneInner = dynamic(() => import('./SceneInner'), { ssr: false })

export default function SceneWrapper() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Suspense fallback={null}>
        <SceneInner />
      </Suspense>
    </div>
  )
}
