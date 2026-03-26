'use client'

import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'

export default function SceneInner() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ alpha: true }}
    >
      <ParticleField />
    </Canvas>
  )
}
