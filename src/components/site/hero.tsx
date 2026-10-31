'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { scrollToId } from '@/lib/jewelry-store'
import { LetterReveal, Sparkles } from './motion-primitives'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  /* three-layer parallax: photo drifts, copy lifts away, vignette deepens */
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-34%'])
  const fade = useTransform(scrollYProgress, [0, 0.72], [1, 0])

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      aria-label="AURÉLIE — fine jewellery maison"
    >
      {/* parallax photograph with continuous ken-burns drift */}
      <motion.div style={{ y: bgY, scale: 1.06 }} className="absolute inset-0">
        <Image
          src="/images/bridal-2.jpg"
          alt="A bride wearing hand-crafted 22k gold polki jewellery by AURÉLIE"
          fill
          priority
          sizes="100vw"
          className="animate-kenburns object-cover object-[50%_22%]"
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

      {/* drifting gold dust */}
      <Sparkles className="z-[1]" />

      {/* copy — lifts at a different rate than the photo */}
      <motion.div
        style={{ opacity: fade, y: contentY }}
        className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-16 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.05, ease: EASE_OUT }}
          className="flex items-center justify-center gap-4"
        >
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 2, ease: EASE_OUT }}
            className="h-px w-12 origin-right bg-gold/70 sm:w-16"
            aria-hidden="true"
          />
          <p className="text-[10px] font-light uppercase tracking-[0.24em] text-gold sm:text-[11px] sm:tracking-[0.44em]">
            Maison de Haute Joaillerie · Est. 1962
          </p>
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 2, ease: EASE_OUT }}
            className="h-px w-12 origin-left bg-gold/70 sm:w-16"
            aria-hidden="true"
          />
        </motion.div>

        <h1 className="mt-7 font-display text-[13.5vw] leading-[1.02] font-medium text-ivory sm:text-7xl lg:text-[104px]">
          <LetterReveal text="Where Gold" delay={2.25} stagger={0.032} />
          <br />
          <LetterReveal
            text="Remembers Light"
            delay={2.5}
            stagger={0.032}
            className="font-medium italic"
            letterClassName="gold-text"
          />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.85, ease: EASE_OUT }}
          className="mx-auto mt-7 max-w-xl text-[15px] font-light leading-relaxed tracking-wide text-ivory/75 sm:text-base"
        >
          Rare diamonds, untamed emeralds and 22k gold — composed by hand in our
          atelier for the moments you will never forget.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 3.02, ease: EASE_OUT }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.button
            whileHover={{ scale: 1.045 }}
            whileTap={{ scale: 0.965 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            onClick={() => scrollToId('collections')}
            className="w-full border border-gold bg-gold px-9 py-4 text-[11px] font-normal uppercase tracking-[0.3em] text-noir transition-colors duration-300 hover:bg-champagne sm:w-auto"
          >
            Explore the Collection
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.045 }}
            whileTap={{ scale: 0.965 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            onClick={() => scrollToId('appointment')}
            className="w-full border border-ivory/35 px-9 py-4 text-[11px] font-normal uppercase tracking-[0.3em] text-ivory transition-colors duration-300 hover:border-gold hover:text-gold sm:w-auto"
          >
            Book a Private Viewing
          </motion.button>
        </motion.div>
      </motion.div>

      {/* scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 3.4 }}
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
