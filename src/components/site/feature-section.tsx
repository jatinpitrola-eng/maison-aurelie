'use client'

import { motion } from 'framer-motion'

export interface Stat {
  value: string
  label: string
}

export function FeatureSection({
  id,
  index,
  tag,
  title,
  body,
  stats,
  align = 'left',
  chip,
}: {
  id: string
  index: string
  tag: string
  title: string
  body: string
  stats: Stat[]
  align?: 'left' | 'right'
  chip?: string
}) {
  return (
    <section
      id={id}
      aria-label={tag}
      className="pointer-events-none relative flex min-h-screen items-center px-6 md:px-16 lg:px-24"
    >
      {/* ghost index numeral */}
      <span
        aria-hidden="true"
        className={`absolute top-24 hidden select-none text-[9rem] font-black leading-none text-white/[0.045] md:block ${
          align === 'right' ? 'left-10' : 'right-10'
        }`}
      >
        {index}
      </span>

      <motion.div
        initial={{ opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-18% 0px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className={`pointer-events-auto max-w-md drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)] ${
          align === 'right' ? 'ml-auto' : ''
        }`}
      >
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          <span className="h-px w-8 bg-amber-300/80" />
          {index} · {tag}
        </p>
        <h2 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-5xl">
          {title}
        </h2>
        <p className="mt-5 text-sm leading-relaxed text-zinc-400 md:text-base">{body}</p>

        {chip ? (
          <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300" />
            {chip}
          </span>
        ) : null}

        <dl className="mt-9 flex gap-8">
          {stats.map((s) => (
            <div key={s.label}>
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-2xl font-bold text-amber-200 md:text-3xl">{s.value}</dd>
              <dd className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                {s.label}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  )
}
