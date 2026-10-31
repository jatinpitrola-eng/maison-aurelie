'use client'

import { useEffect, useState } from 'react'
import { scrollState, scrollToId, useJewelryStore } from '@/lib/jewelry-store'

const DOTS = [
  { id: 'hero', label: 'Maison' },
  { id: 'piece-ring', label: 'Solitaire Éternel' },
  { id: 'piece-necklace', label: 'Rivière de Lumière' },
  { id: 'piece-earrings', label: 'Cascade' },
  { id: 'piece-bangle', label: 'Onde · Atelier' },
  { id: 'vault', label: 'The Vault' },
  { id: 'appointment', label: 'Private Salon' },
]

export function ProgressDots() {
  const onDark = useJewelryStore((s) => s.onDark)
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const idx = Math.round(scrollState.progress * (DOTS.length - 1))
      setActive((prev) => (prev === idx ? prev : idx))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <nav
      aria-label="Chapters"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3.5 lg:flex"
    >
      {DOTS.map((d, i) => (
        <button
          key={d.id}
          onClick={() => scrollToId(d.id)}
          aria-label={d.label}
          title={d.label}
          className={`group relative flex h-3 w-3 items-center justify-center`}
        >
          <span
            className={`rounded-full transition-all duration-300 ${
              i === active
                ? 'h-2.5 w-2.5 bg-gold shadow-[0_0_0_3px_rgba(174,138,76,0.2)]'
                : onDark
                  ? 'h-1.5 w-1.5 bg-champagne/30 group-hover:bg-champagne/60'
                  : 'h-1.5 w-1.5 bg-espresso/25 group-hover:bg-espresso/50'
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
