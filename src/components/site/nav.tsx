'use client'

import { useEffect, useRef, useState } from 'react'
import { Gem, Menu, X } from 'lucide-react'
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
  const [menuOpen, setMenuOpen] = useState(false)
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

  const go = (id: string) => {
    setMenuOpen(false)
    scrollToId(id)
  }

  const ink = onDark ? 'text-champagne' : 'text-espresso'
  const chrome =
    scrolled && !onDark
      ? 'border-espresso/10 bg-ivory/85 backdrop-blur-md'
      : scrolled && onDark
        ? 'border-champagne/10 bg-coffee/70 backdrop-blur-md'
        : 'border-transparent'

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-colors duration-500 ${chrome}`}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-12">
          <button
            onClick={() => go('hero')}
            className={`flex items-center gap-2.5 ${ink} transition-colors duration-500`}
            aria-label="Aurélie — back to top"
          >
            <Gem className="h-4 w-4 text-gold" strokeWidth={1.5} />
            <span className="font-display text-lg tracking-[0.42em]">AURÉLIE</span>
          </button>

          <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
            {LINKS.map(([label, id]) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`text-[11px] uppercase tracking-[0.26em] ${ink} opacity-70 transition-all duration-300 hover:text-gold hover:opacity-100`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => go('appointment')}
              className={`border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors duration-300 ${
                onDark
                  ? 'border-champagne/30 text-champagne hover:border-gold hover:bg-gold hover:text-coffee'
                  : 'border-espresso/25 text-espresso hover:border-golddeep hover:bg-golddeep hover:text-champagne'
              }`}
            >
              Book a Visit
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`flex h-10 w-10 items-center justify-center border transition-colors md:hidden ${
                onDark ? 'border-champagne/30 text-champagne' : 'border-espresso/25 text-espresso'
              }`}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* gold reading progress */}
        <div
          ref={barRef}
          className="absolute bottom-0 left-0 h-px w-full origin-left bg-gold"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden="true"
        />
      </header>

      {/* mobile chapter menu */}
      {menuOpen && (
        <div
          className={`fixed inset-0 z-50 flex flex-col md:hidden ${
            onDark ? 'bg-coffee/95' : 'bg-ivory/95'
          } backdrop-blur-xl animate-in fade-in duration-300`}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="flex h-16 items-center justify-between px-6">
            <span className={`flex items-center gap-2.5 ${ink}`}>
              <Gem className="h-4 w-4 text-gold" strokeWidth={1.5} />
              <span className="font-display text-lg tracking-[0.42em]">AURÉLIE</span>
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className={`flex h-10 w-10 items-center justify-center border ${
                onDark ? 'border-champagne/30 text-champagne' : 'border-espresso/25 text-espresso'
              }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-start justify-center gap-2 px-8" aria-label="Mobile">
            {LINKS.map(([label, id], i) => (
              <button
                key={id}
                onClick={() => go(id)}
                className="group flex items-baseline gap-4 py-3"
              >
                <span className="text-[10px] tracking-[0.3em] text-gold">0{i + 1}</span>
                <span
                  className={`font-display text-4xl transition-colors group-hover:text-gold ${ink}`}
                >
                  {label}
                </span>
              </button>
            ))}
          </nav>
          <p
            className={`px-8 pb-10 text-[10px] uppercase tracking-[0.28em] ${
              onDark ? 'text-champagne/40' : 'text-espresso/40'
            }`}
          >
            21 Rue de la Paix, Paris · By appointment only
          </p>
        </div>
      )}
    </>
  )
}
