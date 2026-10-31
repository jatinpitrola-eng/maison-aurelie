'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'
import { PRODUCTS } from '@/lib/product-store'

/**
 * Oryzo-style statement ending — big claim, underline email field with an
 * arrow, product row, minimal legal line. The 3D collection floats behind.
 */
export function ReserveSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function reserve(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { message?: string; error?: string }
      if (!res.ok) {
        setStatus('error')
        setMessage(data.error ?? 'Something went wrong. Try again.')
        return
      }
      setStatus('ok')
      setMessage(data.message ?? 'You are on the list.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Network error — please try again.')
    }
  }

  return (
    <section
      id="reserve"
      aria-label="The collection and reservation"
      className="pointer-events-none relative flex min-h-screen flex-col justify-center px-6 py-24 md:px-14 lg:px-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto mx-auto w-full max-w-3xl text-center drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-orange-400">
          The Collection
        </p>
        <h2 className="mt-5 text-4xl font-black uppercase leading-[1.02] tracking-tight text-[#f2ead9] md:text-6xl">
          If we can sell silence, imagine what we can do for your{' '}
          <span className="text-orange-400">ears.</span>
        </h2>

        {/* product row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {PRODUCTS.map((p) => (
            <div key={p.id} className="flex items-baseline gap-2">
              <span className="text-sm font-bold uppercase tracking-[0.18em] text-[#f2ead9]">
                {p.name}
              </span>
              <span className="text-xs text-zinc-500">{p.tagline}</span>
              <span className="text-sm font-bold text-orange-400">{p.price}</span>
            </div>
          ))}
        </div>

        {/* underline email form */}
        <form onSubmit={reserve} aria-label="Reserve form" className="mx-auto mt-12 max-w-xl">
          <div className="flex items-center gap-4 border-b border-[#f2ead9]/25 pb-3 transition-colors focus-within:border-orange-400">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR EMAIL"
              aria-label="Email address"
              className="w-full bg-transparent text-sm font-medium uppercase tracking-[0.2em] text-[#f2ead9] placeholder:text-zinc-600 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              aria-label="Reserve"
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#f2ead9]/25 transition-all hover:border-orange-400 hover:bg-orange-400/10 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <Loader2 className="h-4 w-4 animate-spin text-orange-300" aria-hidden="true" />
              ) : (
                <ArrowRight className="h-4 w-4 text-[#f2ead9] transition-transform group-hover:translate-x-0.5 group-hover:text-orange-300" aria-hidden="true" />
              )}
            </button>
          </div>
          <p
            role="status"
            className={`mt-4 flex min-h-5 items-center justify-center gap-2 text-sm ${
              status === 'error' ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {status === 'ok' ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : null}
            {message}
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-600">
            Ships March 2026 · No spam, one email
          </p>
        </form>
      </motion.div>
    </section>
  )
}
