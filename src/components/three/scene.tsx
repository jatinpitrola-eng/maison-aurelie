'use client'

import * as THREE from 'three'
import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei'
import { Headphones } from './headphones'
import { Buds } from './buds'
import { Orb } from './orb'
import { Shards } from './shards'
import { Particles } from './particles'
import { Driver, scrollState, oneDriver, zeroDriver } from '@/lib/product-store'

/* ------------------------------ keyframe toolkit ----------------------------- */

interface Key {
  t: number
  pos: [number, number, number]
  rot: [number, number, number]
  s: number
}

interface Sampled {
  pos: [number, number, number]
  rot: [number, number, number]
  s: number
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (x: number, a: number, b: number) => {
  const k = clamp01((x - a) / (b - a))
  return k * k * (3 - 2 * k)
}
const smoother = (k: number) => k * k * k * (k * (k * 6 - 15) + 10)

function sampleKeys(keys: Key[], p: number, out: Sampled) {
  let i = 0
  while (i < keys.length - 2 && p > keys[i + 1].t) i++
  const a = keys[i]
  const b = keys[i + 1]
  const k = smoother(clamp01((p - a.t) / (b.t - a.t)))
  for (let j = 0; j < 3; j++) {
    out.pos[j] = a.pos[j] + (b.pos[j] - a.pos[j]) * k
    out.rot[j] = a.rot[j] + (b.rot[j] - a.rot[j]) * k
  }
  out.s = a.s + (b.s - a.s) * k
}

/* ---------------------------------- fit scale -------------------------------- */

function useFit() {
  const { size } = useThree()
  return useMemo(() => {
    const aspect = size.width / Math.max(1, size.height)
    return Math.min(1, Math.max(0.46, aspect * 1.02))
  }, [size])
}

/* -------------------------------- camera drift ------------------------------- */

function CameraDrift() {
  useFrame((state, delta) => {
    try {
    const d = Math.min(delta, 0.1)
    const cam = state.camera
    cam.position.x = THREE.MathUtils.damp(cam.position.x, state.pointer.x * 0.18, 2.2, d)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, 0.25 + state.pointer.y * 0.12, 2.2, d)
    cam.lookAt(0, 0, 0)
    } catch {
      /* never kill the render loop */
    }
  })
  return null
}

/* ------------------------- ground shadows + hero mat ------------------------- */

function Ground() {
  const fit = useFit()
  const group = useRef<THREE.Group>(null)
  useFrame(() => {
    const g = group.current
    if (!g) return
    // rise onto the hero mat while it is visible
    const fade = 1 - smooth(scrollState.progress, 0.02, 0.075)
    g.position.y = fade * 0.14
  })
  return (
    <group ref={group}>
      <ContactShadows
        position={[0, -1.35 * fit - 0.25, 0]}
        opacity={0.55}
        scale={11}
        blur={2.8}
        far={3.4}
        color="#000000"
      />
    </group>
  )
}

/** Oryzo-style green felt cutting mat under the product — hero only */
function HeroMat() {
  const ref = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  useFrame(() => {
    const m = matRef.current
    const mesh = ref.current
    if (!m || !mesh) return
    const o = 1 - smooth(scrollState.progress, 0.02, 0.075)
    m.opacity = o
    mesh.visible = o > 0.01
  })
  return (
    <mesh ref={ref} position={[0, -1.66, 0]} rotation-x={-Math.PI / 2} visible>
      <cylinderGeometry args={[2.9, 2.9, 0.05, 64]} />
      <meshStandardMaterial ref={matRef} color="#2e3d2c" roughness={1} metalness={0} transparent opacity={1} />
    </mesh>
  )
}

/* ------------------------------ X1 headphones rig ---------------------------- */
/* Product stays center-stage (Oryzo style); text flanks it. Exits by zooming
   through the camera. */

const X1_KEYS: Key[] = [
  { t: 0.0, pos: [0, -0.06, 0], rot: [0.05, -0.55, 0], s: 0.86 }, // hero — front, annotations
  { t: 0.1, pos: [0, 0.0, 0.1], rot: [0.06, -2.3, 0], s: 0.8 }, // ANC — profile
  { t: 0.2, pos: [0, 0.02, 0.1], rot: [0.03, -3.7, 0], s: 0.68 }, // acoustics — exploded
  { t: 0.3, pos: [0, 0.14, 0.3], rot: [0.4, -4.4, 0], s: 0.88 }, // design — close-up tilt
  { t: 0.4, pos: [0, -0.02, 0], rot: [0.04, -6.65, 0], s: 0.82 }, // colors — front after full turn
]

function X1Rig() {
  const ref = useRef<THREE.Group>(null)
  const driver = useRef(0)
  const fit = useFit()
  const out = useMemo<Sampled>(() => ({ pos: [0, 0, 0], rot: [0, 0, 0], s: 1 }), [])
  const [active, setActive] = useState(true)
  const activeRef = useRef(true)

  const WIN: [number, number] = [-0.01, 0.46]

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    const p = scrollState.progress
    const on = p >= WIN[0] - 0.03 && p <= WIN[1] + 0.05
    if (on !== activeRef.current) {
      activeRef.current = on
      setActive(on)
    }

    const g = ref.current
    if (!g) return

    // explode driver — peaks around the acoustics section
    driver.current = smooth(p, 0.155, 0.19) * (1 - smooth(p, 0.24, 0.31))

    if (!on) {
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 0.001, 6, d))
      return
    }

    const local = clamp01((p - WIN[0]) / (WIN[1] - WIN[0]))
    sampleKeys(X1_KEYS, p, out)
    const t = state.clock.elapsedTime
    const damp = THREE.MathUtils.damp

    // zoom THROUGH the camera on exit — cinematic hand-off to the next product
    const exitK = smooth(local, 0.9, 1)
    const kMul = 1 + exitK * 1.9
    const yOff = exitK * 0.7 + (1 - exitK) * 0
    const spin = exitK * 2.4
    const zOff = exitK * 2.4

    const tx = out.pos[0] + state.pointer.x * 0.08
    const ty = out.pos[1] + Math.sin(t * 0.9) * 0.03 + state.pointer.y * 0.05 + yOff

    g.position.x = damp(g.position.x, tx, 4, d)
    g.position.y = damp(g.position.y, ty, 4, d)
    g.position.z = damp(g.position.z, out.pos[2] + zOff, 4, d)
    g.rotation.x = damp(g.rotation.x, out.rot[0] + state.pointer.y * 0.06, 4, d)
    g.rotation.y = damp(g.rotation.y, out.rot[1] + spin + state.pointer.x * 0.14, 4, d)
    g.rotation.z = damp(g.rotation.z, out.rot[2], 4, d)
    g.scale.setScalar(damp(g.scale.x, fit * out.s * kMul, 4, d))
  })

  if (!active) return null
  return (
    <group ref={ref} scale={fit}>
      <Float speed={1.3} rotationIntensity={0.12} floatIntensity={0.55} floatingRange={[-0.04, 0.04]}>
        <Headphones driver={driver as Driver} />
      </Float>
    </group>
  )
}

/* --------------------------------- buds rig ---------------------------------- */

const BUDS_KEYS: Key[] = [
  { t: 0.6, pos: [0, -0.05, 0], rot: [0.03, -0.4, 0], s: 0.84 }, // intro — centered, lid cracking open
  { t: 0.7, pos: [0, -0.02, 0.15], rot: [0.05, 0.5, 0], s: 0.9 }, // tech — centered, open
]

function BudsRig() {
  const ref = useRef<THREE.Group>(null)
  const driver = useRef(0)
  const fit = useFit()
  const out = useMemo<Sampled>(() => ({ pos: [0, 0, 0], rot: [0, 0, 0], s: 1 }), [])
  const [active, setActive] = useState(false)
  const activeRef = useRef(false)

  const WIN: [number, number] = [0.5, 0.72]

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    const p = scrollState.progress
    const on = p >= WIN[0] - 0.03 && p <= WIN[1] + 0.05
    if (on !== activeRef.current) {
      activeRef.current = on
      setActive(on)
    }

    const g = ref.current
    if (!g) return

    const local = clamp01((p - WIN[0]) / (WIN[1] - WIN[0]))
    // lid opens between the intro and tech sections
    driver.current = on ? smooth(local, 0.22, 0.55) : 0

    if (!on) {
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 0.001, 6, d))
      return
    }

    sampleKeys(BUDS_KEYS, p, out)
    const t = state.clock.elapsedTime
    const damp = THREE.MathUtils.damp

    // rise in from below, zoom through camera on exit
    const enter = smooth(local, 0, 0.14)
    const exitK = smooth(local, 0.9, 1)
    const kMul = 0.12 + 0.88 * enter + exitK * 1.9
    const yOff = (1 - enter) * -1.2 + exitK * 0.7
    const spin = (1 - enter) * 1.1 + exitK * 2.4
    const zOff = exitK * 2.4

    const tx = out.pos[0] + state.pointer.x * 0.08
    const ty = out.pos[1] + Math.sin(t * 1.05) * 0.035 + state.pointer.y * 0.05 + yOff

    g.position.x = damp(g.position.x, tx, 4, d)
    g.position.y = damp(g.position.y, ty, 4, d)
    g.position.z = damp(g.position.z, out.pos[2] + zOff, 4, d)
    g.rotation.x = damp(g.rotation.x, out.rot[0] + state.pointer.y * 0.06, 4, d)
    g.rotation.y = damp(g.rotation.y, out.rot[1] + spin + state.pointer.x * 0.14, 4, d)
    g.rotation.z = damp(g.rotation.z, out.rot[2], 4, d)
    g.scale.setScalar(damp(g.scale.x, fit * out.s * kMul, 4, d))
  })

  if (!active) return null
  return (
    <group ref={ref} scale={0.001}>
      <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.5} floatingRange={[-0.04, 0.04]}>
        <Buds driver={driver as Driver} />
      </Float>
    </group>
  )
}

/* ---------------------------------- orb rig ---------------------------------- */

const ORB_KEYS: Key[] = [
  { t: 0.8, pos: [0, -0.05, 0], rot: [0.02, -0.3, 0], s: 0.92 }, // intro — centered
  { t: 0.9, pos: [0, 0, 0.35], rot: [0.05, 0.35, 0], s: 1.02 }, // tech — closer
]

function OrbRig() {
  const ref = useRef<THREE.Group>(null)
  const pulse = useRef(0)
  const fit = useFit()
  const out = useMemo<Sampled>(() => ({ pos: [0, 0, 0], rot: [0, 0, 0], s: 1 }), [])
  const [active, setActive] = useState(false)
  const activeRef = useRef(false)

  const WIN: [number, number] = [0.72, 0.92]

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    const p = scrollState.progress
    const on = p >= WIN[0] - 0.03 && p <= WIN[1] + 0.05
    if (on !== activeRef.current) {
      activeRef.current = on
      setActive(on)
    }

    const g = ref.current
    if (!g) return

    const local = clamp01((p - WIN[0]) / (WIN[1] - WIN[0]))
    pulse.current = on ? smooth(local, 0.1, 0.3) : 0

    if (!on) {
      g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 0.001, 6, d))
      return
    }

    sampleKeys(ORB_KEYS, p, out)
    const t = state.clock.elapsedTime
    const damp = THREE.MathUtils.damp

    const enter = smooth(local, 0, 0.14)
    const exitK = smooth(local, 0.9, 1)
    const kMul = 0.12 + 0.88 * enter + exitK * 1.9
    const yOff = (1 - enter) * -1.2 + exitK * 0.7
    const spin = (1 - enter) * 1.1 + exitK * 2.4
    const zOff = exitK * 2.4

    const tx = out.pos[0] + state.pointer.x * 0.08
    const ty = out.pos[1] + Math.sin(t * 0.8) * 0.04 + state.pointer.y * 0.05 + yOff

    g.position.x = damp(g.position.x, tx, 4, d)
    g.position.y = damp(g.position.y, ty, 4, d)
    g.position.z = damp(g.position.z, out.pos[2] + zOff, 4, d)
    g.rotation.x = damp(g.rotation.x, out.rot[0] + state.pointer.y * 0.06, 4, d)
    g.rotation.y = damp(g.rotation.y, out.rot[1] + spin + state.pointer.x * 0.14, 4, d)
    g.rotation.z = damp(g.rotation.z, out.rot[2], 4, d)
    g.scale.setScalar(damp(g.scale.x, fit * out.s * kMul, 4, d))
  })

  if (!active) return null
  return (
    <group ref={ref} scale={0.001}>
      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.6} floatingRange={[-0.05, 0.05]}>
        <Orb pulse={pulse as Driver} />
      </Float>
    </group>
  )
}

/* ------------------------------ finale lineup -------------------------------- */

function Finale() {
  const ref = useRef<THREE.Group>(null)
  const fit = useFit()
  const [active, setActive] = useState(false)
  const activeRef = useRef(false)

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    const p = scrollState.progress
    const on = p >= 0.9
    if (on !== activeRef.current) {
      activeRef.current = on
      setActive(on)
    }

    const g = ref.current
    if (!g) return

    const k = smooth(p, 0.925, 0.98)
    const t = state.clock.elapsedTime
    const damp = THREE.MathUtils.damp

    if (!on) {
      g.scale.setScalar(damp(g.scale.x, 0.001, 6, d))
      return
    }

    g.position.y = damp(g.position.y, (1 - k) * -1.3, 4, d)
    g.rotation.y = damp(g.rotation.y, Math.sin(t * 0.18) * 0.12 + state.pointer.x * 0.12, 2.5, d)
    g.scale.setScalar(damp(g.scale.x, fit * (0.2 + 0.8 * k), 4, d))
  })

  if (!active) return null
  return (
    <group ref={ref} scale={0.001} position={[0, -1.3, 0]}>
      <group position={[-1.42, -0.48, 0]} scale={0.48}>
        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.4}>
          <Headphones driver={zeroDriver} />
        </Float>
      </group>
      <group position={[0.02, -0.58, 0.15]} scale={0.58}>
        <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.45}>
          <Buds driver={oneDriver} />
        </Float>
      </group>
      <group position={[1.42, -0.52, 0]} scale={0.46}>
        <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.5}>
          <Orb pulse={oneDriver} />
        </Float>
      </group>
    </group>
  )
}

/* ---------------------------------- scene ------------------------------------ */

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0.25, 4.6], fov: 38 }}
        onCreated={({ scene, camera }) => {
          const w = window as unknown as { __auraScene?: THREE.Scene; __auraCam?: THREE.Camera }
          w.__auraScene = scene
          w.__auraCam = camera
        }}
      >
        <Suspense fallback={null}>
          {/* depth haze — products & shards fade into the dark */}
          <fogExp2 attach="fog" args={['#0f0a07', 0.042]} />

          {/* key / rim / fill lights */}
          <ambientLight intensity={0.14} />
          <directionalLight position={[4, 5, 5]} intensity={1.5} color="#fff1e0" />
          <directionalLight position={[-5, 2, -4]} intensity={0.55} color="#ffcf9e" />
          <pointLight position={[0, -1.4, 3.2]} intensity={5} distance={9} color="#ffffff" />

          <X1Rig />
          <BudsRig />
          <OrbRig />
          <Finale />

          <Particles />
          <Shards />
          <HeroMat />
          <Ground />

          {/* locally-rendered studio environment — zero network requests */}
          <Environment resolution={256} frames={1}>
            <Lightformer intensity={3.2} position={[0, 4.5, 1]} rotation-x={Math.PI / 2} scale={[9, 9, 1]} color="#ffffff" />
            <Lightformer intensity={1.6} position={[-4, 1, -1]} rotation-y={Math.PI / 2} scale={[7, 1.6, 1]} color="#ffe6c4" />
            <Lightformer intensity={1.6} position={[4, 1, 0]} rotation-y={-Math.PI / 2} scale={[7, 1.6, 1]} color="#fff3e0" />
            <Lightformer intensity={0.9} position={[0, 1.5, 4.5]} scale={[6, 2.4, 1]} color="#ffffff" />
            <Lightformer form="ring" intensity={1.2} position={[0, 0.5, -4]} scale={2.4} color="#ffb45e" />
          </Environment>

          <CameraDrift />
        </Suspense>
      </Canvas>
    </div>
  )
}
