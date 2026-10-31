'use client'

import { motion } from 'framer-motion'
import { scrollToId } from '@/lib/jewelry-store'

const HOUSE_LINKS = [
  { label: 'Collections', id: 'collections' },
  { label: 'Signature — Rivière Émeraude', id: 'signature' },
  { label: 'The Atelier', id: 'atelier' },
  { label: 'The Vault', id: 'collection' },
  { label: 'Bridal Atelier', id: 'bridal' },
]

const SALONS = [
  ['Ahmedabad', 'One Sanskriti, CG Road'],
  ['Mumbai', 'Kala Ghoda, Fort'],
  ['Paris', '12 Place Vendôme'],
]

export function Footer() {
  return (
    <footer className="mt-auto border-t border-gold/15 bg-noir" aria-label="Footer">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          {/* brand */}
          <div className="md:col-span-5">
            <p className="font-display text-3xl font-semibold tracking-[0.18em] text-ivory">
              AURÉLIE
            </p>
            <p className="mt-1 text-[10px] font-light uppercase tracking-[0.34em] text-gold">
              Maison de Joaillerie · Est. 1962
            </p>
            <p className="mt-5 max-w-sm text-[13px] font-light leading-relaxed tracking-wide text-ivory/50">
              Rare stones, hand-forged gold and sixty years of one craft. Every
              piece is signed by the jeweller who made it — and cared for by the
              maison, for life.
            </p>
          </div>

          {/* house links */}
          <nav className="md:col-span-3" aria-label="Footer navigation">
            <p className="text-[10px] font-light uppercase tracking-[0.34em] text-gold">
              The House
            </p>
            <ul className="mt-5 space-y-3">
              {HOUSE_LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollToId(l.id)}
                    className="text-[13px] font-light tracking-wide text-ivory/60 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* salons */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-light uppercase tracking-[0.34em] text-gold">
              Salons
            </p>
            <ul className="mt-5 space-y-4">
              {SALONS.map(([city, addr]) => (
                <li key={city}>
                  <p className="text-[13px] tracking-[0.12em] text-ivory/75 uppercase">
                    {city}
                  </p>
                  <p className="mt-0.5 text-[12px] font-light text-ivory/45">{addr}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div className="md:col-span-2">
            <p className="text-[10px] font-light uppercase tracking-[0.34em] text-gold">
              Concierge
            </p>
            <ul className="mt-5 space-y-3 text-[13px] font-light text-ivory/60">
              <li>
                <a
                  href="tel:+919876543210"
                  className="transition-colors hover:text-gold"
                >
                  +91 98765 43210
                </a>
              </li>
              <li>
                <a
                  href="mailto:care@aureliejewels.com"
                  className="transition-colors hover:text-gold"
                >
                  care@aureliejewels.com
                </a>
              </li>
              <li className="text-ivory/40">Mon–Sat · 10:30–20:00</li>
            </ul>
            <button
              onClick={() => scrollToId('appointment')}
              className="mt-6 border border-gold/60 px-5 py-2.5 text-[10px] font-light uppercase tracking-[0.28em] text-gold transition-all duration-300 hover:bg-gold hover:text-noir"
            >
              Book a Viewing
            </button>
          </div>
        </div>
      </div>

      {/* monumental watermark rising from the gold leaf edge */}
      <motion.div
        initial="closed"
        whileInView="open"
        viewport={{ once: true, margin: '-40px' }}
        variants={{ closed: {}, open: {} }}
        className="pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <motion.p
          variants={{
            closed: { y: '46%', opacity: 0 },
            open: {
              y: '14%',
              opacity: 1,
              transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="text-outline-gold -mb-[0.16em] text-center font-display text-[21vw] leading-[0.9] font-semibold tracking-[0.06em] select-none"
        >
          AURÉLIE
        </motion.p>
      </motion.div>

      <div className="border-t border-gold/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 pt-6 pb-24 sm:flex-row sm:px-8 sm:pt-6 sm:pb-20">
          <p className="max-w-full text-center text-[11px] font-light tracking-[0.18em] text-ivory/40">
            © {new Date().getFullYear()} Maison Aurélie. All rights reserved.
          </p>
          <p className="max-w-full text-center text-[11px] font-light tracking-[0.18em] text-ivory/40">
            GIA Certified · BIS Hallmarked · Lifetime Care
          </p>
        </div>
      </div>
    </footer>
  )
}
