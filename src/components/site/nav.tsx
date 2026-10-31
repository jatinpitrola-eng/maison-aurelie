'use client'

import { useEffect, useRef, useState } from 'react'
import { Gem } from 'lucide-react'
import { scrollState, scrollToId, useJewelryStore } from '@/lib/jewelry-store'

const LINKS: Array<[string, string]> = [
  ['Collection', 'piece-ring'],
  ['Atelier', 'piece-bangle'],
  ['Vault', 'vault'],
  ['Salon', 'appointment'],
]

export function Nav() {
  const onDark = useJewelryStore((s) => s.onDark)
  const [scrolled, setScrolled] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let raf = 0
    const loop = () => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${scrollState.progress})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const ink = onDark ? 'text-champagne' : 'text-espresso'
  const chrome =
    scrolled && !onDark
      ? 'border-espresso/10 bg-ivory/85 backdrop-blur-md'
      : scrolled && onDark
        ? 'border-champagne/10 bg-coffee/70 backdrop-blur-md'
        : 'border-transparent'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500 ${chrome}`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-12">
        <button
          onClick={() => scrollToId('hero')}
          className={`flex items-center gap-2.5 ${ink} transition-colors duration-500`}
          aria-label="AurИlie — back to top"
        >
          <Gem className="h-4 w-4 text-gold" strokeWidth={1.5} />
          <span className="font-display text-lg tracking-[0.42em]">AURÉLIE</span>
        </button>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {LINKS.map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollToId(id)}
              className={`text-[11px] uppercase tracking-[0.26em] ${ink} opacity-70 transition-all duration-300 hover:text-gold hover:opacity-100`}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => scrollToId('appointment')}
          className={`border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 ${
            onDark
              ? 'border-champagne/30 text-champagne hover:border-gold hover:bg-gold hover:text-coffee'
              : 'border-espresso/25 text-espresso hover:border-golddeep hover:bg-golddeep hover:text-champagne'
          }`}
        >
          Book a Visit
        </button>
      </div>

      {/* gold reading progress */}
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 h-px w-full origin-left bg-gold"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />
    </header>
  )
}
