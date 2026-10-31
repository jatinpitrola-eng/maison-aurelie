'use client'

import * as THREE from 'three'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { RingPiece, NecklacePiece, EarringsPiece, BanglePiece, TiaraPiece } from './pieces'
import { Dust } from './dust'
import { useMetalLerp } from './gems'
import { pointerState, scrollState, useJewelryStore } from '@/lib/jewelry-store'

/* ------------------------------ keyframe toolkit ----------------------------- */

const IVORY = new THREE.Color('#F4EEE1')
const ESPRESSO = new THREE.Color('#17120D')

const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smooth = (x: number, a: number, b: number) => {
  const k = clamp01((x - a) / (b - a))
  return k * k * (3 - 2 * k)
}
const smoother = (k: number) => k * k * k * (k * (k * 6 - 15) + 10)

/* -------------------------------- window pointer ------------------------------ */

function useWindowPointer() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerState.x = (e.clientX / window.innerWidth) * 2 - 1
      pointerState.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}

/* -------------------------------- camera journey ------------------------------ */

interface CamKey {
  t: number
  pos: [number, number, number]
  tgt: [number, number, number]
}

const KEYS: CamKey[] = [
  { t: 0.0, pos: [-0.62, 0.16, 4.5], tgt: [-0.62, 0.12, 0] }, // hero — ring right of the copy
  { t: 0.167, pos: [2.3, 0.75, 3.35], tgt: [0.72, 0.16, 0] }, // ring — piece left, copy right
  { t: 0.333, pos: [7.7, 0.5, 1.6], tgt: [6.5, -0.1, -3] }, // necklace — piece right, copy left
  { t: 0.5, pos: [13.2, 0.3, 3.5], tgt: [15.05, 0.05, 0] }, // earrings — piece left, copy right
  { t: 0.667, pos: [21.4, 1.5, 2.2], tgt: [20.5, 0.05, -3] }, // bangle — piece right, switcher left
  { t: 0.833, pos: [28.95, -0.15, 5.7], tgt: [28, 0.28, 0] }, // tiara — low, centered
  { t: 1.0, pos: [28.35, 0.3, 7.4], tgt: [28.1, 0.1, 0] }, // drift out
]

function CameraRig() {
  useWindowPointer()
  const { size } = useThree()
  const fit = useRef(1)
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    fit.current = aspect < 0.72 ? Math.min(1.9, 0.72 / aspect) : 1
  }, [size])

  const tgt = useRef(new THREE.Vector3(-0.62, 0.12, 0))
  const tp = useRef(new THREE.Vector3())
  const tt = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    const p = clamp01(scrollState.progress)

    let i = 0
    while (i < KEYS.length - 2 && p > KEYS[i + 1].t) i++
    const a = KEYS[i]
    const b = KEYS[i + 1]
    const k = smoother(clamp01((p - a.t) / (b.t - a.t)))

    const ttv = tt.current
    const tpv = tp.current

    ttv.set(
      a.tgt[0] + (b.tgt[0] - a.tgt[0]) * k,
      a.tgt[1] + (b.tgt[1] - a.tgt[1]) * k,
      a.tgt[2] + (b.tgt[2] - a.tgt[2]) * k,
    )
    tpv.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * k,
      a.pos[1] + (b.pos[1] - a.pos[1]) * k,
      a.pos[2] + (b.pos[2] - a.pos[2]) * k,
    )

    // gentle pointer parallax
    tpv.x += pointerState.x * 0.07
    tpv.y += pointerState.y * 0.05

    // pull back on narrow screens
    if (fit.current !== 1) {
      tpv.sub(ttv).multiplyScalar(fit.current).add(ttv)
    }

    const damp = THREE.MathUtils.damp
    state.camera.position.set(
      damp(state.camera.position.x, tpv.x, 2.8, d),
      damp(state.camera.position.y, tpv.y, 2.8, d),
      damp(state.camera.position.z, tpv.z, 2.8, d),
    )
    const tg = tgt.current
    tg.set(damp(tg.x, ttv.x, 2.8, d), damp(tg.y, ttv.y, 2.8, d), damp(tg.z, ttv.z, 2.8, d))
    state.camera.lookAt(tg)
  })
  return null
}

/* --------------------------------- piece stage -------------------------------- */

interface StageProps {
  site: [number, number, number]
  span: [number, number, number, number] // fadeIn0, fadeIn1, fadeOut0, fadeOut1
  children: React.ReactNode
}

function Stage({ site, span, children }: StageProps) {
  const ref = useRef<THREE.Group>(null)
  const [active, setActive] = useState(false)
  const activeRef = useRef(false)

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.1)
    const p = scrollState.progress
    const vis = smooth(p, span[0], span[1]) * (1 - smooth(p, span[2], span[3]))
    const on = vis > 0.002
    if (on !== activeRef.current) {
      activeRef.current = on
      setActive(on)
    }
    const g = ref.current
    if (!g) return
    g.visible = on || g.scale.x > 0.012
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, Math.max(vis, 0.001), 5, d))
    g.position.set(
      site[0],
      site[1] + Math.sin(state.clock.elapsedTime * 0.5 + site[0]) * 0.035,
      site[2],
    )
  })

  if (!active) return null
  return (
    <group ref={ref} position={site} scale={0.001} visible={false}>
      {children}
    </group>
  )
}

/* ---------------------------------- atmosphere --------------------------------- */

function Atmosphere() {
  const fogRef = useRef<THREE.FogExp2>(null)
  const setOnDark = useJewelryStore((s) => s.setOnDark)
  const darkRef = useRef(false)
  useMetalLerp()

  useFrame(() => {
    const p = scrollState.progress
    const dark = smooth(p, 0.755, 0.815) * (1 - smooth(p, 0.9, 0.955))
    const f = fogRef.current
    if (f) {
      f.color.copy(IVORY).lerp(ESPRESSO, dark)
      f.density = 0.05 + dark * 0.028
    }
    const isDark = dark > 0.5
    if (isDark !== darkRef.current) {
      darkRef.current = isDark
      setOnDark(isDark)
    }
  })

  return <fogExp2 ref={fogRef} attach="fog" args={['#F4EEE1', 0.05]} />
}

/* ------------------------------------ scene ------------------------------------ */

export default function Scene() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [-0.62, 0.16, 4.5], fov: 38, near: 0.1, far: 90 }}
        onCreated={({ scene, camera }) => {
          const w = window as unknown as { __aurelieScene?: THREE.Scene; __aurelieCam?: THREE.Camera }
          w.__aurelieScene = scene
          w.__aurelieCam = camera
        }}
      >
        <Suspense fallback={null}>
          <Atmosphere />

          {/* key / fill / vault lights */}
          <ambientLight intensity={0.32} />
          <directionalLight position={[4, 6, 5]} intensity={1.15} color="#FFF6E6" />
          <directionalLight position={[-6, 2, -4]} intensity={0.5} color="#EFD9AC" />
          {/* spotlight feel over the vault */}
          <pointLight position={[28, 2.8, 2.6]} intensity={26} distance={10} decay={2} color="#FFE9BE" />
          <pointLight position={[21, 3.4, 2.2]} intensity={14} distance={9} decay={2} color="#FFF2D8" />

          <Stage site={[0, 0, 0]} span={[-0.2, -0.05, 0.245, 0.3]}>
            <RingPiece />
          </Stage>
          <Stage site={[7, 0, -3]} span={[0.265, 0.315, 0.445, 0.5]}>
            <NecklacePiece />
          </Stage>
          <Stage site={[14, 0, 0]} span={[0.46, 0.515, 0.61, 0.665]}>
            <EarringsPiece />
          </Stage>
          <Stage site={[21, 0, -3]} span={[0.625, 0.68, 0.775, 0.83]}>
            <BanglePiece />
          </Stage>
          <Stage site={[28, 0, 0]} span={[0.785, 0.84, 0.955, 0.995]}>
            <TiaraPiece />
          </Stage>

          <Dust />

          {/* locally-rendered studio environment — zero network requests */}
          <Environment resolution={256} frames={1}>
            <Lightformer intensity={2.6} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 10, 1]} color="#FFFFFF" />
            <Lightformer intensity={1.4} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[8, 1.8, 1]} color="#F3E3BC" />
            <Lightformer intensity={1.6} position={[5, 1, 0]} rotation-y={-Math.PI / 2} scale={[8, 1.8, 1]} color="#FFFFFF" />
            <Lightformer intensity={0.8} position={[0, 1, 5]} scale={[6, 3, 1]} color="#FFF9EE" />
            <Lightformer form="ring" intensity={1.1} position={[0, 0.5, -5]} scale={3} color="#E8C87A" />
          </Environment>

          <CameraRig />
        </Suspense>
      </Canvas>
    </div>
  )
}
