'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'

const SceneInner = dynamic(() => import('./SceneInner'), { ssr: false })

function canCreateWebGLContext() {
  const canvas = document.createElement('canvas')
  return Boolean(
    canvas.getContext('webgl2') ||
    canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl')
  )
}

export default function SceneWrapper() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setEnabled(canCreateWebGLContext())
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  if (!enabled) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <Suspense fallback={null}>
        <SceneInner />
      </Suspense>
    </div>
  )
}
