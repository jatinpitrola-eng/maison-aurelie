'use client'

import * as THREE from 'three'
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { scrollState } from '@/lib/product-store'

const COUNT = 2800

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uVel;
  uniform float uPR;

  attribute float aScale;
  attribute float aSeed;
  attribute float aTint;

  varying float vTint;
  varying float vFade;

  void main() {
    vTint = aTint;
    vec3 p = position;

    float t = uTime * 0.12 + aSeed * 10.0;
    p.x += sin(t * 0.7 + aSeed * 17.0) * 0.45;
    p.y += cos(t * 0.6 + aSeed * 29.0) * 0.45 - uVel * (0.8 + aSeed * 1.6);
    p.y = mod(p.y + 3.9, 7.8) - 3.9; // wrap vertically — keeps the field endless
    p.z += sin(t * 0.5 + aSeed * 43.0) * 0.45;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);

    float twinkle = 0.72 + 0.28 * sin(uTime * (0.9 + aSeed * 2.2) + aSeed * 61.0);
    vFade = twinkle * smoothstep(10.0, 6.0, -mv.z);

    gl_PointSize = aScale * uPR * (38.0 / -mv.z) * (1.0 + abs(uVel) * 0.6);
    gl_Position = projectionMatrix * mv;
  }
`

const FRAG = /* glsl */ `
  varying float vTint;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.06, d);
    vec3 white = vec3(1.0, 0.98, 0.94);
    vec3 amber = vec3(1.0, 0.64, 0.26);
    vec3 col = mix(white, amber, vTint);
    gl_FragColor = vec4(col, a * 0.55 * vFade);
  }
`

export function Particles() {
  const ref = useRef<THREE.Points>(null)
  const vel = useRef(0)

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const pos = new Float32Array(COUNT * 3)
    const scale = new Float32Array(COUNT)
    const seed = new Float32Array(COUNT)
    const tint = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 13
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7.8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 0.5
      scale[i] = 0.35 + Math.pow(Math.random(), 2.2) * 2.6
      seed[i] = Math.random()
      tint[i] = Math.random() < 0.16 ? 1 : 0
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scale, 1))
    geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1))
    geometry.setAttribute('aTint', new THREE.BufferAttribute(tint, 1))

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uVel: { value: 0 },
        uPR: { value: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2) },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
    })

    return { geometry, material }
  }, [])
  const materialRef = useRef(material)

  useFrame((state, delta) => {
    try {
    const d = Math.min(delta, 0.1)
    const mat = materialRef.current
    mat.uniforms.uTime.value = state.clock.elapsedTime

    // smooth scroll-velocity turbulence
    vel.current = THREE.MathUtils.damp(vel.current, scrollState.velocity, 3, d)
    mat.uniforms.uVel.value = vel.current

    const g = ref.current
    if (!g) return
    // gentle mouse parallax on the whole field
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.07, 2.5, d)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.05, 2.5, d)
    } catch {
      /* never kill the render loop */
    }
  })

  return <points ref={ref} geometry={geometry} material={material} frustumCulled={false} />
}
