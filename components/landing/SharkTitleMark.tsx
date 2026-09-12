'use client'

import Image from 'next/image'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import sharkLogo from '@/icons/SharkSolo.png'

function canCreateWebGLContext() {
  const canvas = document.createElement('canvas')
  return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
}

function Mark({ color, reducedMotion }: { color: string; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const orbit = useRef<THREE.Points>(null)
  const texture = useTexture(sharkLogo.src)
  const { pointer } = useThree()
  const accent = useMemo(() => new THREE.Color(color), [color])
  const orbitPositions = useMemo(() => {
    const values = new Float32Array(36 * 3)
    for (let i = 0; i < 36; i += 1) {
      const a = (i / 36) * Math.PI * 2
      const r = 1.22 + (i % 4) * 0.035
      values[i * 3] = Math.cos(a) * r
      values[i * 3 + 1] = Math.sin(a) * r
      values[i * 3 + 2] = -0.22 + (i % 5) * 0.025
    }
    return values
  }, [])

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
  }, [texture])

  useFrame((state, delta) => {
    if (!group.current) return
    const rx = reducedMotion ? 0 : pointer.y * 0.08
    const ry = reducedMotion ? 0 : pointer.x * 0.12
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, rx, 5, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ry, 5, delta)
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.9) * 0.035,
      4,
      delta,
    )
    if (orbit.current && !reducedMotion) orbit.current.rotation.z += delta * 0.12
  })

  return (
    <group ref={group}>
      <mesh position={[-0.06, -0.07, -0.34]} scale={[2.42, 2.42, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} color={accent} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh position={[0.035, 0.025, -0.16]} scale={[2.3, 2.3, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} color="#ffffff" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0]} scale={[2.18, 2.18, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial map={texture} transparent roughness={0.7} metalness={0.05} depthWrite={false} />
      </mesh>
      <points ref={orbit}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[orbitPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={accent} size={0.055} transparent opacity={0.72} depthWrite={false} sizeAttenuation />
      </points>
      <pointLight position={[1.25, 1.1, 2]} color={accent} intensity={4.5} distance={5} />
      <ambientLight intensity={1.25} />
    </group>
  )
}

export default function SharkTitleMark({ themeSignal = '' }: { themeSignal?: string }) {
  const [enabled, setEnabled] = useState(false)
  const [color, setColor] = useState('#f92672')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener('change', sync)
    const frame = requestAnimationFrame(() => {
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--main').trim()
      if (accent) setColor(accent)
      setEnabled(canCreateWebGLContext())
    })
    return () => {
      cancelAnimationFrame(frame)
      media.removeEventListener('change', sync)
    }
  }, [themeSignal])

  if (!enabled) {
    return <Image src={sharkLogo} alt="" priority className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
  }

  return (
    <div className="h-16 w-16 shrink-0 sm:h-20 sm:w-20 lg:h-24 lg:w-24" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas camera={{ position: [0, 0, 4], fov: 42 }} dpr={[1, 1.4]} gl={{ alpha: true, antialias: true }}>
          <Mark color={color} reducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  )
}
