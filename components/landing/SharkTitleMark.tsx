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
  const glow = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()
  const accent = useMemo(() => new THREE.Color(color), [color])

  const orbitPositionsA = useMemo(() => {
    const values = new Float32Array(42 * 3)
    for (let i = 0; i < 42; i += 1) {
      const angle = (i / 42) * Math.PI * 2
      const radius = 1.12 + (i % 5) * 0.028
      values[i * 3] = Math.cos(angle) * radius
      values[i * 3 + 1] = Math.sin(angle) * radius * 0.88
      values[i * 3 + 2] = -0.15 + (i % 6) * 0.02
    }
    return values
  }, [])

  const orbitPositionsB = useMemo(() => {
    const values = new Float32Array(24 * 3)
    for (let i = 0; i < 24; i += 1) {
      const angle = (i / 24) * Math.PI * 2 + 0.25
      const radius = 1.34 + (i % 3) * 0.03
      values[i * 3] = Math.cos(angle) * radius
      values[i * 3 + 1] = Math.sin(angle) * radius * 0.72
      values[i * 3 + 2] = -0.28 + (i % 4) * 0.025
    }
    return values
  }, [])

  useFrame((state, delta) => {
    if (!group.current) return

    const targetX = reducedMotion ? 0 : pointer.x * 0.06
    const targetY = reducedMotion ? 0 : pointer.y * 0.045
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetY, 5, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetX, 5, delta)

    if (!reducedMotion) {
      group.current.position.y = THREE.MathUtils.damp(
        group.current.position.y,
        Math.sin(state.clock.elapsedTime * 0.85) * 0.025,
        4,
        delta,
      )
      if (orbitA.current) orbitA.current.rotation.z += delta * 0.11
      if (orbitB.current) orbitB.current.rotation.z -= delta * 0.075
      if (glow.current) {
        const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.25) * 0.045
        glow.current.scale.setScalar(pulse)
      }
    }
  })

  return (
    <group ref={group}>
      <mesh ref={glow} position={[0, 0, -0.55]}>
        <circleGeometry args={[0.92, 64]} />
        <meshBasicMaterial color={accent} transparent opacity={0.09} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, -0.38]} rotation={[0, 0, 0.18]}>
        <torusGeometry args={[1.12, 0.018, 8, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.32} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, -0.46]} rotation={[0, 0, -0.26]}>
        <torusGeometry args={[1.34, 0.008, 8, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.16} depthWrite={false} />
      </mesh>

      <points ref={orbitA}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[orbitPositionsA, 3]} />
        </bufferGeometry>
        <pointsMaterial color={accent} size={0.055} transparent opacity={0.72} depthWrite={false} sizeAttenuation />
      </points>

      <points ref={orbitB}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[orbitPositionsB, 3]} />
        </bufferGeometry>
        <pointsMaterial color={accent} size={0.038} transparent opacity={0.42} depthWrite={false} sizeAttenuation />
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
        <div className="pointer-events-none absolute inset-[-20%] z-0">
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

      <Image
        src={sharkLogo}
        alt=""
        priority
        className="relative z-10 h-full w-full object-contain"
        style={{ filter: 'drop-shadow(0 10px 24px color-mix(in srgb, var(--main) 20%, transparent))' }}
      />
    </div>
  )
}
