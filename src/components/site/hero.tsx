'use client'

import { motion } from 'framer-motion'

const BARS = [0.9, 0.55, 1, 0.7, 0.85, 0.5, 0.95]

export function Hero() {
  return (
    <section
      id="overview"
      aria-label="Hero"
      className="pointer-events-none relative flex min-h-screen flex-col justify-end px-6 pb-24 md:px-16 lg:px-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]"
      >
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          <span className="h-px w-10 bg-amber-300/80" />
          AURA X1 · Flagship ANC Headphones
        </p>
        <h1 className="mt-5 bg-gradient-to-b from-white via-white to-white/25 bg-clip-text text-5xl font-black leading-[0.95] tracking-tight text-transparent md:text-7xl lg:text-8xl">
          HEAR EVERYTHING.
          <br />
          FEEL NOTHING.
        </h1>
        <p className="mt-6 max-w-lg text-sm leading-relaxed text-zinc-400 md:text-base">
          Scroll to explore the machine behind the silence — every part below is rendered live
          in WebGL. Real geometry, real particles, real physics.
        </p>
      </motion.div>

      {/* equalizer accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 right-10 hidden h-10 items-end gap-1.5 md:flex"
        aria-hidden="true"
      >
        {BARS.map((h, i) => (
          <span
            key={i}
            className="eq-bar w-1.5 rounded-full bg-amber-300/70"
            style={{ height: `${h * 100}%`, animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        aria-hidden="true"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-zinc-600 p-1.5">
          <motion.span
            className="h-2 w-1 rounded-full bg-amber-300"
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
          />
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-zinc-500">
          Scroll
        </span>
      </motion.div>
    </section>
  )
}
