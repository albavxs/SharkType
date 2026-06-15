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
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const enableScene = () => {
      setEnabled(canCreateWebGLContext())
      setIsVisible(document.visibilityState !== 'hidden')
    }

    const hasIdleCallback = 'requestIdleCallback' in window
    const schedule = hasIdleCallback
      ? window.requestIdleCallback(enableScene)
      : window.setTimeout(enableScene, 150)

    function handleVisibilityChange() {
      setIsVisible(document.visibilityState !== 'hidden')
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      if (hasIdleCallback && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(schedule)
        return
      }
      window.clearTimeout(schedule)
    }
  }, [])

  if (!enabled || !isVisible) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
      <Suspense fallback={null}>
        <SceneInner />
      </Suspense>
    </div>
  )
}
