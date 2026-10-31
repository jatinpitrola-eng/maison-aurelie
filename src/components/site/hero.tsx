'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { scrollToId } from '@/lib/jewelry-store'

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      aria-label="AURÉLIE — fine jewellery maison"
    >
      {/* parallax photograph */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
        <Image
          src="/images/bridal-2.jpg"
          alt="A bride wearing hand-crafted 22k gold polki jewellery by AURÉLIE"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_22%]"
        />
      </motion.div>

      {/* cinematic overlays */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-noir/75 via-noir/40 to-noir"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-noir/55 via-transparent to-noir/55"
        aria-hidden="true"
      />

      {/* copy */}
      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-center gap-4"
        >
          <span className="h-px w-12 bg-gold/70 sm:w-16" aria-hidden="true" />
          <p className="text-[10px] font-light uppercase tracking-[0.24em] text-gold sm:text-[11px] sm:tracking-[0.44em]">
            Maison de Haute Joaillerie · Est. 1962
          </p>
          <span className="h-px w-12 bg-gold/70 sm:w-16" aria-hidden="true" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 font-display text-[13.5vw] leading-[1.02] font-medium text-ivory sm:text-7xl lg:text-[104px]"
        >
          Where Gold
          <br />
          <em className="gold-text font-medium">Remembers Light</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-7 max-w-xl text-[15px] font-light leading-relaxed tracking-wide text-ivory/75 sm:text-base"
        >
          Rare diamonds, untamed emeralds and 22k gold — composed by hand in our
          atelier for the moments you will never forget.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.64, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => scrollToId('collections')}
            className="w-full border border-gold bg-gold px-9 py-4 text-[11px] font-normal uppercase tracking-[0.3em] text-noir transition-all duration-300 hover:bg-champagne sm:w-auto"
          >
            Explore the Collection
          </button>
          <button
            onClick={() => scrollToId('appointment')}
            className="w-full border border-ivory/35 px-9 py-4 text-[11px] font-normal uppercase tracking-[0.3em] text-ivory transition-all duration-300 hover:border-gold hover:text-gold sm:w-auto"
          >
            Book a Private Viewing
          </button>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.1 }}
        onClick={() => scrollToId('collections')}
        className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2"
        aria-label="Scroll to collections"
      >
        <span className="mb-3 block text-center text-[9px] font-light uppercase tracking-[0.5em] text-ivory/55">
          Scroll
        </span>
        <span className="relative mx-auto block h-14 w-px overflow-hidden bg-ivory/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-5 bg-gold"
            animate={{ y: [-20, 56] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
        </span>
      </motion.button>
    </section>
  )
}
