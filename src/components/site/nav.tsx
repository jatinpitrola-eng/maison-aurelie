'use client'

import { motion } from 'framer-motion'
import { scrollToSection } from '@/lib/product-store'

const LINKS: { label: string; section: number }[] = [
  { label: 'Sound', section: 1 },
  { label: 'Acoustics', section: 2 },
  { label: 'Design', section: 3 },
  { label: 'Colors', section: 4 },
  { label: 'Specs', section: 5 },
]

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="bg-gradient-to-b from-black/60 to-transparent">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10"
        >
          <button
            onClick={() => scrollToSection(0)}
            className="group flex items-center gap-3"
            aria-label="AURA — back to top"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_18px_4px_rgba(251,191,36,0.45)] transition-transform group-hover:scale-125" />
            <span className="text-sm font-bold tracking-[0.35em] text-white">AURA</span>
            <span className="hidden text-xs font-medium tracking-widest text-zinc-500 sm:inline">X1</span>
          </button>

          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => scrollToSection(l.section)}
                  className="text-[11px] font-medium uppercase tracking-[0.22em] text-zinc-400 transition-colors hover:text-white"
                >
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollToSection(5)}
            className="rounded-full bg-amber-300 px-5 py-2 text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-amber-200"
          >
            Pre-order
          </motion.button>
        </nav>
      </div>
    </header>
  )
}
