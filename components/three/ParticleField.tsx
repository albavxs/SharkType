'use client'

import { useRef } from 'react'
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

type ParticleData = {
  positions: Float32Array
  velocities: Float32Array
  scales: Float32Array
}

function seededUnit(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function createParticleData(count: number, variant: SceneVariant, layer: ParticleLayer): ParticleData {
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const landing = variant === 'landing'
  const spreadX = landing ? 23 : 20
  const spreadY = landing ? 14 : 12
  const spreadZ = landing ? 10 : 8

  for (let i = 0; i < count; i++) {
    const concentration = landing && i % 3 !== 0 ? 0.72 : 1
    positions[i * 3] = (seededUnit(i, 1) - 0.5) * spreadX * concentration
    positions[i * 3 + 1] = (seededUnit(i, 2) - 0.5) * spreadY * concentration
    positions[i * 3 + 2] = (seededUnit(i, 3) - 0.5) * spreadZ

    const speed = landing
      ? layer === 'near' ? 0.0028 : 0.00145
      : 0.002
    velocities[i * 3] = (seededUnit(i, 4) - 0.5) * speed
    velocities[i * 3 + 1] = (seededUnit(i, 5) - 0.5) * speed
    velocities[i * 3 + 2] = (seededUnit(i, 6) - 0.5) * speed * 0.55

    scales[i] = landing
      ? layer === 'near'
        ? 0.018 + seededUnit(i, 7) * 0.015
        : 0.009 + seededUnit(i, 8) * 0.009
      : 0.015
  }

  return { positions, velocities, scales }
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
  const particleDataRef = useRef<ParticleData>(createParticleData(count, variant, layer))
  const dummyRef = useRef(new THREE.Object3D())

  useFrame((state, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    const { positions, velocities, scales } = particleDataRef.current
    const dummy = dummyRef.current
    const time = state.clock.elapsedTime
    const landing = variant === 'landing'

    if (landing && !reducedMotion) {
      const pointerStrength = layer === 'near' ? 0.42 : 0.14
      let scrollProgress = 0

      if (typeof window !== 'undefined') {
        const community = document.getElementById('community')
        const heroEnd = community?.offsetTop ?? window.innerHeight * 1.3
        const scrollRange = Math.max(heroEnd - window.innerHeight, 1)
        scrollProgress = THREE.MathUtils.clamp(window.scrollY / scrollRange, 0, 1)
      }

      const scrollY = layer === 'near' ? -scrollProgress * 1.15 : -scrollProgress * 0.32
      const scrollZ = layer === 'near' ? scrollProgress * 0.3 : scrollProgress * 0.07

      mesh.position.x = THREE.MathUtils.damp(mesh.position.x, state.pointer.x * pointerStrength, 3.5, delta)
      mesh.position.y = THREE.MathUtils.damp(
        mesh.position.y,
        state.pointer.y * pointerStrength * 0.68 + scrollY,
        3.5,
        delta,
      )
      mesh.position.z = THREE.MathUtils.damp(mesh.position.z, scrollZ, 3, delta)
      mesh.rotation.z = Math.sin(time * 0.08) * (layer === 'near' ? 0.008 : 0.003)
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
      mesh.setMatrixAt(i, dummy.matrix)
    }

    mesh.instanceMatrix.needsUpdate = true
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
