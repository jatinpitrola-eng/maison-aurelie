'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

/* Shared scroll-reveal wrapper — soft rise + fade, plays once */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.95, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* Shared section heading — kicker, serif title, hairline gold rule */
export function SectionHeader({
  kicker,
  title,
  sub,
  tone = 'dark',
  align = 'center',
}: {
  kicker: string
  title: ReactNode
  sub?: string
  /** dark = dark background, light = ivory background */
  tone?: 'dark' | 'light'
  align?: 'center' | 'left'
}) {
  const centered = align === 'center'
  return (
    <div className={centered ? 'text-center' : 'text-left'}>
      <Reveal>
        <div
          className={`flex items-center gap-4 ${centered ? 'justify-center' : 'justify-start'}`}
        >
          <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
          <p
            className={`text-[11px] font-light uppercase tracking-[0.42em] ${
              tone === 'dark' ? 'text-gold' : 'text-golddeep'
            }`}
          >
            {kicker}
          </p>
          <span className="h-px w-10 bg-gold/60" aria-hidden="true" />
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={`mt-5 font-display text-4xl leading-[1.08] font-medium sm:text-5xl lg:text-6xl ${
            tone === 'dark' ? 'text-ivory' : 'text-espresso'
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal delay={0.16}>
          <p
            className={`mt-5 max-w-2xl font-sans text-[15px] font-light leading-relaxed tracking-wide ${
              tone === 'dark' ? 'text-ivory/60' : 'text-espresso/65'
            } ${centered ? 'mx-auto' : ''}`}
          >
            {sub}
          </p>
        </Reveal>
      ) : null}
    </div>
  )
}
