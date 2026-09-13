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

function HeroParticles({ color, reducedMotion }: { color: string; reducedMotion: boolean }) {
  const points = useRef<THREE.Points>(null)
  const { pointer } = useThree()
  const positions = useMemo(() => {
    const values = new Float32Array(54 * 3)
    for (let index = 0; index < 54; index += 1) {
      const offset = index * 3
      const angle = index * 2.399963229728653
      const radius = 1.5 + ((index * 37) % 100) / 55
      values[offset] = Math.cos(angle) * radius
      values[offset + 1] = Math.sin(angle) * radius * 0.72
      values[offset + 2] = -0.8 + ((index * 19) % 100) / 45
    }
    return values
  }, [])

  useFrame((state, delta) => {
    if (!points.current || reducedMotion) return
    points.current.rotation.z += delta * 0.018
    points.current.position.x = THREE.MathUtils.damp(points.current.position.x, pointer.x * 0.18, 4, delta)
    points.current.position.y = THREE.MathUtils.damp(points.current.position.y, pointer.y * 0.12, 4, delta)
    points.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.05
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.035} transparent opacity={0.58} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function SharkMark({ color, reducedMotion }: { color: string; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null)
  const halo = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()
  const texture = useTexture(sharkLogo.src)
  const accent = useMemo(() => new THREE.Color(color), [color])

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true
  }, [texture])

  useFrame((state, delta) => {
    if (!group.current) return

    const targetRotationX = reducedMotion ? 0 : pointer.y * 0.055
    const targetRotationY = reducedMotion ? 0 : pointer.x * 0.095
    const targetX = reducedMotion ? 0 : pointer.x * 0.13
    const targetY = reducedMotion ? 0 : pointer.y * 0.09

    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetRotationX, 5, delta)
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetRotationY, 5, delta)
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, targetX, 4, delta)
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY + (reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.7) * 0.055),
      4,
      delta,
    )

    if (halo.current && !reducedMotion) {
      halo.current.rotation.z -= delta * 0.07
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.25) * 0.035
      halo.current.scale.setScalar(pulse)
    }
  })

  return (
    <group ref={group}>
      <mesh ref={halo} position={[0, 0, -0.5]} rotation={[0, 0, 0.12]}>
        <torusGeometry args={[1.45, 0.012, 8, 96]} />
        <meshBasicMaterial color={accent} transparent opacity={0.36} depthWrite={false} />
      </mesh>

      <mesh position={[-0.08, -0.08, -0.32]} scale={[3.08, 3.08, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} color={accent} transparent opacity={0.17} depthWrite={false} />
      </mesh>

      <mesh position={[0.04, 0.02, -0.14]} scale={[2.94, 2.94, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} color="#ffffff" transparent opacity={0.2} depthWrite={false} />
      </mesh>

      <mesh position={[0, 0, 0.04]} scale={[2.82, 2.82, 1]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={texture}
          transparent
          roughness={0.72}
          metalness={0.04}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight position={[1.5, 1.2, 2.5]} intensity={5} distance={7} color={accent} />
      <pointLight position={[-1.5, -1, 2]} intensity={2.2} distance={6} color="#ffffff" />
    </group>
  )
}

function Scene({ color, reducedMotion }: { color: string; reducedMotion: boolean }) {
  return (
    <>
      <ambientLight intensity={1.3} />
      <HeroParticles color={color} reducedMotion={reducedMotion} />
      <SharkMark color={color} reducedMotion={reducedMotion} />
    </>
  )
}

export default function LandingHeroScene({ themeSignal = '' }: { themeSignal?: string }) {
  const [enabled, setEnabled] = useState(false)
  const [accentColor, setAccentColor] = useState('#e52f72')
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setReducedMotion(media.matches)
    syncMotion()
    media.addEventListener('change', syncMotion)

    const frame = window.requestAnimationFrame(() => {
      const cssColor = getComputedStyle(document.documentElement).getPropertyValue('--main').trim()
      if (cssColor) setAccentColor(cssColor)
      setEnabled(canCreateWebGLContext())
    })

    return () => {
      window.cancelAnimationFrame(frame)
      media.removeEventListener('change', syncMotion)
    }
  }, [themeSignal])

  if (!enabled) {
    return (
      <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
        <Image src={sharkLogo} alt="" priority className="h-auto w-[58%] max-w-[300px] opacity-90" />
      </div>
    )
  }

  return (
    <div className="h-full w-full" aria-hidden="true">
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 48 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{ width: '100%', height: '100%', background: 'transparent' }}
        >
          <Scene color={accentColor} reducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>
    </div>
  )
}
