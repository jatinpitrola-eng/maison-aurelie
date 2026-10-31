'use client'

import Image from 'next/image'
import { Reveal, SectionHeader } from './reveal'

const STATS = [
  ['1962', 'The year our first bench was lit'],
  ['40+', 'Master artisans in the atelier'],
  ['312 hrs', 'In a single signature piece'],
  ['100%', 'GIA certified, BIS hallmarked'],
]

export function Atelier() {
  return (
    <section id="atelier" className="relative overflow-hidden bg-onyx py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* left — editorial collage */}
        <div className="relative">
          <Reveal>
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/images/craft-1.jpg"
                alt="A master jeweller at the AURÉLIE atelier bench, shaping 22k gold"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal
            delay={0.18}
            className="absolute -right-3 -bottom-10 w-[46%] sm:-right-6 lg:-right-10"
          >
            <div className="border border-gold/25 bg-onyx p-2">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src="/images/craft-2.jpg"
                  alt="Close-up of hand-finishing a rose gold necklace"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover"
                />
              </div>
            </div>
          </Reveal>
          <div
            className="absolute -top-4 -left-4 hidden h-24 w-24 border-t border-l border-gold/40 lg:block"
            aria-hidden="true"
          />
        </div>

        {/* right — story + stats */}
        <div>
          <SectionHeader
            align="left"
            kicker="The Atelier"
            title={
              <>
                Sixty years at the <em className="gold-text font-medium">same bench</em>
              </>
            }
          />
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl font-sans text-[15px] font-light leading-relaxed tracking-wide text-ivory/65">
              Every Aurélie piece begins as a sketch and ends in the hands of one
              jeweller, who signs the inner band before it leaves the bench. We
              melt our own 22k, cut against the grain of the rough, and finish by
              hand with beeswax and burnisher — the way it was done when the
              maison opened in 1962.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-px bg-gold/15">
            {STATS.map(([n, label], i) => (
              <Reveal key={n} delay={0.1 + i * 0.07} className="bg-onyx">
                <div className="p-6 sm:p-7">
                  <p className="font-display text-4xl font-medium text-gold sm:text-5xl">
                    {n}
                  </p>
                  <p className="mt-2 text-[11px] font-light uppercase tracking-[0.22em] text-ivory/50">
                    {label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
