'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { PIECES, scrollToId } from '@/lib/jewelry-store'

interface PieceSectionProps {
  id: string
  pieceIndex: number
  /** which side the copy sits on — the 3D piece takes the other side */
  side: 'left' | 'right'
  children?: React.ReactNode
}

export function PieceSection({ id, pieceIndex, side, children }: PieceSectionProps) {
  const piece = PIECES[pieceIndex]

  return (
    <section id={id} className="relative flex h-screen items-center" aria-label={piece.name}>
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-2 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.4, once: false }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={`max-w-xl rounded-2xl bg-parchment/55 p-6 backdrop-blur-md sm:p-8 ${
            side === 'right' ? 'lg:col-start-2 lg:justify-self-end' : 'lg:col-start-1'
          } lg:rounded-none lg:bg-transparent lg:p-0 lg:backdrop-blur-none`}
        >
          <div className="mb-6 h-px w-14 bg-gold/70" />

          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-golddeep">
            Nº {piece.no} — {piece.kind}
          </p>

          <h2 className="font-display text-5xl leading-[1.02] text-espresso sm:text-6xl lg:text-7xl">
            {piece.name}
          </h2>

          <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-sand">{piece.gem}</p>

          <p className="mt-6 max-w-md leading-relaxed text-espresso/70">{piece.blurb}</p>

          {children}

          <p className="mt-8 font-display text-xl italic text-sand">Price upon request</p>

          <button
            onClick={() => scrollToId('appointment')}
            className="group mt-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-espresso"
          >
            <span className="border-b border-golddeep/60 pb-1 transition-colors group-hover:text-golddeep">
              Enquire for a viewing
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-golddeep transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
