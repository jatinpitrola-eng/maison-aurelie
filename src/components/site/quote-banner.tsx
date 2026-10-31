'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export function QuoteBanner() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[72vh] items-center justify-center overflow-hidden"
      aria-label="House philosophy"
    >
      <motion.div style={{ y }} className="absolute inset-0 -top-[14%] -bottom-[14%]">
        <Image
          src="/images/ring-3.jpg"
          alt="The Noir Empress ring — rose gold, black diamond and pavé"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-noir/62" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <span
          className="mb-8 block font-display text-6xl leading-none text-gold/70"
          aria-hidden="true"
        >
          “
        </span>
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl leading-snug font-medium text-ivory sm:text-5xl sm:leading-tight"
        >
          A jewel is a memory
          <br />
          <em className="gold-text">you can wear.</em>
        </motion.blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mt-8 text-[11px] font-light uppercase tracking-[0.42em] text-ivory/60"
        >
          Aurélie Vance · Founder
        </motion.p>
      </div>
    </section>
  )
}
