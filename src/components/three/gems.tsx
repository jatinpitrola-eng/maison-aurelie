'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { METALS, useJewelryStore } from '@/lib/jewelry-store'

/* ------------------------------ shared helpers ------------------------------ */

const TMP_COLOR = new THREE.Color()

export interface GemMatOpts {
  tint?: string
  depth?: number
  ior?: number
  /** chromatic fire — diamond-style light splitting (three r167+) */
  dispersion?: number
}

/** Shared physical-glass preset for every gemstone. */
export function gemMat({ tint = '#F2F7F3', depth = 1.4, ior = 2.28, dispersion = 0 }: GemMatOpts = {}) {
  return {
    color: '#ffffff',
    metalness: 0,
    roughness: 0.05,
    transmission: 1,
    thickness: 1.5,
    ior,
    dispersion,
    attenuationColor: tint,
    attenuationDistance: depth,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 2.4,
    specularIntensity: 1,
  }
}

/* ------------------------------- metal material ------------------------------ */

/* Module-level registry — every goldsmith material of the maison, lerped once
   per frame toward the chosen finish. Lives outside React so the compiler
   never freezes it. */
const METAL_MATS = new Set<THREE.MeshStandardMaterial>()

/** Drop inside any metal mesh: registers itself and follows the house finish. */
export function MetalMaterial() {
  return (
    <meshStandardMaterial
      ref={(m: THREE.MeshStandardMaterial | null) => {
        if (m) METAL_MATS.add(m)
        else METAL_MATS.delete(m)
      }}
      color={METALS.yellow.color}
      metalness={1}
      roughness={0.17}
      envMapIntensity={1.4}
    />
  )
}

/** Mounted once in the scene — animates every registered metal material. */
export function useMetalLerp() {
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.1)
    const target = METALS[useJewelryStore.getState().metal]
    TMP_COLOR.set(target.color)
    METAL_MATS.forEach((m) => {
      m.color.lerp(TMP_COLOR, 1 - Math.exp(-5 * d))
      m.roughness = THREE.MathUtils.damp(m.roughness, target.roughness, 5, d)
    })
  })
}

/* --------------------------------- gem geometry ------------------------------ */

function brilliantGeometry() {
  const pts = [
    new THREE.Vector2(0.001, -0.66),
    new THREE.Vector2(0.2, -0.4),
    new THREE.Vector2(0.42, -0.1),
    new THREE.Vector2(0.5, 0.02),
    new THREE.Vector2(0.5, 0.1),
    new THREE.Vector2(0.35, 0.28),
    new THREE.Vector2(0.28, 0.33),
    new THREE.Vector2(0.001, 0.33),
  ]
  const g = new THREE.LatheGeometry(pts, 8)
  g.rotateY(Math.PI / 8)
  return g
}

/* ---------------------------------- brilliant -------------------------------- */

export interface GemProps {
  tint?: string
  depth?: number
  ior?: number
  dispersion?: number
  scale?: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  spin?: number
}

/** Faceted brilliant-cut stone (lathe, 8 segments, flat-shaded). */
export function Brilliant({ tint = '#F2F7F3', depth = 1.4, ior = 2.28, dispersion = 0.14, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], spin = 0.4 }: GemProps) {
  const geo = useMemo(() => brilliantGeometry(), [])
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (spin && ref.current) ref.current.rotation.y += Math.min(delta, 0.1) * spin
  })
  return (
    <mesh ref={ref} geometry={geo} position={position} rotation={rotation} scale={scale} castShadow={false}>
      <meshPhysicalMaterial {...gemMat({ tint, depth, ior, dispersion })} flatShading />
    </mesh>
  )
}

/* ----------------------------------- pearl ----------------------------------- */

export function Pearl({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: GemProps) {
  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshPhysicalMaterial
        color="#F6EFE4"
        roughness={0.22}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.18}
        iridescence={0.22}
        iridescenceIOR={1.25}
        sheen={0.5}
        sheenColor="#FFF6E4"
        envMapIntensity={1.15}
      />
    </mesh>
  )
}
