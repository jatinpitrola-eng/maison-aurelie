'use client'

import { motion } from 'framer-motion'

const LEDGER: Array<[string, string, string]> = [
  ['Muzo emerald', 'Colombia · Muzo mines', '4.6 ct'],
  ['Pigeon-blood ruby', 'Burma · Mogok Valley', '3.2 ct'],
  ['Golconda diamond', 'India · Type IIa', '2.1 ct'],
  ['Golden citrine', 'Brazil · Anahí', '7.8 ct'],
]

export function Vault() {
  return (
    <section id="vault" className="relative flex h-screen items-center" aria-label="The vault">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 sm:gap-12 lg:grid-cols-[1fr_minmax(0,0.9fr)_1.1fr] lg:px-12">
        {/* copy — left */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4, once: false }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-coffee/70 p-6 backdrop-blur-md sm:p-8 lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none"
        >
          <div className="mb-6 h-px w-14 bg-gold/80" />
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-gold">
            The Vault — Nº 05
          </p>
          <h2 className="font-display text-5xl leading-[1.02] text-champagne sm:text-6xl">
            Impératrice
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-champagne/60">
            Behind two tonnes of steel, the Impératrice rests under its own key. Nine
            marquise stones — Burmese rubies, Golconda diamonds — drawn into a single
            line of fire, exactly as you see it now.
          </p>
          <p className="mt-8 font-display text-xl italic text-champagne/50">
            Never sold online. Never twice.
          </p>
        </motion.div>

        {/* center — the tiara floats here on desktop */}
        <div className="hidden lg:block" aria-hidden="true" />

        {/* ledger — right */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4, once: false }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="self-center"
        >
          <p className="mb-5 text-[11px] uppercase tracking-[0.3em] text-gold">
            Stone ledger — autumn inventory
          </p>
          <ul className="border-y border-champagne/10">
            {LEDGER.map(([stone, origin, ct]) => (
              <li
                key={stone}
                className="flex items-baseline justify-between gap-4 border-b border-champagne/10 py-4 last:border-b-0"
              >
                <div>
                  <p className="font-display text-xl italic text-champagne">{stone}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-champagne/40">
                    {origin}
                  </p>
                </div>
                <span className="text-sm tracking-[0.14em] text-gold">{ct}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[10px] uppercase tracking-[0.24em] text-champagne/35">
            Every stone leaves the vault with its Gübelin dossier — and our word.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
