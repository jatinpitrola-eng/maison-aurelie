'use client'

import { useEffect, useRef } from 'react'
import { scrollState } from '@/lib/product-store'

const smooth = (a: number, b: number, x: number) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return k * k * (3 - 2 * k)
}

/**
 * Oryzo-style blueprint annotations — dashed ellipses, measurement ticks and
 * spec labels drawn over the product during the hero, fading out on scroll.
 */
export function BlueprintOverlay() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const el = ref.current
      if (el) {
        const p = scrollState.progress
        const o = 1 - smooth(0.015, 0.07, p)
        el.style.opacity = o.toFixed(3)
        el.style.visibility = o > 0.01 ? 'visible' : 'hidden'
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[2] flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="relative h-[62vmin] w-[92vmin] max-w-[900px]">
        <svg viewBox="0 0 900 620" className="h-full w-full" fill="none">
          {/* dashed ellipses around the product */}
          <ellipse cx="450" cy="310" rx="420" ry="272" stroke="rgba(242,234,217,0.4)" strokeWidth="1.4" strokeDasharray="5 7" />
          <ellipse cx="450" cy="310" rx="392" ry="248" stroke="rgba(255,138,42,0.55)" strokeWidth="1.2" strokeDasharray="3 6" />

          {/* measurement brackets — left */}
          <g stroke="#ff8a2a" strokeWidth="1.6">
            <line x1="26" y1="180" x2="26" y2="440" />
            <line x1="18" y1="180" x2="34" y2="180" />
            <line x1="18" y1="440" x2="34" y2="440" />
            <rect x="22" y="306" width="8" height="8" fill="#ff8a2a" stroke="none" />
          </g>
          {/* measurement brackets — right */}
          <g stroke="#ff8a2a" strokeWidth="1.6">
            <line x1="874" y1="180" x2="874" y2="440" />
            <line x1="866" y1="180" x2="882" y2="180" />
            <line x1="866" y1="440" x2="882" y2="440" />
            <rect x="870" y="306" width="8" height="8" fill="#ff8a2a" stroke="none" />
          </g>
          {/* measurement brackets — top */}
          <g stroke="#ff8a2a" strokeWidth="1.6">
            <line x1="330" y1="26" x2="570" y2="26" />
            <line x1="330" y1="18" x2="330" y2="34" />
            <line x1="570" y1="18" x2="570" y2="34" />
            <rect x="446" y="22" width="8" height="8" fill="#ff8a2a" stroke="none" />
          </g>
          {/* measurement brackets — bottom */}
          <g stroke="#ff8a2a" strokeWidth="1.6">
            <line x1="330" y1="594" x2="570" y2="594" />
            <line x1="330" y1="586" x2="330" y2="602" />
            <line x1="570" y1="586" x2="570" y2="602" />
            <rect x="446" y="590" width="8" height="8" fill="#ff8a2a" stroke="none" />
          </g>

          {/* corner dots */}
          <g fill="#ff8a2a">
            <circle cx="120" cy="90" r="3.5" />
            <circle cx="780" cy="90" r="3.5" />
            <circle cx="120" cy="530" r="3.5" />
            <circle cx="780" cy="530" r="3.5" />
          </g>
        </svg>

        {/* spec labels */}
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.28em] text-orange-300/90">
          AURA X1 · Ø 63 MM
        </span>
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.28em] text-orange-300/90">
          SN X1-0001 · 6000-SERIES ALU
        </span>
        <span className="absolute right-[-10px] top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-medium uppercase tracking-[0.28em] text-[#f2ead9]/60">
          Adaptive ANC
        </span>
        <span className="absolute left-[-30px] top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-medium uppercase tracking-[0.28em] text-[#f2ead9]/60">
          40 mm Driver
        </span>
      </div>
    </div>
  )
}
