'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Driver, getColor, zeroDriver, useProductStore } from '@/lib/product-store'

/**
 * AURA Orb — 360° home speaker wrapped in acoustic fabric.
 * Twin metallic rings orbit the sphere; the seam ring glows and pulses.
 * `pulse` (0..1) drives glow intensity.
 */
export function Orb({ pulse }: { pulse?: Driver }) {
  const colorId = useProductStore((s) => s.colorId)
  const targetColor = useMemo(() => new THREE.Color(getColor(colorId).hex), [colorId])
  const drv = useRef<Driver>(pulse ?? zeroDriver)

  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#26282f'),
        metalness: 0.9,
        roughness: 0.32,
        clearcoat: 0.6,
        clearcoatRoughness: 0.3,
      }),
      accent: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#d2d3d8'),
        metalness: 1,
        roughness: 0.22,
      }),
      fabric: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#141416'),
        metalness: 0.05,
        roughness: 0.97,
      }),
      glow: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0a0a0a'),
        emissive: new THREE.Color('#ff9a3c'),
        emissiveIntensity: 1,
        roughness: 0.6,
      }),
    }),
    [],
  )
  const matsRef = useRef(mats)

  const haloA = useRef<THREE.Group>(null)
  const haloB = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    try {
    const dt = Math.min(delta, 0.1)
    const m = matsRef.current
    m.body.color.lerp(targetColor, 1 - Math.exp(-6 * dt))

    const p = drv.current.current
    const t = state.clock.elapsedTime

    // pulsing seam glow + comet beads
    m.glow.emissiveIntensity = (0.9 + Math.sin(t * 2.1) * 0.5) * (0.4 + 0.6 * p)

    // orbital precession — rings tumble around the sphere
    if (haloA.current) {
      haloA.current.rotation.z += dt * 0.38
      haloA.current.rotation.y = 0.3 + Math.sin(t * 0.22) * 0.18
    }
    if (haloB.current) {
      haloB.current.rotation.z -= dt * 0.24
      haloB.current.rotation.y = -0.4 + Math.sin(t * 0.17 + 1.5) * 0.2
    }
    } catch {
      /* never kill the render loop */
    }
  })

  return (
    <group>
      {/* acoustic fabric body */}
      <mesh material={mats.fabric}>
        <sphereGeometry args={[0.85, 48, 48]} />
      </mesh>

      {/* machined top cap */}
      <mesh material={mats.body} position={[0, 0.74, 0]}>
        <cylinderGeometry args={[0.5, 0.56, 0.16, 48]} />
      </mesh>

      {/* glowing seam ring under the cap */}
      <mesh material={mats.glow} position={[0, 0.645, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.565, 0.02, 12, 64]} />
      </mesh>

      {/* base puck */}
      <mesh material={mats.dark} position={[0, -0.74, 0]}>
        <cylinderGeometry args={[0.34, 0.4, 0.12, 32]} />
      </mesh>

      {/* twin orbital rings with comet beads */}
      <group ref={haloA} rotation={[1.2, 0.3, 0]}>
        <mesh material={mats.accent}>
          <torusGeometry args={[1.38, 0.012, 8, 96]} />
        </mesh>
        <mesh material={mats.glow} position={[1.38, 0, 0]}>
          <sphereGeometry args={[0.038, 16, 16]} />
        </mesh>
      </group>
      <group ref={haloB} rotation={[-0.7, -0.4, 0]}>
        <mesh material={mats.accent}>
          <torusGeometry args={[1.66, 0.009, 8, 96]} />
        </mesh>
        <mesh material={mats.glow} position={[-1.66, 0, 0]}>
          <sphereGeometry args={[0.03, 16, 16]} />
        </mesh>
      </group>
    </group>
  )
}
