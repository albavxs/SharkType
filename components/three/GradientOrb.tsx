'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

interface GradientOrbProps {
  wpm?: number
}

export default function GradientOrb({ wpm = 0 }: GradientOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (!meshRef.current) return
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })

  const speed = 0.5 + Math.min(wpm / 80, 1) * 2
  const distort = 0.2 + Math.min(wpm / 80, 1) * 0.4

  return (
    <mesh ref={meshRef} position={[0, 0, -3]} scale={2.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        color="#6366f1"
        speed={speed}
        distort={distort}
        roughness={0.2}
        transparent
        opacity={0.15}
      />
    </mesh>
  )
}
