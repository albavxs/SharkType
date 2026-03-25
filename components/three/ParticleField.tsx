'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleFieldProps {
  wpm?: number
  lastKeyTime?: number
  lastErrorTime?: number
}

export default function ParticleField({ wpm = 0, lastKeyTime = 0, lastErrorTime = 0 }: ParticleFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 600

  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8

      vel[i * 3] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001

      col[i * 3] = 0.39     // r (indigo)
      col[i * 3 + 1] = 0.4  // g
      col[i * 3 + 2] = 0.95 // b
    }

    return { positions: pos, velocities: vel, colors: col }
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const baseColor = useMemo(() => new THREE.Color(), [])

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.elapsedTime
    const now = Date.now()
    const keyRecent = now - lastKeyTime < 200
    const errorRecent = now - lastErrorTime < 300

    // Color based on WPM
    const wpmNorm = Math.min(wpm / 100, 1)
    // Blue (low) -> Purple (med) -> Indigo (high)
    const r = 0.39 + wpmNorm * 0.15
    const g = 0.4 - wpmNorm * 0.15
    const b = 0.95

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const iy = i * 3 + 1
      const iz = i * 3 + 2

      // Float animation
      positions[ix] += velocities[ix] + Math.sin(time * 0.5 + i) * 0.0005
      positions[iy] += velocities[iy] + Math.cos(time * 0.3 + i * 0.5) * 0.0005
      positions[iz] += velocities[iz]

      // Wrap around bounds
      if (Math.abs(positions[ix]) > 10) velocities[ix] *= -1
      if (Math.abs(positions[iy]) > 6) velocities[iy] *= -1
      if (Math.abs(positions[iz]) > 4) velocities[iz] *= -1

      dummy.position.set(positions[ix], positions[iy], positions[iz])

      // Scale pulse on keypress
      const baseSc = 0.015
      const pulse = keyRecent ? baseSc * 1.8 : baseSc
      dummy.scale.setScalar(pulse)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      // Color
      if (errorRecent) {
        baseColor.setRGB(1, 0.23, 0.19) // red flash
      } else {
        baseColor.setRGB(r, g, b)
      }
      meshRef.current.setColorAt(i, baseColor)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial transparent opacity={0.3} />
    </instancedMesh>
  )
}
