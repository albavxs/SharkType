'use client'

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

type PlanKey = 'monthly' | 'quarterly' | 'semiannual' | 'annual'

interface PlusPlanSceneProps {
  selectedPlan: PlanKey
}

const PLAN_INDEX: Record<PlanKey, number> = {
  monthly: 0,
  quarterly: 1,
  semiannual: 2,
  annual: 3,
}

function PlanCore({ selectedPlan, reducedMotion }: { selectedPlan: PlanKey; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const { pointer } = useThree()
  const selectedIndex = PLAN_INDEX[selectedPlan]

  useFrame((state, delta) => {
    if (!groupRef.current || !ringRef.current) return

    const targetRotation = selectedIndex * (Math.PI / 8)
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotation, 4, delta)

    if (!reducedMotion) {
      groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, pointer.y * 0.12, 3, delta)
      groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, pointer.x * 0.18, 3, delta)
      ringRef.current.rotation.z += delta * 0.08
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08
    }
  })

  const nodes = [
    [-2.7, 1.25, -0.3],
    [2.7, 1.25, -0.3],
    [-2.7, -1.25, -0.3],
    [2.7, -1.25, -0.3],
  ] as const

  return (
    <group ref={groupRef}>
      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.15} floatIntensity={reducedMotion ? 0 : 0.35}>
        <mesh>
          <icosahedronGeometry args={[0.82, 2]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={1.35} roughness={0.28} metalness={0.18} transparent opacity={0.82} />
        </mesh>
      </Float>

      <mesh ref={ringRef} rotation={[1.08, 0.22, 0]}>
        <torusGeometry args={[2.25, 0.018, 8, 160]} />
        <meshBasicMaterial color="#ec4899" transparent opacity={0.22} />
      </mesh>

      <mesh rotation={[0.5, -0.35, 0.5]}>
        <torusGeometry args={[3.15, 0.012, 8, 160]} />
        <meshBasicMaterial color="#6366f1" transparent opacity={0.12} />
      </mesh>

      {nodes.map((position, index) => {
        const active = index === selectedIndex
        return (
          <Float key={index} speed={reducedMotion ? 0 : 1 + index * 0.12} floatIntensity={reducedMotion ? 0 : 0.22} rotationIntensity={0}>
            <mesh position={position} scale={active ? 1.22 : 0.78}>
              <sphereGeometry args={[0.19, 20, 20]} />
              <meshStandardMaterial
                color={active ? '#ec4899' : '#6366f1'}
                emissive={active ? '#ec4899' : '#6366f1'}
                emissiveIntensity={active ? 1.4 : 0.5}
                transparent
                opacity={active ? 0.9 : 0.42}
              />
            </mesh>
          </Float>
        )
      })}
    </group>
  )
}

function ParticleCloud({ reducedMotion }: { reducedMotion: boolean }) {
  const pointsRef = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 180
    const values = new Float32Array(count * 3)
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 10
      values[index * 3 + 1] = (Math.random() - 0.5) * 6
      values[index * 3 + 2] = (Math.random() - 0.5) * 5
    }
    return values
  }, [])

  useFrame((_, delta) => {
    if (!pointsRef.current || reducedMotion) return
    pointsRef.current.rotation.y += delta * 0.012
    pointsRef.current.rotation.x += delta * 0.004
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#a78bfa" size={0.035} sizeAttenuation transparent opacity={0.32} depthWrite={false} />
    </points>
  )
}

export default function PlusPlanScene({ selectedPlan }: PlusPlanSceneProps) {
  const [enabled, setEnabled] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const canvas = document.createElement('canvas')
    const hasWebGl = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))

    setEnabled(hasWebGl)
    setReducedMotion(motionQuery.matches)

    const handleMotionChange = () => setReducedMotion(motionQuery.matches)
    motionQuery.addEventListener('change', handleMotionChange)
    return () => motionQuery.removeEventListener('change', handleMotionChange)
  }, [])

  if (!enabled) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.12),transparent_56%)]" />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 7.5], fov: 44 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'low-power' }}
      >
        <ambientLight intensity={0.45} />
        <pointLight position={[0, 0, 4]} intensity={5} color="#7c3aed" />
        <pointLight position={[3, 2, 2]} intensity={3} color="#ec4899" />
        <ParticleCloud reducedMotion={reducedMotion} />
        <PlanCore selectedPlan={selectedPlan} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
