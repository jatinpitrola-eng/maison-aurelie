'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export interface Stat {
  value: string
  label: string
}

/**
 * Oryzo-style cinema section — the product holds center stage while a giant
 * headline flanks it on the left and the supporting copy sits on the right.
 */
export function CinemaSection({
  id,
  index,
  tag,
  title,
  body,
  stats,
  chip,
  center = false,
  children,
}: {
  id: string
  index: string
  tag: string
  title: string
  body: string
  stats?: Stat[]
  chip?: string
  center?: boolean
  children?: ReactNode
}) {
  if (center) {
    return (
      <section
        id={id}
        aria-label={tag}
        className="pointer-events-none relative flex min-h-screen flex-col items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-400">{tag}</p>
          <h2 className="mt-5 text-5xl font-black uppercase leading-[0.98] tracking-tight text-[#f2ead9] md:text-7xl">
            {title}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base">{body}</p>
        </motion.div>
      </section>
    )
  }

  return (
    <section
      id={id}
      aria-label={tag}
      className="pointer-events-none relative flex min-h-screen items-center px-6 py-20 md:px-14 lg:px-20"
    >
      <div className="grid w-full grid-cols-1 items-center gap-10 md:grid-cols-[1fr_minmax(0,460px)_1fr] md:gap-6">
        {/* giant headline — left flank */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-18% 0px' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-orange-400">
            {index} — {tag}
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-[0.95] tracking-tight text-[#f2ead9] sm:text-5xl lg:text-6xl">
            {title}
          </h2>
        </motion.div>

        {/* product owns the middle — empty spacer column */}
        <div className="hidden md:block" aria-hidden="true" />

        {/* copy — right flank */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-18% 0px' }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)] md:justify-self-end"
        >
          <p className="max-w-sm text-sm leading-relaxed text-zinc-400 md:text-[15px]">{body}</p>

          {chip ? (
            <span className="mt-6 inline-flex items-center gap-2 border border-orange-400/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
              {chip}
            </span>
          ) : null}

          {children}

          {stats ? (
            <dl className="mt-8 flex gap-8">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd className="text-xl font-bold text-[#f2ead9] md:text-2xl">{s.value}</dd>
                  <dd className="mt-1 text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-500">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </motion.div>
      </div>
    </section>
  )
}
