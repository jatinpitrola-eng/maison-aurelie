'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Driver, getColor, zeroDriver, useProductStore } from '@/lib/product-store'

const damp = THREE.MathUtils.damp

/**
 * AURA Buds — machined charging case with two floating earbuds.
 * `driver` (0..1) is written by the rig: 0 = closed & pocketed, 1 = lid open,
 * buds hovering above the case.
 */
export function Buds({ driver }: { driver?: Driver }) {
  const colorId = useProductStore((s) => s.colorId)
  const targetColor = useMemo(() => new THREE.Color(getColor(colorId).hex), [colorId])
  const drv = useRef<Driver>(driver ?? zeroDriver)

  const mats = useMemo(
    () => ({
      body: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#26282f'),
        metalness: 0.9,
        roughness: 0.35,
        clearcoat: 0.6,
        clearcoatRoughness: 0.3,
      }),
      accent: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color('#d2d3d8'),
        metalness: 1,
        roughness: 0.22,
      }),
      dark: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#0b0b0d'),
        metalness: 0.2,
        roughness: 0.9,
      }),
      led: new THREE.MeshStandardMaterial({
        color: new THREE.Color('#050505'),
        emissive: new THREE.Color('#ffb454'),
        emissiveIntensity: 0.4,
      }),
    }),
    [],
  )
  const matsRef = useRef(mats)

  const lid = useRef<THREE.Group>(null)
  const budA = useRef<THREE.Group>(null)
  const budB = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    try {
    const dt = Math.min(delta, 0.1)
    const m = matsRef.current
    m.body.color.lerp(targetColor, 1 - Math.exp(-6 * dt))

    const open = drv.current.current
    const t = state.clock.elapsedTime

    if (lid.current) lid.current.rotation.x = damp(lid.current.rotation.x, -1.85 * open, 6, dt)

    if (budA.current) {
      budA.current.position.y = damp(budA.current.position.y, 0.1 + open * (0.82 + Math.sin(t * 1.1) * 0.05), 5, dt)
      budA.current.position.x = damp(budA.current.position.x, -0.27 - open * 0.1, 5, dt)
      budA.current.rotation.y = damp(budA.current.rotation.y, open * 0.55, 4, dt)
    }
    if (budB.current) {
      budB.current.position.y = damp(budB.current.position.y, 0.1 + open * (0.66 + Math.sin(t * 1.3 + 2) * 0.05), 5, dt)
      budB.current.position.x = damp(budB.current.position.x, 0.27 + open * 0.1, 5, dt)
      budB.current.rotation.y = damp(budB.current.rotation.y, -open * 0.55, 4, dt)
    }

    m.led.emissiveIntensity = 0.4 + open * 2.4
    } catch {
      /* never kill the render loop */
    }
  })

  return (
    <group>
      {/* lower case */}
      <RoundedBox args={[1.15, 0.66, 0.44]} radius={0.17} smoothness={6} position={[0, -0.06, 0]} material={mats.body} />
      {/* dark interior inset, revealed when the lid opens */}
      <RoundedBox args={[1.0, 0.34, 0.32]} radius={0.1} smoothness={5} position={[0, 0.07, 0]} material={mats.dark} />

      {/* front LED — brightens as the case wakes */}
      <mesh material={mats.led} position={[0, -0.04, 0.222]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.024, 0.024, 0.014, 16]} />
      </mesh>

      {/* lid on a rear hinge */}
      <group ref={lid} position={[0, 0.27, -0.2]}>
        <RoundedBox args={[1.15, 0.36, 0.44]} radius={0.17} smoothness={6} position={[0, 0.18, 0.2]} material={mats.body} />
        {/* accent seam strip on the lid front */}
        <mesh material={mats.accent} position={[0, 0.18, 0.421]}>
          <boxGeometry args={[0.5, 0.02, 0.004]} />
        </mesh>
      </group>

      {/* ------------------------------- the buds ------------------------------ */}
      <group ref={budA} position={[-0.27, 0.1, 0]}>
        <group rotation-z={0.16}>
          <mesh material={mats.body} scale={[1, 0.92, 1]}>
            <sphereGeometry args={[0.16, 32, 32]} />
          </mesh>
          {/* stem */}
          <mesh material={mats.body} position={[0, -0.21, 0.03]} rotation-x={0.25}>
            <cylinderGeometry args={[0.045, 0.05, 0.3, 20]} />
          </mesh>
          <mesh material={mats.accent} position={[0, -0.35, 0.067]} rotation-x={0.25}>
            <cylinderGeometry args={[0.047, 0.047, 0.02, 20]} />
          </mesh>
          {/* inner ear tip */}
          <mesh material={mats.dark} position={[0, 0.02, -0.13]} scale={[1, 1, 0.55]}>
            <sphereGeometry args={[0.09, 24, 24]} />
          </mesh>
        </group>
      </group>

      <group ref={budB} position={[0.27, 0.1, 0]}>
        <group rotation-z={-0.16}>
          <mesh material={mats.body} scale={[1, 0.92, 1]}>
            <sphereGeometry args={[0.16, 32, 32]} />
          </mesh>
          <mesh material={mats.body} position={[0, -0.21, 0.03]} rotation-x={0.25}>
            <cylinderGeometry args={[0.045, 0.05, 0.3, 20]} />
          </mesh>
          <mesh material={mats.accent} position={[0, -0.35, 0.067]} rotation-x={0.25}>
            <cylinderGeometry args={[0.047, 0.047, 0.02, 20]} />
          </mesh>
          <mesh material={mats.dark} position={[0, 0.02, -0.13]} scale={[1, 1, 0.55]}>
            <sphereGeometry args={[0.09, 24, 24]} />
          </mesh>
        </group>
      </group>
    </group>
  )
}
