'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type SceneVariant = 'default' | 'landing'
type ParticleLayer = 'default' | 'far' | 'near'

interface ParticleFieldProps {
  color?: string
  variant?: SceneVariant
  layer?: ParticleLayer
  reducedMotion?: boolean
}

export default function ParticleField({
  color = '#6366f1',
  variant = 'default',
  layer = 'default',
  reducedMotion = false,
}: ParticleFieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = variant === 'landing'
    ? layer === 'near' ? 420 : 760
    : 600

  const { positions, velocities, scales } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = new Float32Array(count * 3)
    const particleScales = new Float32Array(count)
    const landing = variant === 'landing'
    const spreadX = landing ? 23 : 20
    const spreadY = landing ? 14 : 12
    const spreadZ = landing ? 10 : 8

    for (let i = 0; i < count; i++) {
      const concentration = landing && i % 3 !== 0 ? 0.72 : 1
      pos[i * 3] = (Math.random() - 0.5) * spreadX * concentration
      pos[i * 3 + 1] = (Math.random() - 0.5) * spreadY * concentration
      pos[i * 3 + 2] = (Math.random() - 0.5) * spreadZ

      const speed = landing
        ? layer === 'near' ? 0.0028 : 0.00145
        : 0.002
      vel[i * 3] = (Math.random() - 0.5) * speed
      vel[i * 3 + 1] = (Math.random() - 0.5) * speed
      vel[i * 3 + 2] = (Math.random() - 0.5) * speed * 0.55

      particleScales[i] = landing
        ? layer === 'near' ? 0.018 + Math.random() * 0.015 : 0.009 + Math.random() * 0.009
        : 0.015
    }

    return { positions: pos, velocities: vel, scales: particleScales }
  }, [count, layer, variant])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state, delta) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime
    const landing = variant === 'landing'

    if (landing && !reducedMotion) {
      const pointerStrength = layer === 'near' ? 0.42 : 0.14
      const scrollProgress = typeof window === 'undefined'
        ? 0
        : Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.6)
      const scrollY = layer === 'near' ? -scrollProgress * 0.9 : -scrollProgress * 0.28
      const scrollZ = layer === 'near' ? scrollProgress * 0.22 : scrollProgress * 0.06

      meshRef.current.position.x = THREE.MathUtils.damp(
        meshRef.current.position.x,
        state.pointer.x * pointerStrength,
        3.5,
        delta,
      )
      meshRef.current.position.y = THREE.MathUtils.damp(
        meshRef.current.position.y,
        state.pointer.y * pointerStrength * 0.68 + scrollY,
        3.5,
        delta,
      )
      meshRef.current.position.z = THREE.MathUtils.damp(
        meshRef.current.position.z,
        scrollZ,
        3,
        delta,
      )
      meshRef.current.rotation.z = Math.sin(time * 0.08) * (layer === 'near' ? 0.008 : 0.003)
    }

    for (let i = 0; i < count; i++) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2

      if (!reducedMotion) {
        positions[ix] += velocities[ix] + Math.sin(time * 0.5 + i) * 0.00045
        positions[iy] += velocities[iy] + Math.cos(time * 0.3 + i * 0.5) * 0.00045
        positions[iz] += velocities[iz]
      }

      const limitX = variant === 'landing' ? 11.5 : 10
      const limitY = variant === 'landing' ? 7 : 6
      const limitZ = variant === 'landing' ? 5 : 4
      if (Math.abs(positions[ix]) > limitX) velocities[ix] *= -1
      if (Math.abs(positions[iy]) > limitY) velocities[iy] *= -1
      if (Math.abs(positions[iz]) > limitZ) velocities[iz] *= -1

      dummy.position.set(positions[ix], positions[iy], positions[iz])
      dummy.scale.setScalar(scales[i])
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  const opacity = variant === 'landing'
    ? layer === 'near' ? 0.42 : 0.22
    : 0.25

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </instancedMesh>
  )
}
