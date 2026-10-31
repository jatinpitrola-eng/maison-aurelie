'use client'

import { motion } from 'framer-motion'

/**
 * Cinematic hero — the product holds the frame alone (with blueprint
 * annotations rendered separately); only a whisper of copy and a scroll cue.
 */
export function Hero() {
  return (
    <section
      id="intro"
      aria-label="Hero"
      className="pointer-events-none relative flex min-h-screen flex-col justify-between px-6 py-24 md:px-14"
    >
      {/* top-left product label */}
      <motion.p
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#f2ead9]/80"
      >
        Aura X1 <span className="text-orange-400">— Flagship ANC Headphones</span>
      </motion.p>

      {/* bottom row: whisper copy + scroll cue */}
      <div className="flex items-end justify-between">
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="max-w-[240px] text-xs leading-relaxed text-zinc-400"
        >
          Rendered live in WebGL. Every surface milled in code — scroll to take it apart.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
          aria-hidden="true"
        >
          <div className="flex h-9 w-6 items-start justify-center rounded-full border border-[#f2ead9]/25 p-1.5">
            <motion.span
              className="h-2 w-1 rounded-full bg-orange-400"
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.7, ease: 'easeInOut' }}
            />
          </div>
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-zinc-500">
            Scroll
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="hidden text-right text-[10px] font-medium uppercase leading-relaxed tracking-[0.25em] text-zinc-500 md:block"
        >
          From
          <br />
          <span className="text-lg font-bold tracking-normal text-[#f2ead9]">$549</span>
        </motion.p>
      </div>
    </section>
  )
}
