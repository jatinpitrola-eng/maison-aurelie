'use client'

import * as THREE from 'three'
import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei'
import { Headphones } from './headphones'
import { Particles } from './particles'
import { scrollState } from '@/lib/product-store'

/* ------------------------- scroll keyframe choreography ------------------------ */

interface Key {
  t: number
  pos: [number, number, number]
  rot: [number, number, number]
  s: number
}

const KEYS: Key[] = [
  { t: 0.0, pos: [0, -0.06, 0], rot: [0.05, -0.4, 0], s: 1.0 }, // hero — front, slight angle
  { t: 0.16, pos: [0.62, -0.02, 0], rot: [0.06, -2.2, 0], s: 0.96 }, // ANC — right profile
  { t: 0.34, pos: [-0.62, 0.02, 0], rot: [0.03, -3.6, 0], s: 0.96 }, // driver — other profile + exploded
  { t: 0.54, pos: [0, 0.16, 0.35], rot: [0.42, -4.3, 0], s: 1.16 }, // material — close-up, tilted
  { t: 0.72, pos: [0, -0.02, 0], rot: [0.04, -6.6, 0], s: 1.0 }, // colors — full turn, front
  { t: 1.0, pos: [0, -0.1, 0], rot: [0.06, -6.15, 0], s: 1.04 }, // CTA — face on
]

const smoother = (k: number) => k * k * k * (k * (k * 6 - 15) + 10)

const out = { pos: [0, 0, 0] as number[], rot: [0, 0, 0] as number[], s: 1 }

function sample(p: number) {
  let i = 0
  while (i < KEYS.length - 2 && p > KEYS[i + 1].t) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const k = smoother(Math.min(1, Math.max(0, (p - a.t) / (b.t - a.t))))
  for (let j = 0; j < 3; j++) {
    out.pos[j] = a.pos[j] + (b.pos[j] - a.pos[j]) * k
    out.rot[j] = a.rot[j] + (b.rot[j] - a.rot[j]) * k
  }
  out.s = a.s + (b.s - a.s) * k
  return out
}

/* --------------------------------- fit scale -------------------------------- */

function useFit() {
  const { size } = useThree()
  return useMemo(() => {
    const aspect = size.width / Math.max(1, size.height)
    // shrink the product on narrow / portrait screens so it always fits
    return Math.min(1, Math.max(0.46, aspect * 1.02))
  }, [size])
}

/* ----------------------------------- rig ------------------------------------ */

function Rig({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const fit = useFit()

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05)
    const g = ref.current
    if (!g) return

    const target = sample(scrollState.progress)
    const t = state.clock.elapsedTime
    const damp = THREE.MathUtils.damp

    // idle bob + pointer parallax
    const tx = target.pos[0] + state.pointer.x * 0.1
    const ty = target.pos[1] + Math.sin(t * 0.9) * 0.03 + state.pointer.y * 0.05

    g.position.x = damp(g.position.x, tx, 4, d)
    g.position.y = damp(g.position.y, ty, 4, d)
    g.position.z = damp(g.position.z, target.pos[2], 4, d)

    g.rotation.x = damp(g.rotation.x, target.rot[0] + state.pointer.y * 0.07, 4, d)
    g.rotation.y = damp(g.rotation.y, target.rot[1] + state.pointer.x * 0.16, 4, d)
    g.rotation.z = damp(g.rotation.z, target.rot[2], 4, d)

    g.scale.setScalar(damp(g.scale.x, fit * target.s, 4, d))

    // subtle camera drift
    const cam = state.camera
    cam.position.x = damp(cam.position.x, state.pointer.x * 0.18, 2.2, d)
    cam.position.y = damp(cam.position.y, 0.25 + state.pointer.y * 0.12, 2.2, d)
    cam.lookAt(0, 0, 0)
  })

  return (
    <group ref={ref} scale={fit}>
      {children}
    </group>
  )
}

/* ------------------------------ adaptive ground ----------------------------- */

function Ground() {
  const fit = useFit()
  return (
    <ContactShadows
      position={[0, -1.35 * fit - 0.25, 0]}
      opacity={0.55}
      scale={11}
      blur={2.8}
      far={3.4}
      color="#000000"
    />
  )
}

/* ---------------------------------- scene ----------------------------------- */

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.25, 4.6], fov: 38 }}
      >
        <Suspense fallback={null}>
          {/* key / rim / fill lights */}
          <ambientLight intensity={0.14} />
          <directionalLight position={[4, 5, 5]} intensity={1.5} color="#fff1e0" />
          <directionalLight position={[-5, 2, -4]} intensity={0.55} color="#ffcf9e" />
          <pointLight position={[0, -1.4, 3.2]} intensity={5} distance={9} color="#ffffff" />

          <Rig>
            <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.55} floatingRange={[-0.04, 0.04]}>
              <Headphones />
            </Float>
          </Rig>

          <Particles />
          <Ground />

          {/* locally-rendered studio environment — zero network requests */}
          <Environment resolution={256} frames={1}>
            <Lightformer intensity={3.2} position={[0, 4.5, 1]} rotation-x={Math.PI / 2} scale={[9, 9, 1]} color="#ffffff" />
            <Lightformer intensity={1.6} position={[-4, 1, -1]} rotation-y={Math.PI / 2} scale={[7, 1.6, 1]} color="#ffe6c4" />
            <Lightformer intensity={1.6} position={[4, 1, 0]} rotation-y={-Math.PI / 2} scale={[7, 1.6, 1]} color="#fff3e0" />
            <Lightformer intensity={0.9} position={[0, 1.5, 4.5]} scale={[6, 2.4, 1]} color="#ffffff" />
            <Lightformer form="ring" intensity={1.2} position={[0, 0.5, -4]} scale={2.4} color="#ffb45e" />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  )
}
