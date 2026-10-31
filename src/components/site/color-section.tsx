'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PRODUCT_COLORS, useProductStore } from '@/lib/product-store'

/** Finish picker — Oryzo-style flanking layout; the whole collection re-finishes live */
export function ColorSection() {
  const { colorId, setColor } = useProductStore()

  return (
    <section
      id="colors"
      aria-label="Finishes"
      className="pointer-events-none relative flex min-h-screen items-center px-6 py-20 md:px-14 lg:px-20"
    >
      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[1fr_minmax(0,460px)_1fr] md:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-18% 0px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-orange-400">
            04 — Finishes
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-tight text-[#f2ead9] sm:text-5xl lg:text-6xl">
            Three
            <br />
            finishes.
          </h2>
        </motion.div>

        <div className="hidden md:block" aria-hidden="true" />

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-18% 0px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)] md:justify-self-end"
        >
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400 md:text-[15px]">
            Three anodized finishes shared across the whole collection — headphones, buds and
            orb. Tap a swatch and watch every product re-finish itself in real time.
          </p>

          <div className="mt-8 flex items-center gap-5" role="group" aria-label="Choose a finish">
            {PRODUCT_COLORS.map((c) => {
              const active = colorId === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setColor(c.id)}
                  aria-pressed={active}
                  aria-label={`${c.name} finish`}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-all duration-300 hover:scale-110 ${
                    active ? 'scale-110 ring-2 ring-orange-400 ring-offset-2 ring-offset-[#140d08]' : ''
                  }`}
                  style={{ backgroundColor: c.swatch }}
                >
                  {active ? <Check className="h-4 w-4 text-white mix-blend-difference" /> : null}
                </button>
              )
            })}
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            <span className="font-semibold text-[#f2ead9]">
              {PRODUCT_COLORS.find((c) => c.id === colorId)?.name}
            </span>{' '}
            · collection finish · from $249
          </p>
        </motion.div>
      </div>
    </section>
  )
}
