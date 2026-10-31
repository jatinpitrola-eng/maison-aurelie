'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { scrollToId } from '@/lib/jewelry-store'
import { Reveal } from './reveal'

export function BridalBanner() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-14%', '14%'])

  return (
    <section
      ref={ref}
      id="bridal"
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden"
      aria-label="Bridal atelier"
    >
      <motion.div style={{ y }} className="absolute inset-0 -top-[14%] -bottom-[14%]">
        <Image
          src="/images/bridal-1.jpg"
          alt="A bride in a veil wearing a layered 22k gold bridal set"
          fill
          sizes="100vw"
          className="object-cover object-[50%_30%]"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-r from-noir/85 via-noir/45 to-noir/25"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="max-w-xl">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-gold/70" aria-hidden="true" />
              <p className="text-[11px] font-light uppercase tracking-[0.42em] text-gold">
                The Bridal Atelier
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-5 font-display text-5xl leading-[1.06] font-medium text-ivory sm:text-6xl lg:text-7xl">
              For the day
              <br />
              <em className="gold-text">everything begins</em>
            </h2>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-6 max-w-md font-sans text-[15px] font-light leading-relaxed tracking-wide text-ivory/70">
              Sixteen weeks, one master jeweller and a trousseau told in gold. Our
              bridal salon pairs each family with a designer who sketches,
              sources and fits — from the first mehndi to the phera.
            </p>
          </Reveal>
          <Reveal delay={0.26}>
            <button
              onClick={() => scrollToId('appointment')}
              className="mt-9 border border-gold bg-gold px-9 py-4 text-[11px] font-normal uppercase tracking-[0.3em] text-noir transition-all duration-300 hover:bg-champagne"
            >
              Begin your bridal journey
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
