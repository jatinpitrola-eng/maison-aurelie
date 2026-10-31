'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BatteryCharging, Bluetooth, Feather, Loader2, Zap, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const SPECS = [
  { icon: BatteryCharging, value: '40 h', label: 'Battery life, ANC on' },
  { icon: Zap, value: '5 h', label: 'From a 10-min USB-C charge' },
  { icon: Bluetooth, value: '5.4 LE', label: 'Lossless 24-bit audio' },
  { icon: Feather, value: '384 g', label: 'Milled aluminium body' },
]

export function SpecSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function preorder(e: React.FormEvent) {
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
      id="specs"
      aria-label="Specifications and pre-order"
      className="pointer-events-none relative flex min-h-screen flex-col justify-center px-6 py-28 md:px-16 lg:px-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 56 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto mx-auto w-full max-w-4xl drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]"
      >
        <p className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-amber-300">
          <span className="h-px w-8 bg-amber-300/80" />
          05 · Specs
          <span className="h-px w-8 bg-amber-300/80" />
        </p>
        <h2 className="mt-4 text-center text-4xl font-black tracking-tight text-white md:text-6xl">
          Every number. No noise.
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {SPECS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm transition-colors hover:border-amber-300/30 md:p-6"
            >
              <s.icon className="h-5 w-5 text-amber-300" aria-hidden="true" />
              <p className="mt-4 text-2xl font-bold text-white md:text-3xl">{s.value}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* pre-order block */}
        <div className="mt-10 flex flex-col gap-8 rounded-3xl border border-amber-300/20 bg-gradient-to-b from-amber-400/10 to-transparent p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-zinc-500">From</p>
            <p className="mt-1 text-4xl font-black text-white md:text-5xl">
              $549
              <span className="ml-2 align-middle text-sm font-medium text-zinc-500">ships March 2026</span>
            </p>
          </div>

          <form onSubmit={preorder} className="w-full max-w-md" aria-label="Pre-order form">
            <div className="flex gap-3">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="h-12 border-white/15 bg-white/[0.06] text-white placeholder:text-zinc-500 focus-visible:ring-amber-300/60"
              />
              <Button
                type="submit"
                disabled={status === 'loading'}
                className="h-12 shrink-0 bg-amber-300 px-6 font-bold text-black hover:bg-amber-200"
              >
                {status === 'loading' ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  'Pre-order'
                )}
              </Button>
            </div>
            <p
              role="status"
              className={`mt-3 flex items-center gap-2 text-sm ${
                status === 'error' ? 'text-red-400' : 'text-emerald-400'
              }`}
            >
              {status === 'ok' ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : null}
              {message}
            </p>
          </form>
        </div>
      </motion.div>
    </section>
  )
}
