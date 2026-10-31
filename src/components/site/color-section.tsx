'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { PRODUCT_COLORS, useProductStore } from '@/lib/product-store'

export function ColorSection() {
  const { colorId, setColor } = useProductStore()

  return (
    <section
      id="colors"
      aria-label="Finishes"
      className="pointer-events-none relative flex min-h-screen items-center px-6 md:px-16 lg:px-24"
    >
      <span
        aria-hidden="true"
        className="absolute right-10 top-24 hidden select-none text-[9rem] font-black leading-none text-white/[0.045] md:block"
      >
        04
      </span>

      <motion.div
        initial={{ opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-18% 0px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto max-w-md drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]"
      >
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          <span className="h-px w-8 bg-amber-300/80" />
          04 · Finishes
        </p>
        <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
          Make it yours.
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-zinc-400 md:text-base">
          Three anodized finishes, each machined from the same aerospace billet. Tap a swatch —
          the product re-finishes itself in real time.
        </p>

        <div className="mt-9 flex items-center gap-5" role="group" aria-label="Choose a finish">
          {PRODUCT_COLORS.map((c) => {
            const active = colorId === c.id
            return (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                aria-pressed={active}
                aria-label={`${c.name} finish`}
                className={`flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition-all duration-300 hover:scale-110 ${
                  active ? 'scale-110 ring-2 ring-amber-300 ring-offset-2 ring-offset-black' : ''
                }`}
                style={{ backgroundColor: c.swatch }}
              >
                {active ? <Check className="h-4 w-4 text-white mix-blend-difference" /> : null}
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-sm text-zinc-400">
          <span className="font-semibold text-white">
            {PRODUCT_COLORS.find((c) => c.id === colorId)?.name}
          </span>{' '}
          · anodized aluminium · $549
        </p>
      </motion.div>
    </section>
  )
}
