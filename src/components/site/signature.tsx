'use client'

import { motion } from 'framer-motion'
import { scrollToId } from '@/lib/jewelry-store'
import { Reveal } from './reveal'
import { ParallaxImage, RotatingBadge } from './motion-primitives'

const SPECS = [
  ['Origin', 'Muzo, Colombia'],
  ['Centre stone', '4.6 ct emerald cut'],
  ['Accents', '118 baguette diamonds'],
  ['Metal', '18k yellow gold, hand-drawn'],
  ['Atelier hours', '312 hours by a single master'],
]

export function Signature() {
  return (
    <section
      id="signature"
      className="relative bg-parchment py-24 text-espresso sm:py-32"
      aria-label="Signature piece"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* photograph with offset gold frame + rotating seal */}
        <Reveal className="relative">
          <div
            className="absolute -top-5 -left-5 hidden h-full w-full border border-golddeep/40 sm:block"
            aria-hidden="true"
          />
          <ParallaxImage
            src="/images/neck-2.jpg"
            alt="Rivière Émeraude — diamond and Colombian emerald necklace"
            sizes="(max-width: 1024px) 100vw, 50vw"
            strength={9}
            zoom={1.16}
            className="relative aspect-[4/5] w-full"
          />

          <RotatingBadge
            text="Maison Aurélie · Est. 1962 · "
            className="animate-float absolute -top-8 -right-4 z-10 h-24 w-24 rounded-full border border-golddeep/25 bg-parchment text-golddeep shadow-[0_10px_36px_-14px_rgba(25,21,18,0.5)] sm:-right-8 sm:h-28 sm:w-28"
          />

          <div className="absolute right-4 bottom-4 border border-golddeep/30 bg-parchment/92 px-5 py-3 backdrop-blur-sm">
            <p className="text-[10px] font-light uppercase tracking-[0.3em] text-golddeep">
              The Signature
            </p>
            <p className="font-display text-lg font-medium">Nº 02 · One of one</p>
          </div>
        </Reveal>

        {/* copy */}
        <div>
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-golddeep/60" aria-hidden="true" />
              <p className="text-[11px] font-light uppercase tracking-[0.42em] text-golddeep">
                Signature of the Maison
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 className="mt-5 font-display text-5xl leading-[1.05] font-medium sm:text-6xl">
              Rivière <em className="text-golddeep">Émeraude</em>
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-6 max-w-xl font-sans text-[15px] font-light leading-relaxed tracking-wide text-espresso/70">
              A river of hand-drawn gold narrows to a single Muzo emerald, set to
              float a millimetre above the skin. Three hundred and twelve hours
              under one master jeweller — every baguette cut, calibrated and
              invisibly strung so the necklace moves like water.
            </p>
          </Reveal>

          {/* specs stagger in, row by row */}
          <motion.dl
            initial="closed"
            whileInView="open"
            viewport={{ once: true, margin: '-70px' }}
            transition={{ staggerChildren: 0.07 }}
            className="mt-9 divide-y divide-espresso/10 border-y border-espresso/10"
          >
            {SPECS.map(([k, v]) => (
              <motion.div
                key={k}
                variants={{
                  closed: { opacity: 0, x: -18 },
                  open: {
                    opacity: 1,
                    x: 0,
                    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="flex items-baseline justify-between gap-6 py-3.5"
              >
                <dt className="text-[10px] font-light uppercase tracking-[0.3em] text-espresso/50">
                  {k}
                </dt>
                <dd className="text-right font-display text-lg font-medium text-espresso">
                  {v}
                </dd>
              </motion.div>
            ))}
          </motion.dl>

          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <p className="font-display text-3xl font-medium text-golddeep">₹ 24,80,000</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                onClick={() => scrollToId('appointment')}
                className="border border-espresso bg-espresso px-8 py-4 text-[11px] font-normal uppercase tracking-[0.3em] text-ivory transition-colors duration-300 hover:bg-golddeep"
              >
                Reserve this piece
              </motion.button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
