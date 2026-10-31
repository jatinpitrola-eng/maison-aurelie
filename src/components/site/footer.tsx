'use client'

import { Github, Instagram, Twitter, Youtube } from 'lucide-react'
import { scrollToSection } from '@/lib/product-store'

const COLUMNS = [
  { title: 'Product', links: ['Overview', 'Acoustics', 'Finishes', 'Specs'] },
  { title: 'Company', links: ['About', 'Newsroom', 'Careers', 'Sustainability'] },
  { title: 'Support', links: ['Contact', 'Warranty', 'Manuals', 'Firmware'] },
]

const SOCIALS = [
  { icon: Twitter, label: 'Twitter' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
  { icon: Github, label: 'GitHub' },
]

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 bg-black/50 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:px-10">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_18px_4px_rgba(251,191,36,0.45)]" />
            <span className="text-sm font-bold tracking-[0.35em] text-white">AURA</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
            Flagship audio, rendered live. AURA X1 — engineered in WebGL, built for silence.
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#overview"
                onClick={(e) => e.preventDefault()}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-amber-300/40 hover:text-amber-300"
              >
                <s.icon className="h-4 w-4" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => {
                const sectionIndex =
                  link === 'Overview' ? 0 : link === 'Acoustics' ? 2 : link === 'Finishes' ? 4 : link === 'Specs' ? 5 : 1
                return (
                  <li key={link}>
                    <button
                      onClick={() => scrollToSection(sectionIndex)}
                      className="text-sm text-zinc-400 transition-colors hover:text-white"
                    >
                      {link}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-zinc-600 md:flex-row md:px-10">
          <p>© 2025 AURA Audio. All rights reserved.</p>
          <p>
            Real-time WebGL · Three.js · React Three Fiber — designed for the open web.
          </p>
        </div>
      </div>
    </footer>
  )
}
