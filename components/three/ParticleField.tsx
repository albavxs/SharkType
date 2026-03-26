'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 600

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8

      vel[i * 3]     = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.002
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.001
    }

    return { positions: pos, velocities: vel }
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2

      positions[ix] += velocities[ix] + Math.sin(time * 0.5 + i) * 0.0005
      positions[iy] += velocities[iy] + Math.cos(time * 0.3 + i * 0.5) * 0.0005
      positions[iz] += velocities[iz]

      if (Math.abs(positions[ix]) > 10) velocities[ix] *= -1
      if (Math.abs(positions[iy]) > 6)  velocities[iy] *= -1
      if (Math.abs(positions[iz]) > 4)  velocities[iz] *= -1

      dummy.position.set(positions[ix], positions[iy], positions[iz])
      dummy.scale.setScalar(0.015)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.25} />
    </instancedMesh>
  )
}
