'use client'

import { Gem } from 'lucide-react'
import { scrollToId } from '@/lib/jewelry-store'

const MAISON: Array<[string, string]> = [
  ['Collection', 'piece-ring'],
  ['Atelier', 'piece-bangle'],
  ['Vault', 'vault'],
  ['Private Salon', 'appointment'],
]

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto bg-coffee text-champagne/70">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Gem className="h-4 w-4 text-gold" strokeWidth={1.5} />
              <span className="font-display text-lg tracking-[0.42em] text-champagne">
                AURÉLIE
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-champagne/50">
              Haute joaillerie, hand-finished in Paris since 1924. One piece at a
              time — never twice.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-gold">Maison</p>
            <ul className="space-y-3">
              {MAISON.map(([label, id]) => (
                <li key={id}>
                  <button
                    onClick={() => scrollToId(id)}
                    className="text-sm text-champagne/60 transition-colors hover:text-gold"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-gold">Salon</p>
            <address className="space-y-3 text-sm not-italic text-champagne/60">
              <p>21 Rue de la Paix, 75002 Paris</p>
              <p>salon@aurelie.paris</p>
              <p>+33 1 42 60 00 00</p>
              <p className="text-champagne/40">Tue – Sat, 10h – 19h · By appointment</p>
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-champagne/10 pt-6 text-[10px] uppercase tracking-[0.22em] text-champagne/35 md:flex-row md:items-center md:justify-between">
          <span>© 2025 Maison Aurélie — Paris</span>
          <span>Crafted in 18k gold & platinum 950</span>
        </div>
      </div>
    </footer>
  )
}
