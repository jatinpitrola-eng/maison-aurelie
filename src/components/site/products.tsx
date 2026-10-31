'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS, scrollToId, useJewelryStore } from '@/lib/jewelry-store'
import { Reveal, SectionHeader } from './reveal'

const FILTERS = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bangles'] as const

export function Products() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const setInterest = useJewelryStore((s) => s.setInterest)

  const shown =
    filter === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter)

  const enquire = (name: string) => {
    setInterest(name)
    scrollToId('appointment')
  }

  return (
    <section id="collection" className="relative bg-noir py-24 sm:py-32">
      <div className="glow-gold pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          kicker="The Vault"
          title={
            <>
              This Season&apos;s <em className="gold-text font-medium">Rarities</em>
            </>
          }
          sub="Eight pieces currently in the vault. Each is one of a handful — when it leaves, it does not return."
        />

        {/* filter tabs */}
        <Reveal delay={0.15}>
          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
            role="tablist"
            aria-label="Filter collection"
          >
            {FILTERS.map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={filter === f}
                onClick={() => setFilter(f)}
                className={`border px-5 py-2.5 text-[10px] font-light uppercase tracking-[0.28em] transition-all duration-300 sm:text-[11px] ${
                  filter === f
                    ? 'border-gold bg-gold text-noir'
                    : 'border-gold/25 text-ivory/65 hover:border-gold/60 hover:text-gold'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* grid */}
        <motion.div layout className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {shown.map((p) => (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="group relative overflow-hidden border border-gold/12 bg-onyx transition-colors duration-500 hover:border-gold/45"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={p.image}
                    alt={`${p.name} — ${p.spec}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-onyx/85 via-transparent to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <button
                      onClick={() => enquire(p.name)}
                      className="w-full border border-gold/80 bg-noir/80 py-3 text-[10px] font-normal uppercase tracking-[0.3em] text-gold backdrop-blur-sm transition-colors duration-300 hover:bg-gold hover:text-noir"
                    >
                      Enquire
                    </button>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <p className="text-[9px] font-light uppercase tracking-[0.3em] text-gold/75">
                    {p.category}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl leading-tight font-medium text-ivory sm:text-2xl">
                    {p.name}
                  </h3>
                  <p className="mt-1.5 text-[11px] font-light tracking-wide text-ivory/50">
                    {p.spec}
                  </p>
                  <p className="mt-3 font-display text-lg font-medium text-champagne">
                    {p.price}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
