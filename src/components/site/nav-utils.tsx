'use client'

import { useEffect, useState } from 'react'
import { scrollState } from '@/lib/product-store'

/** Shared nav-section tracking: maps scroll progress onto the 11 sections */
export function useActiveSectionNav() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const idx = Math.min(10, Math.max(0, Math.round(scrollState.progress * 10)))
      setActive((prev) => (prev === idx ? prev : idx))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return active
}

export { scrollToSection } from '@/lib/product-store'
