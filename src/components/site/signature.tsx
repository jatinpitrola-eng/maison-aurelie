'use client'

import Image from 'next/image'
import { scrollToId } from '@/lib/jewelry-store'
import { Reveal } from './reveal'

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
        {/* photograph with offset gold frame */}
        <Reveal className="relative">
          <div
            className="absolute -top-5 -left-5 hidden h-full w-full border border-golddeep/40 sm:block"
            aria-hidden="true"
          />
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="/images/neck-2.jpg"
              alt="Rivière Émeraude — diamond and Colombian emerald necklace"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
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

          <Reveal delay={0.2}>
            <dl className="mt-9 divide-y divide-espresso/10 border-y border-espresso/10">
              {SPECS.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-3.5">
                  <dt className="text-[10px] font-light uppercase tracking-[0.3em] text-espresso/50">
                    {k}
                  </dt>
                  <dd className="text-right font-display text-lg font-medium text-espresso">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <p className="font-display text-3xl font-medium text-golddeep">₹ 24,80,000</p>
              <button
                onClick={() => scrollToId('appointment')}
                className="border border-espresso bg-espresso px-8 py-4 text-[11px] font-normal uppercase tracking-[0.3em] text-ivory transition-all duration-300 hover:bg-golddeep"
              >
                Reserve this piece
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
