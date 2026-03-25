'use client'

import { Canvas } from '@react-three/fiber'
import ParticleField from './ParticleField'

interface SceneInnerProps {
  wpm?: number
  lastKeyTime?: number
  lastErrorTime?: number
}

export default function SceneInner({ wpm = 0, lastKeyTime = 0, lastErrorTime = 0 }: SceneInnerProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      gl={{ alpha: true }}
    >
      <ParticleField wpm={wpm} lastKeyTime={lastKeyTime} lastErrorTime={lastErrorTime} />
    </Canvas>
  )
}
