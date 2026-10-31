'use client'

import { motion } from 'framer-motion'
import { scrollToSection, useActiveSectionNav } from '@/components/site/nav-utils'

const LINKS: { label: string; section: number; range: [number, number] }[] = [
  { label: 'Intro', section: 0, range: [0, 0] },
  { label: 'X1', section: 1, range: [1, 3] },
  { label: 'Colors', section: 4, range: [4, 4] },
  { label: 'Buds', section: 6, range: [5, 7] },
  { label: 'Orb', section: 8, range: [8, 9] },
  { label: 'Reserve', section: 10, range: [10, 10] },
]

export function Nav() {
  const active = useActiveSectionNav()

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="bg-gradient-to-b from-black/50 to-transparent">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 md:px-12"
        >
          <button
            onClick={() => scrollToSection(0)}
            className="group flex items-center gap-2.5"
            aria-label="AURA — back to top"
          >
            <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_14px_3px_rgba(255,138,42,0.5)] transition-transform group-hover:scale-125" />
            <span className="text-sm font-black tracking-[0.3em] text-[#f2ead9]">AURA</span>
          </button>

          <ul className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => {
              const isActive = active >= l.range[0] && active <= l.range[1]
              return (
                <li key={l.label}>
                  <button
                    onClick={() => scrollToSection(l.section)}
                    className={`relative pb-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors ${
                      isActive ? 'text-[#f2ead9]' : 'text-zinc-500 hover:text-zinc-200'
                    }`}
                  >
                    {l.label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-px bg-orange-400 transition-all duration-300 ${
                        isActive ? 'w-full' : 'w-0'
                      }`}
                    />
                  </button>
                </li>
              )
            })}
          </ul>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollToSection(10)}
            className="border border-[#f2ead9]/25 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-[#f2ead9] transition-colors hover:border-orange-400 hover:text-orange-300"
          >
            Reserve
          </motion.button>
        </nav>
      </div>
    </header>
  )
}
