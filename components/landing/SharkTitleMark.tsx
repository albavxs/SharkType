'use client'

import Image from 'next/image'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import sharkLogo from '@/icons/SharkSolo.png'

function canCreateWebGLContext() {
  const canvas = document.createElement('canvas')
  return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
}

function MarkEffects({ color, reducedMotion }: { color: string; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const orbitA = useRef<THREE.Points>(null)
  const orbitB = useRef<THREE.Points>(null)
  const { pointer } = useThree()
  const accent = useMemo(() => new THREE.Color(color), [color])

  const orbitPositionsA = useMemo(() => {
    const values = new Float32Array(36 * 3)
    for (let i = 0; i < 36; i += 1) {
      const angle = (i / 36) * Math.PI * 2
      const radius = 1.08 + (i % 4) * 0.03
      values[i * 3] = Math.cos(angle) * radius
      values[i * 3 + 1] = Math.sin(angle) * radius * 0.82
      values[i * 3 + 2] = -0.15 + (i % 5) * 0.025
    }
    return values
  }, [])

  const orbitPositionsB = useMemo(() => {
    const values = new Float32Array(18 * 3)
    for (let i = 0; i < 18; i += 1) {
      const angle = (i / 18) * Math.PI * 2 + 0.35
      const radius = 1.28 + (i % 3) * 0.035
      values[i * 3] = Math.cos(angle) * radius
      values[i * 3 + 1] = Math.sin(angle) * radius * 0.68
      values[i * 3 + 2] = -0.25 + (i % 4) * 0.025
    }
    return values
  }, [])

  useFrame((state, delta) => {
    if (!group.current) return

    group.current.rotation.x = THREE.MathUtils.damp(
      group.current.rotation.x,
      reducedMotion ? 0 : pointer.y * 0.045,
      5,
      delta,
    )
    group.current.rotation.y = THREE.MathUtils.damp(
      group.current.rotation.y,
      reducedMotion ? 0 : pointer.x * 0.06,
      5,
      delta,
    )

    if (!reducedMotion) {
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        Math.sin(state.clock.elapsedTime * 0.8) * 0.022,
        4,
        delta,
      )
      if (orbitA.current) orbitA.current.rotation.z += delta * 0.09
      if (orbitB.current) orbitB.current.rotation.z -= delta * 0.055
    }
  })

  return (
    <group ref={group}>
      <points ref={orbitA}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[orbitPositionsA, 3]} />
        </bufferGeometry>
        <pointsMaterial color={accent} size={0.045} transparent opacity={0.55} depthWrite={false} sizeAttenuation />
      </points>

      <points ref={orbitB}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[orbitPositionsB, 3]} />
        </bufferGeometry>
        <pointsMaterial color={accent} size={0.03} transparent opacity={0.3} depthWrite={false} sizeAttenuation />
      </points>
    </group>
  )
}

export default function SharkTitleMark({ themeSignal = '' }: { themeSignal?: string }) {
  const [enabled, setEnabled] = useState(false)
  const [color, setColor] = useState('#f92672')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(media.matches)
    syncMotion()
    media.addEventListener('change', syncMotion)

    const frame = requestAnimationFrame(() => {
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--main').trim()
      if (accent) setColor(accent)
      setEnabled(canCreateWebGLContext())
    })

    return () => {
      cancelAnimationFrame(frame)
      media.removeEventListener('change', syncMotion)
    }
  }, [themeSignal])

  return (
    <div
      className="relative h-[72px] w-[72px] shrink-0 sm:h-[88px] sm:w-[88px] lg:h-[104px] lg:w-[104px]"
      aria-hidden="true"
    >
      {enabled ? (
        <div className="pointer-events-none absolute inset-[-14%] z-0">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 4], fov: 44 }}
              dpr={[1, 1.35]}
              gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
              style={{ width: '100%', height: '100%', background: 'transparent' }}
            >
              <MarkEffects color={color} reducedMotion={reducedMotion} />
            </Canvas>
          </Suspense>
        </div>
      ) : null}

      <Image src={sharkLogo} alt="" priority className="relative z-10 h-full w-full object-contain" />
    </div>
  )
}
