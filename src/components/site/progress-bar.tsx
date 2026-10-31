'use client'

import { useEffect, useRef, useState } from 'react'
import { scrollState } from '@/lib/product-store'

/** Thin cinematic progress bar on the right edge (Oryzo-style) */
export function ProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      if (fillRef.current) {
        fillRef.current.style.height = `${(scrollState.progress * 100).toFixed(2)}%`
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div
      className="fixed right-4 top-1/2 z-40 hidden h-[36%] w-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-white/10 md:block"
      aria-hidden="true"
    >
      <div ref={fillRef} className="w-full rounded-full bg-[#f2ead9]" style={{ height: '0%' }} />
    </div>
  )
}

/** Tracks the active section index from scroll progress (for nav underline) */
export function useActiveSection(total: number) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const idx = Math.min(total - 1, Math.max(0, Math.round(scrollState.progress * (total - 1))))
      setActive((prev) => (prev === idx ? prev : idx))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [total])
  return active
}
