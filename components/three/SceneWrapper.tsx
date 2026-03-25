'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const SceneInner = dynamic(() => import('./SceneInner'), { ssr: false })

interface SceneWrapperProps {
  wpm?: number
  lastKeyTime?: number
  lastErrorTime?: number
}

export default function SceneWrapper(props: SceneWrapperProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Suspense fallback={null}>
        <SceneInner {...props} />
      </Suspense>
    </div>
  )
}
