'use client'

import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'

type SceneVariant = 'default' | 'landing'

export default function SceneInner({
  color,
  variant = 'default',
  reducedMotion = false,
}: {
  color: string
  variant?: SceneVariant
  reducedMotion?: boolean
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={variant === 'landing' ? [1, 1.4] : [1, 1.5]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      {variant === 'landing' ? (
        <>
          <ParticleField color={color} variant="landing" layer="far" reducedMotion={reducedMotion} />
          <ParticleField color={color} variant="landing" layer="near" reducedMotion={reducedMotion} />
        </>
      ) : (
        <ParticleField color={color} reducedMotion={reducedMotion} />
      )}
    </Canvas>
  )
}
