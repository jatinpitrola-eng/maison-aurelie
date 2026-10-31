'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Driver, getColor, zeroDriver, useProductStore } from '@/lib/product-store'

interface ExplodeGroups {
  shell: THREE.Group | null
  cushion: THREE.Group | null
  driver: THREE.Group | null
  cap: THREE.Group | null
}

const emptyGroups = (): ExplodeGroups => ({ shell: null, cushion: null, driver: null, cap: null })

export function Headphones({ driver }: { driver?: Driver }) {
  const colorId = useProductStore((s) => s.colorId)
  const targetColor = useMemo(() => new THREE.Color(getColor(colorId).hex), [colorId])

  /* refs for the exploded-view groups — [right, left] */
  const parts = useRef<ExplodeGroups[]>([emptyGroups(), emptyGroups()])

  /* materials are created once; mutated only through a ref alias in useFrame */
  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#26282f'),
        metalness: 0.92,
        roughness: 0.33,
        clearcoat: 0.6,
        clearcoatRoughness: 0.32,
      }),
      accent: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#d2d3d8'),
        metalness: 1,
        roughness: 0.2,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#1a1a1e'),
        metalness: 0.7,
        roughness: 0.45,
      }),
      leather: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#121214'),
        metalness: 0.03,
        roughness: 0.96,
      }),
      driver: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#101013'),
        metalness: 0.6,
        roughness: 0.45,
        side: THREE.DoubleSide,
      }),
      fabric: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0a0a0c'),
        emissive: new THREE.Color('#ff8c3a'),
        emissiveIntensity: 0,
        roughness: 1,
        side: THREE.DoubleSide,
      }),
    }),
    [],
  )
  const matsRef = useRef(mats)

  /* ------------------------------ geometries ------------------------------ */
  const geo = useMemo(
    () => ({
      band: new THREE.TorusGeometry(1.04, 0.052, 24, 128, Math.PI),
      pad: new THREE.TorusGeometry(0.965, 0.055, 24, 96, Math.PI * 0.62),
      endCap: new THREE.SphereGeometry(0.056, 24, 24),
      slider: new THREE.CylinderGeometry(0.021, 0.021, 0.5, 16),
      yoke: new THREE.TorusGeometry(0.522, 0.02, 16, 72),
      shell: new THREE.SphereGeometry(0.5, 48, 48),
      cushion: new THREE.TorusGeometry(0.335, 0.1, 24, 64),
      driver: new THREE.CylinderGeometry(0.3, 0.3, 0.032, 48),
      fabric: new THREE.CircleGeometry(0.265, 48),
      cap: new THREE.CylinderGeometry(0.4, 0.4, 0.05, 48),
      ring: new THREE.TorusGeometry(0.41, 0.014, 12, 72),
      logo: new THREE.CylinderGeometry(0.105, 0.105, 0.02, 32),
    }),
    [],
  )

  /* --------------------------- per-frame updates --------------------------- */
  useFrame((_, delta) => {
    try {
    const d = Math.min(delta, 0.1)
    const m = matsRef.current

    // smooth color transition
    m.body.color.lerp(targetColor, 1 - Math.exp(-6 * d))

    // exploded-view factor driven by the rig (0 = assembled, 1 = disassembled)
    const ex = (driver ?? zeroDriver).current

    // driver glow while exploded
    m.fabric.emissiveIntensity = ex * 1.6

    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? 1 : -1
      const g = parts.current[i]
      if (g.shell) g.shell.position.x = s * ex * 0.12
      if (g.cushion) g.cushion.position.x = -s * 0.24 - s * ex * 0.3
      if (g.driver) g.driver.position.x = -s * 0.295 - s * ex * 0.22
      if (g.cap) g.cap.position.x = s * 0.29 + s * ex * 0.36
    }
    } catch {
      /* never kill the render loop */
    }
  })

  return (
    <group>
      {/* ------------------------------ headband ------------------------------ */}
      <mesh geometry={geo.band} material={mats.body} />
      {/* under-band cushion, centered on top */}
      <mesh geometry={geo.pad} material={mats.leather} rotation-z={Math.PI * 0.19} />
      <mesh geometry={geo.endCap} material={mats.accent} position={[1.04, 0, 0]} />
      <mesh geometry={geo.endCap} material={mats.accent} position={[-1.04, 0, 0]} />

      {/* ------------------------- sliders / telescoping ----------------------- */}
      <mesh geometry={geo.slider} material={mats.dark} position={[1.04, -0.25, 0]} />
      <mesh geometry={geo.slider} material={mats.dark} position={[-1.04, -0.25, 0]} />

      {/* ------------------------------ ear cups ------------------------------ */}
      {[1, -1].map((s, i) => (
        <group key={s} position={[s * 1.04, -0.85, 0]}>
          {/* anodized shell — flattened sphere */}
          <group
            ref={(el) => {
              parts.current[i].shell = el
            }}
          >
            <mesh geometry={geo.shell} material={mats.body} scale={[0.52, 1, 1]} />
          </group>

          {/* leather ear cushion — sits on the inner face */}
          <group
            ref={(el) => {
              parts.current[i].cushion = el
            }}
          >
            <mesh geometry={geo.cushion} material={mats.leather} rotation-y={Math.PI / 2} />
          </group>

          {/* 40 mm driver assembly — glows when exploded */}
          <group
            ref={(el) => {
              parts.current[i].driver = el
            }}
          >
            <mesh geometry={geo.driver} material={mats.driver} rotation-z={Math.PI / 2} />
            <mesh
              geometry={geo.fabric}
              material={mats.fabric}
              position-x={-s * 0.02}
              rotation-y={-s * (Math.PI / 2)}
            />
          </group>

          {/* outer cap + accent ring + logo dot */}
          <group
            ref={(el) => {
              parts.current[i].cap = el
            }}
          >
            <mesh geometry={geo.cap} material={mats.body} rotation-z={Math.PI / 2} />
            <mesh geometry={geo.ring} material={mats.accent} rotation-y={Math.PI / 2} position-x={s * 0.014} />
            <mesh geometry={geo.logo} material={mats.accent} rotation-z={Math.PI / 2} position-x={s * 0.036} />
          </group>

          {/* yoke ring — holds the cup, does not explode */}
          <mesh geometry={geo.yoke} material={mats.dark} rotation-y={Math.PI / 2} />
        </group>
      ))}
    </group>
  )
}
