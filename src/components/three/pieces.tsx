'use client'

/* Procedural high jewelry — five pieces, all built from primitives.
   Every metal mesh carries <MetalMaterial/> and follows the house finish. */

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Brilliant, MetalMaterial, Pearl, gemMat } from './gems'

/* ---------------------------------- 01 · ring --------------------------------- */

export function RingPiece() {
  const g = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!g.current) return
    const t = state.clock.elapsedTime
    g.current.rotation.y += Math.min(delta, 0.1) * 0.3
    g.current.rotation.z = Math.sin(t * 0.5) * 0.045
  })

  return (
    <group ref={g}>
      {/* band */}
      <mesh>
        <torusGeometry args={[1, 0.075, 48, 128]} />
        <MetalMaterial />
      </mesh>
      {/* head */}
      <group position={[0, 1.05, 0]}>
        <mesh>
          <cylinderGeometry args={[0.16, 0.21, 0.12, 24]} />
          <MetalMaterial />
        </mesh>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.185, 0.15, Math.sin(a) * 0.185]}
              rotation={[Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3]}
            >
              <cylinderGeometry args={[0.015, 0.022, 0.32, 10]} />
              <MetalMaterial />
            </mesh>
          )
        })}
        <Brilliant tint="#F2F7F3" depth={1.6} scale={0.42} position={[0, 0.3, 0]} spin={0.55} dispersion={0.3} />
      </group>
      {/* pavé shoulders — twelve marquise diamonds chased along the band */}
      {[-1, 1].map((s) =>
        Array.from({ length: 6 }, (_, k) => {
          const a = Math.PI / 2 + s * (0.36 + k * 0.15)
          return (
            <mesh
              key={`pave-${s}-${k}`}
              position={[Math.cos(a) * 1.078, Math.sin(a) * 1.078, 0]}
              rotation={[0, 0, a]}
              scale={[0.028, 0.04, 0.024]}
            >
              <octahedronGeometry args={[1, 0]} />
              <meshPhysicalMaterial
                color="#FFFFFF"
                roughness={0.07}
                metalness={0}
                envMapIntensity={3.1}
                clearcoat={1}
                flatShading
              />
            </mesh>
          )
        }),
      )}
    </group>
  )
}

/* --------------------------------- 02 · necklace ------------------------------- */

const EMERALD = { tint: '#1E7B54', depth: 0.5, ior: 1.6 }

export function NecklacePiece() {
  const g = useRef<THREE.Group>(null)

  const { curve, beads, pendant } = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.5, 1.15, -0.12),
      new THREE.Vector3(-0.88, 0.28, 0.22),
      new THREE.Vector3(0, -0.3, 0.36),
      new THREE.Vector3(0.88, 0.28, 0.22),
      new THREE.Vector3(1.5, 1.15, -0.12),
    ])
    const pts = curve.getSpacedPoints(128)
    const beads = pts.filter((_, i) => i % 7 === 2)
    const pendant = curve.getPointAt(0.5)
    return { curve, beads, pendant }
  }, [])

  useFrame((state) => {
    if (!g.current) return
    const t = state.clock.elapsedTime
    g.current.rotation.y = Math.sin(t * 0.32) * 0.16
    g.current.rotation.z = Math.sin(t * 0.21) * 0.02
    g.current.rotation.x = 0.06 + Math.sin(t * 0.4) * 0.02
  })

  return (
    <group ref={g}>
      {/* chain */}
      <mesh>
        <tubeGeometry args={[curve, 220, 0.02, 10, false]} />
        <MetalMaterial />
      </mesh>
      {/* links */}
      {beads.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.045, 16, 16]} />
          <MetalMaterial />
        </mesh>
      ))}
      {/* pendant — bail, emerald, pearl halo */}
      <group position={[pendant.x, pendant.y - 0.02, pendant.z]}>
        <mesh>
          <torusGeometry args={[0.075, 0.02, 12, 32]} />
          <MetalMaterial />
        </mesh>
        <Brilliant {...EMERALD} scale={0.52} position={[0, -0.36, 0.03]} spin={0.35} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          return (
            <Pearl
              key={i}
              scale={0.062}
              position={[Math.cos(a) * 0.27, -0.36 + Math.sin(a) * 0.25, 0.06]}
            />
          )
        })}
      </group>
    </group>
  )
}

/* --------------------------------- 03 · earrings ------------------------------- */

function Earring({ side }: { side: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.z = Math.sin(t * 0.85 + side * 1.7) * 0.07
    ref.current.rotation.x = Math.sin(t * 0.6 + side) * 0.04
  })
  return (
    <group ref={ref} position={[side * 0.72, 0.12, 0]}>
      <Pearl scale={0.16} position={[0, 0.72, 0]} />
      <mesh position={[0, 0.41, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.44, 10]} />
        <MetalMaterial />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.09, 0.02, 12, 32]} />
        <MetalMaterial />
      </mesh>
      {/* ruby cabochon drop */}
      <mesh position={[0, -0.16, 0]} scale={[0.22, 0.32, 0.22]}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshPhysicalMaterial {...gemMat({ tint: '#9E1630', depth: 0.35, ior: 1.78 })} />
      </mesh>
    </group>
  )
}

export function EarringsPiece() {
  const g = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!g.current) return
    g.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.12
  })
  return (
    <group ref={g}>
      <Earring side={1} />
      <Earring side={-1} />
    </group>
  )
}

/* ---------------------------------- 04 · bangle -------------------------------- */

export function BanglePiece() {
  const g = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (!g.current) return
    const t = state.clock.elapsedTime
    g.current.rotation.z += Math.min(delta, 0.1) * 0.12
    g.current.rotation.y = Math.sin(t * 0.3) * 0.22
    g.current.rotation.x = 0.42 + Math.sin(t * 0.45) * 0.03
  })

  return (
    <group ref={g}>
      {/* ribbon band + fine rope detail */}
      <mesh>
        <torusGeometry args={[1.06, 0.07, 40, 128]} />
        <MetalMaterial />
      </mesh>
      <mesh rotation={[0, 0, 0.16]} scale={1.055}>
        <torusGeometry args={[1.06, 0.02, 16, 128]} />
        <MetalMaterial />
      </mesh>
      {/* six citrines */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2 + Math.PI / 6
        return (
          <group
            key={i}
            position={[Math.cos(a) * 1.06, Math.sin(a) * 1.06, 0]}
            rotation={[0, 0, a - Math.PI / 2]}
          >
            <mesh>
              <torusGeometry args={[0.155, 0.024, 12, 32]} />
              <MetalMaterial />
            </mesh>
            <Brilliant
              tint="#B4700F"
              depth={0.5}
              ior={1.55}
              scale={0.28}
              position={[0, 0, 0.05]}
              rotation={[Math.PI / 2, 0, 0]}
              spin={0}
            />
          </group>
        )
      })}
    </group>
  )
}

/* ---------------------------------- 05 · tiara --------------------------------- */

const TIARA_HEIGHTS = [0.3, 0.46, 0.34, 0.56, 0.6, 0.56, 0.34, 0.46, 0.3]
const TIARA_TINTS = ['#F2F7F3', '#9E1630', '#F2F7F3', '#F2F7F3', '#9E1630', '#F2F7F3', '#F2F7F3', '#9E1630', '#F2F7F3']

export function TiaraPiece() {
  const g = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!g.current) return
    const t = state.clock.elapsedTime
    g.current.rotation.y = Math.sin(t * 0.28) * 0.22
    g.current.rotation.x = -0.14 + Math.sin(t * 0.5) * 0.02
    g.current.position.y = Math.sin(t * 0.6) * 0.04
  })

  return (
    <group ref={g}>
      {/* band */}
      <mesh>
        <torusGeometry args={[0.95, 0.045, 24, 128]} />
        <MetalMaterial />
      </mesh>
      <mesh scale={1.04}>
        <torusGeometry args={[0.95, 0.014, 12, 128]} />
        <MetalMaterial />
      </mesh>
      {/* marquise flames */}
      {TIARA_HEIGHTS.map((s, i) => {
        const a = Math.PI / 2 + (i - 4) * 0.185
        const r = 0.96 + s * 0.3
        const tint = TIARA_TINTS[i]
        const isDiamond = tint === '#F2F7F3'
        return (
          <mesh
            key={`g${i}`}
            position={[Math.cos(a) * r, Math.sin(a) * r, 0]}
            rotation={[0, 0, a - Math.PI / 2]}
            scale={[0.2, s, 0.12]}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshPhysicalMaterial
              {...gemMat({ tint, depth: isDiamond ? 1.6 : 0.35, ior: isDiamond ? 2.28 : 1.78, dispersion: isDiamond ? 0.22 : 0.04 })}
              flatShading
            />
          </mesh>
        )
      })}
      {/* pearls between the flames */}
      {TIARA_HEIGHTS.map((_, i) => {
        if (i === 4) return null
        const a = Math.PI / 2 + (i - 4) * 0.185 + 0.0925
        return <Pearl key={`p${i}`} scale={0.065} position={[Math.cos(a) * 0.97, Math.sin(a) * 0.97, 0]} />
      })}
    </group>
  )
}
