'use client'

import { useEffect, useRef } from 'react'
import { scrollState } from '@/lib/product-store'

/* Warm cinematic palette that shifts per act (Oryzo-style ambience) */
const STOPS: { t: number; c: [number, number, number] }[] = [
  { t: 0.0, c: [24, 15, 9] }, // hero — espresso
  { t: 0.12, c: [21, 13, 8] },
  { t: 0.2, c: [18, 21, 12] }, // exploded — olive hint
  { t: 0.32, c: [24, 14, 9] },
  { t: 0.42, c: [27, 16, 10] }, // colors — warm amber
  { t: 0.5, c: [15, 11, 8] }, // family — dim
  { t: 0.6, c: [13, 22, 16] }, // buds — deep green callback
  { t: 0.72, c: [11, 17, 13] },
  { t: 0.8, c: [26, 15, 9] }, // orb — amber glow
  { t: 0.9, c: [21, 12, 8] },
  { t: 1.0, c: [10, 9, 9] }, // finale — near black
]

const GLOW: { t: number; o: number }[] = [
  { t: 0.0, o: 0.6 },
  { t: 0.2, o: 0.32 },
  { t: 0.42, o: 0.5 },
  { t: 0.5, o: 0.22 },
  { t: 0.62, o: 0.3 },
  { t: 0.8, o: 0.5 },
  { t: 1.0, o: 0.24 },
]

function sampleStops<T>(stops: { t: number }[], p: number): number {
  let i = 0
  while (i < stops.length - 2 && p > stops[i + 1].t) i++
  const a = stops[i]
  const b = stops[i + 1]
  const k = Math.min(1, Math.max(0, (p - a.t) / (b.t - a.t)))
  return i + k
}

export function BgStory() {
  const bgRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const p = scrollState.progress
      const bg = bgRef.current
      const glow = glowRef.current
      if (bg) {
        const idx = sampleStops(STOPS, p)
        const i = Math.min(STOPS.length - 2, Math.floor(idx))
        const k = idx - i
        const a = STOPS[i].c
        const b = STOPS[i + 1].c
        const r = Math.round(a[0] + (b[0] - a[0]) * k)
        const g = Math.round(a[1] + (b[1] - a[1]) * k)
        const bl = Math.round(a[2] + (b[2] - a[2]) * k)
        bg.style.backgroundColor = `rgb(${r},${g},${bl})`
      }
      if (glow) {
        const idx = sampleStops(GLOW, p)
        const i = Math.min(GLOW.length - 2, Math.floor(idx))
        const k = idx - i
        const o = GLOW[i].o + (GLOW[i + 1].o - GLOW[i].o) * k
        glow.style.opacity = o.toFixed(3)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      {/* act-driven base color */}
      <div ref={bgRef} className="fixed inset-0 z-0" style={{ backgroundColor: 'rgb(24,15,9)' }} aria-hidden="true" />
      {/* warm ambient glow behind the product */}
      <div
        ref={glowRef}
        className="fixed inset-0 z-0"
        style={{
          opacity: 0.5,
          background:
            'radial-gradient(55% 48% at 50% 44%, rgba(255,150,60,0.16) 0%, rgba(255,120,40,0.05) 45%, transparent 70%)',
        }}
        aria-hidden="true"
      />
    </>
  )
}
