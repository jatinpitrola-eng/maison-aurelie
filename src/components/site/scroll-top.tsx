'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { scrollToId } from '@/lib/jewelry-store'

/** Gold sovereign button that surfaces once the descent begins. */
export function ScrollTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 720)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show ? (
        <motion.button
          initial={{ opacity: 0, y: 18, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.85 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          onClick={() => scrollToId('top')}
          className="fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center border border-gold/50 bg-noir/85 text-gold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors duration-300 hover:bg-gold hover:text-noir sm:right-7 sm:bottom-7"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      ) : null}
    </AnimatePresence>
  )
}
