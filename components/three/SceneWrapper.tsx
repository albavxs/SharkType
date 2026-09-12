'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'

const SceneInner = dynamic(() => import('./SceneInner'), { ssr: false })

type SceneVariant = 'default' | 'landing'

function canCreateWebGLContext() {
  const canvas = document.createElement('canvas')
  return Boolean(
    canvas.getContext('webgl2') ||
    canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl')
  )
}

export default function SceneWrapper({ variant = 'default' }: { variant?: SceneVariant }) {
  const [enabled, setEnabled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [accentColor, setAccentColor] = useState('#6366f1')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(media.matches)
    syncMotion()
    media.addEventListener('change', syncMotion)

    const syncAccent = () => {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--main').trim()
      if (color) setAccentColor(color)
    }

    const observer = new MutationObserver(syncAccent)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] })
    syncAccent()

    const enableScene = () => {
      setEnabled(canCreateWebGLContext())
      setIsVisible(document.visibilityState !== 'hidden')
      syncAccent()
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
      observer.disconnect()
      media.removeEventListener('change', syncMotion)
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
        <SceneInner color={accentColor} variant={variant} reducedMotion={reducedMotion} />
      </Suspense>
    </div>
  )
}
