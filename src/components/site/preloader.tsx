'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { lenisRef } from '@/lib/jewelry-store'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

/** A two-second couture curtain — monogram, gold rule, then the reveal. */
export function Preloader() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    /* lock the room: stop Lenis + swallow wheel/touch while the curtain is up */
    const lock = (e: Event) => e.preventDefault()
    const stopT = window.setTimeout(() => lenisRef.current?.stop(), 60)
    window.addEventListener('wheel', lock, { passive: false, capture: true })
    window.addEventListener('touchmove', lock, { passive: false, capture: true })
    const t = window.setTimeout(() => setDone(true), 2000)
    return () => {
      window.clearTimeout(t)
      window.clearTimeout(stopT)
      window.removeEventListener('wheel', lock, { capture: true })
      window.removeEventListener('touchmove', lock, { capture: true })
    }
  }, [])

  useEffect(() => {
    if (done) lenisRef.current?.start()
  }, [done])

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeInOut' }}
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-noir"
          aria-hidden="true"
        >
          <div className="flex overflow-hidden">
            {'AURÉLIE'.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.85, delay: 0.15 + i * 0.06, ease: EASE_OUT }}
                className="font-display text-4xl font-semibold tracking-[0.22em] text-ivory sm:text-5xl"
              >
                {ch}
              </motion.span>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-3 text-[10px] font-light uppercase tracking-[0.5em] text-gold"
          >
            Maison de Joaillerie
          </motion.p>

          <div className="mt-8 h-px w-40 overflow-hidden bg-gold/15">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 1.5, delay: 0.35, ease: EASE_OUT }}
              className="h-full w-full bg-gold"
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
