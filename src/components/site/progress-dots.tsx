'use client'

import { useEffect, useState } from 'react'
import { scrollState, scrollToSection } from '@/lib/product-store'

const SECTIONS = ['Overview', 'Sound', 'Acoustics', 'Design', 'Colors', 'Specs']

export function ProgressDots() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    let raf = 0
    const loop = () => {
      const idx = Math.min(
        SECTIONS.length - 1,
        Math.max(0, Math.round(scrollState.progress * (SECTIONS.length - 1))),
      )
      setActive((prev) => (prev === idx ? prev : idx))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <nav
      aria-label="Section progress"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-4 md:flex"
    >
      {SECTIONS.map((label, i) => (
        <button
          key={label}
          onClick={() => scrollToSection(i)}
          aria-label={`Go to ${label}`}
          aria-current={active === i ? 'true' : undefined}
          className="group relative flex items-center"
        >
          <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            {label}
          </span>
          <span
            className={`block rounded-full transition-all duration-300 ${
              active === i
                ? 'h-2.5 w-2.5 bg-amber-300 shadow-[0_0_12px_2px_rgba(251,191,36,0.5)]'
                : 'h-2 w-2 bg-zinc-600 group-hover:bg-zinc-400'
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
