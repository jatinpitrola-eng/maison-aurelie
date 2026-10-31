'use client'

import { motion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { scrollToId } from '@/lib/jewelry-store'

const rise = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

export function Hero() {
  return (
    <section id="hero" className="relative flex h-screen items-center">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        <div className="max-w-xl">
          <motion.p
            {...rise}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-[11px] uppercase tracking-[0.34em] text-golddeep"
          >
            Maison de Haute Joaillerie · Paris, 1924
          </motion.p>

          <motion.h1
            {...rise}
            transition={{ duration: 1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-6xl leading-[0.98] text-espresso sm:text-7xl lg:text-8xl"
          >
            Light, set
            <br />
            <em className="text-golddeep">in stone.</em>
          </motion.h1>

          <motion.p
            {...rise}
            transition={{ duration: 1, delay: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-md leading-relaxed text-espresso/70"
          >
            Rare diamonds and untamed coloured gems, composed by hand in our Paris
            atelier. One piece at a time — never twice.
          </motion.p>

          <motion.div
            {...rise}
            transition={{ duration: 1, delay: 0.52, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <button
              onClick={() => scrollToId('piece-ring')}
              className="bg-espresso px-7 py-3.5 text-[11px] uppercase tracking-[0.24em] text-champagne transition-colors duration-300 hover:bg-golddeep"
            >
              Discover the Collection
            </button>
            <button
              onClick={() => scrollToId('appointment')}
              className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-espresso"
            >
              <span className="border-b border-golddeep/60 pb-1 transition-colors group-hover:text-golddeep">
                Book a Private Viewing
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-golddeep transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* house marks */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.8 }}
        className="absolute inset-x-0 bottom-8 hidden justify-between px-12 sm:flex lg:px-24"
      >
        {['GIA & Gübelin certified', '18k gold · Platinum 950', 'Hand-finished · Rue de la Paix'].map(
          (item, i) => (
            <span
              key={item}
              className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-espresso/45 ${
                i === 1 ? 'lg:hidden' : ''
              }`}
            >
              <span className="h-1 w-1 rotate-45 bg-gold" />
              {item}
            </span>
          ),
        )}
      </motion.div>

      {/* scroll cue */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        onClick={() => scrollToId('piece-ring')}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        aria-label="Scroll to collection"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-espresso/40">Scroll</span>
        <ArrowDown className="h-4 w-4 animate-bounce text-golddeep" />
      </motion.button>
    </section>
  )
}
