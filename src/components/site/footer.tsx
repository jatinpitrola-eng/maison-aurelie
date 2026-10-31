'use client'

import { Github, Instagram, Twitter, Youtube } from 'lucide-react'
import { scrollToSection } from '@/lib/product-store'

const SOCIALS = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Github, label: 'GitHub' },
]

const LINKS: { label: string; section: number }[] = [
  { label: 'Intro', section: 0 },
  { label: 'X1', section: 1 },
  { label: 'Buds', section: 6 },
  { label: 'Orb', section: 8 },
  { label: 'Reserve', section: 10 },
]

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 bg-black/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 md:flex-row md:px-12">
        <div className="flex items-center gap-2.5">
          <span className="h-2 w-2 rounded-full bg-orange-400 shadow-[0_0_14px_3px_rgba(255,138,42,0.5)]" />
          <span className="text-xs font-black tracking-[0.3em] text-[#f2ead9]">AURA</span>
          <span className="text-[10px] font-medium tracking-[0.2em] text-zinc-600">© 2025</span>
        </div>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-6">
          {LINKS.map((l) => (
            <button
              key={l.label}
              onClick={() => scrollToSection(l.section)}
              className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 transition-colors hover:text-[#f2ead9]"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href="#intro"
              onClick={(e) => e.preventDefault()}
              aria-label={s.label}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition-colors hover:border-orange-400/40 hover:text-orange-300"
            >
              <s.icon className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5">
        <p className="mx-auto max-w-7xl px-6 py-4 text-center text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-700 md:px-12">
          Rendered live in WebGL · Three.js · React Three Fiber — real geometry, real particles
        </p>
      </div>
    </footer>
  )
}
