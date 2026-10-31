'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { COLLECTIONS, scrollToId } from '@/lib/jewelry-store'
import { Reveal, SectionHeader } from './reveal'
import { ParallaxImage, Tilt } from './motion-primitives'

export function Collections() {
  return (
    <section id="collections" className="relative bg-noir py-24 sm:py-32">
      <div className="glow-gold pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          kicker="The Maisons"
          title={
            <>
              Four Houses of <em className="gold-text font-medium">Craft</em>
            </>
          }
          sub="Each collection is a small universe — from the quiet geometry of the solitaire to the ceremonial weight of the bridal kada."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {COLLECTIONS.map((c, i) => (
            <Reveal key={c.id} delay={0.08 * i}>
              <Tilt max={4}>
                <button
                  onClick={() => scrollToId(c.target)}
                  className="group relative block w-full overflow-hidden border border-gold/15 text-left transition-colors duration-500 hover:border-gold/50"
                  aria-label={`Explore ${c.name}`}
                >
                  <ParallaxImage
                    src={c.image}
                    alt={`${c.name} collection by AURÉLIE`}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    strength={9}
                    zoom={1.14}
                    className="aspect-[3/4.4] w-full"
                    imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.07]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-noir/95 via-noir/25 to-noir/10 transition-opacity duration-500 group-hover:opacity-80"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="flex items-baseline gap-3">
                      <span className="font-display text-sm italic text-gold/90">
                        {c.no}
                      </span>
                      <motion.span
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.3 + 0.08 * i }}
                        className="mb-1 h-px w-8 origin-left bg-gold/50"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-1 font-display text-3xl font-medium text-ivory">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-[11px] font-light uppercase tracking-[0.24em] text-ivory/55">
                      {c.caption}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-light uppercase tracking-[0.3em] text-gold opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100">
                      Discover
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </button>
              </Tilt>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
