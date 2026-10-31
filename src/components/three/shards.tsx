'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const COUNT = 14

interface ShardData {
  pos: [number, number, number]
  scale: number
  speed: number
  phase: number
  accent: boolean
  rot: [number, number, number]
}

/** Small floating metal shards drifting through the scene — adds depth & parallax */
export function Shards() {
  const group = useRef<THREE.Group>(null)
  const meshes = useRef<(THREE.Mesh | null)[]>([])

  const { geoms, mats, data } = useMemo(() => {
    const geoms = {
      ico: new THREE.IcosahedronGeometry(0.09, 0),
      oct: new THREE.OctahedronGeometry(0.11, 0),
    }
    const mats = {
      accent: new THREE.MeshStandardMaterial({ color: '#d2d3d8', metalness: 1, roughness: 0.24 }),
      dark: new THREE.MeshStandardMaterial({ color: '#1c1c21', metalness: 0.85, roughness: 0.4 }),
    }

    const data: ShardData[] = Array.from({ length: COUNT }, () => {
      // random direction, kept clear of the product zone and the camera
      const theta = Math.random() * Math.PI * 2
      const y = (Math.random() - 0.5) * 4.6
      const zr = -1 + Math.random() * 1.3 // z bias behind the product
      const flat = Math.sqrt(Math.max(0.05, 1 - Math.pow(y / 4.6, 2)))
      const pos: [number, number, number] = [
        Math.cos(theta) * flat * (2.7 + Math.random() * 1.9),
        y * 0.55,
        zr * (2.2 + Math.random() * 2.2),
      ]
      return {
        pos,
        scale: 0.5 + Math.random() * 1.4,
        speed: (0.15 + Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1),
        phase: Math.random() * Math.PI * 2,
        accent: Math.random() < 0.4,
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
      }
    })

    return { geoms, mats, data }
  }, [])

  useFrame((state, delta) => {
    try {
    const dt = Math.min(delta, 0.1)
    const t = state.clock.elapsedTime
    const g = group.current
    if (!g) return

    // gentle mouse parallax on the whole shard field
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.06, 2, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.04, 2, dt)

    for (let i = 0; i < COUNT; i++) {
      const mesh = meshes.current[i]
      if (!mesh) continue
      const s = data[i]
      mesh.rotation.x += dt * s.speed
      mesh.rotation.y += dt * s.speed * 0.7
      mesh.position.y = s.pos[1] + Math.sin(t * 0.5 + s.phase) * 0.16
    }
    } catch {
      /* never kill the render loop */
    }
  })

  return (
    <group ref={group} aria-hidden="true">
      {data.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            meshes.current[i] = el
          }}
          geometry={i % 2 === 0 ? geoms.ico : geoms.oct}
          material={s.accent ? mats.accent : mats.dark}
          position={s.pos}
          rotation={s.rot}
          scale={s.scale}
        />
      ))}
    </group>
  )
}
