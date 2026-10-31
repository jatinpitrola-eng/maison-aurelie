'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Sparkles, WordsReveal } from './motion-primitives'

export function QuoteBanner() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  /* two-axis parallax: the photograph drifts down while it slowly zooms */
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[72vh] items-center justify-center overflow-hidden"
      aria-label="House philosophy"
    >
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 -top-[14%] -bottom-[14%]"
      >
        <Image
          src="/images/ring-3.jpg"
          alt="The Noir Empress ring — rose gold, black diamond and pavé"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-noir/62" aria-hidden="true" />
      <Sparkles />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 block font-display text-6xl leading-none text-gold/70"
          aria-hidden="true"
        >
          “
        </motion.span>

        <WordsReveal
          className="font-display text-3xl leading-snug font-medium text-ivory sm:text-5xl sm:leading-tight"
          lines={[
            { words: 'A jewel is a memory' },
            { words: 'you can wear.', accent: true },
          ]}
          stagger={0.07}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.55 }}
          className="mt-8 text-[11px] font-light uppercase tracking-[0.42em] text-ivory/60"
        >
          Aurélie Vance · Founder
        </motion.p>
      </div>
    </section>
  )
}
