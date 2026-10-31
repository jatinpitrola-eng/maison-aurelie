'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { scrollState } from '@/lib/jewelry-store'

/* Floating gold dust — subtle, luxurious, spans the whole journey. */

const COUNT = 720

const VERT = /* glsl */ `
uniform float uTime;
uniform float uPR;
attribute vec2 aSeed;
varying float vA;
void main() {
  vec3 p = position;
  float t = uTime * 0.12 * aSeed.y;
  p.y += sin(t * 2.0 + aSeed.x) * 0.4;
  p.x += cos(t * 1.6 + aSeed.x * 1.7) * 0.35;
  p.z += sin(t * 1.2 + aSeed.x * 0.6) * 0.25;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float size = 1.3 + aSeed.y * 2.1;
  gl_PointSize = size * (10.0 / -mv.z) * uPR;
  vA = 0.3 + 0.7 * (0.5 + 0.5 * sin(uTime * (0.5 + aSeed.y) + aSeed.x * 3.0));
  gl_Position = projectionMatrix * mv;
}
`

const FRAG = /* glsl */ `
precision mediump float;
uniform float uOpacity;
varying float vA;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  float a = smoothstep(0.5, 0.06, d) * vA * uOpacity;
  if (a < 0.012) discard;
  gl_FragColor = vec4(0.79, 0.64, 0.30, a);
}
`

export function Dust() {
  const matRef = useRef<THREE.ShaderMaterial>(null)

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const seeds = new Float32Array(COUNT * 2)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = -3 + Math.random() * 34
      positions[i * 3 + 1] = -3.4 + Math.random() * 6.8
      positions[i * 3 + 2] = -5 + Math.random() * 9
      seeds[i * 2] = Math.random() * Math.PI * 2
      seeds[i * 2 + 1] = 0.4 + Math.random() * 0.8
    }
    return { positions, seeds }
  }, [])

  useFrame((state) => {
    const m = matRef.current
    if (!m) return
    m.uniforms.uTime.value = state.clock.elapsedTime
    m.uniforms.uPR.value = state.gl.getPixelRatio()
    // dust breathes slightly faster while scrolling fast
    const target = 0.4 + Math.min(0.25, Math.abs(scrollState.velocity) * 0.5)
    m.uniforms.uOpacity.value += (target - m.uniforms.uOpacity.value) * 0.04
  })

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 2]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        uniforms={{
          uTime: { value: 0 },
          uPR: { value: 1 },
          uOpacity: { value: 0.4 },
        }}
        vertexShader={VERT}
        fragmentShader={FRAG}
      />
    </points>
  )
}
