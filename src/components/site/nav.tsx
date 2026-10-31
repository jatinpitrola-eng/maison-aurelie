'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { lenisRef, scrollToId } from '@/lib/jewelry-store'

const LINKS = [
  { label: 'Collections', id: 'collections' },
  { label: 'Signature', id: 'signature' },
  { label: 'Atelier', id: 'atelier' },
  { label: 'The Collection', id: 'collection' },
  { label: 'Bridal', id: 'bridal' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (id: string) => {
    setOpen(false)
    // let the overlay close before travelling on mobile
    window.setTimeout(() => scrollToId(id), open ? 250 : 0)
  }

  /* freeze the page behind the mobile overlay */
  useEffect(() => {
    if (!open) return
    const lenis = lenisRef.current
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-gold/15 bg-noir/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[72px] sm:px-8"
          aria-label="Main"
        >
          {/* wordmark */}
          <button
            onClick={() => go('top')}
            className="group flex items-baseline gap-2 outline-none"
            aria-label="AURÉLIE — back to top"
          >
            <span className="font-display text-[26px] font-semibold tracking-[0.18em] text-ivory sm:text-[28px]">
              AURÉLIE
            </span>
            <span
              className="hidden text-[10px] font-light uppercase tracking-[0.34em] text-gold sm:inline"
              aria-hidden="true"
            >
              Maison de Joaillerie
            </span>
          </button>

          {/* desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="group relative py-2 text-[12px] font-light uppercase tracking-[0.26em] text-ivory/80 transition-colors hover:text-gold"
                >
                  {l.label}
                  <span
                    className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button
              onClick={() => go('appointment')}
              className="hidden border border-gold/70 px-5 py-2.5 text-[11px] font-normal uppercase tracking-[0.28em] text-gold transition-all duration-300 hover:bg-gold hover:text-noir sm:block"
            >
              Book a Viewing
            </button>

            {/* mobile toggle */}
            <button
              className="flex h-11 w-11 items-center justify-center text-ivory lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* mobile overlay menu */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-noir/97 px-8 backdrop-blur-lg lg:hidden"
          >
            <ul className="space-y-2">
              {LINKS.map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.45 }}
                >
                  <button
                    onClick={() => go(l.id)}
                    className="w-full border-b border-gold/10 py-4 text-left font-display text-3xl font-medium text-ivory transition-colors hover:text-gold"
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.button
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.45 }}
              onClick={() => go('appointment')}
              className="mt-10 w-full border border-gold bg-gold py-4 text-[12px] font-normal uppercase tracking-[0.3em] text-noir"
            >
              Book a Private Viewing
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
