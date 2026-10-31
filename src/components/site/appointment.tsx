'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronDown, Loader2 } from 'lucide-react'
import { PIECES } from '@/lib/jewelry-store'

type Status = 'idle' | 'sending' | 'done' | 'error'

const inputCls =
  'h-11 w-full rounded-none border-0 border-b border-espresso/20 bg-transparent px-0 text-sm text-espresso placeholder:text-espresso/35 focus-visible:outline-none focus-visible:border-golddeep focus-visible:ring-0 transition-colors'

export function Appointment() {
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    piece: PIECES[0].name,
  })

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')
    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error ?? 'Could not send your request.')
      }
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send your request.')
      setStatus('error')
    }
  }

  return (
    <section id="appointment" className="relative flex min-h-screen items-center py-28" aria-label="Book an appointment">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.3, once: false }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-xl px-6 lg:px-0"
      >
        <div className="border border-espresso/10 bg-parchment p-8 shadow-[0_32px_90px_-48px_rgba(32,26,18,0.4)] sm:p-10">
          <div className="mb-6 h-px w-14 bg-gold/70" />
          <p className="mb-3 text-[11px] uppercase tracking-[0.3em] text-golddeep">The Salon</p>
          <h2 className="font-display text-4xl leading-tight text-espresso sm:text-5xl">
            Reserve a private viewing
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-espresso/60">
            Twenty minutes, a locked room, and whatever has caught your eye. No
            obligation — only champagne and diamonds.
          </p>

          {status === 'done' ? (
            <div className="mt-10 border border-golddeep/25 bg-gold/5 p-8 text-center">
              <span className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-golddeep/40">
                <Check className="h-5 w-5 text-golddeep" />
              </span>
              <h3 className="font-display text-2xl italic text-espresso">Avec plaisir.</h3>
              <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-espresso/60">
                Your request has been received. Our salon will write to you within one
                working day to confirm the hour.
              </p>
              <button
                onClick={() => {
                  setStatus('idle')
                  setForm({ name: '', email: '', phone: '', piece: PIECES[0].name })
                }}
                className="mt-6 text-[11px] uppercase tracking-[0.24em] text-golddeep underline-offset-4 hover:underline"
              >
                Book another viewing
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-6">
              <div>
                <label htmlFor="apt-name" className="mb-1.5 block text-[10px] uppercase tracking-[0.24em] text-espresso/50">
                  Full name
                </label>
                <input
                  id="apt-name"
                  required
                  minLength={2}
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Amélie Laurent"
                  className={inputCls}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="apt-email" className="mb-1.5 block text-[10px] uppercase tracking-[0.24em] text-espresso/50">
                    Email
                  </label>
                  <input
                    id="apt-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={set('email')}
                    placeholder="you@maison.fr"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="apt-phone" className="mb-1.5 block text-[10px] uppercase tracking-[0.24em] text-espresso/50">
                    Phone <span className="normal-case text-espresso/30">optional</span>
                  </label>
                  <input
                    id="apt-phone"
                    type="tel"
                    value={form.phone}
                    onChange={set('phone')}
                    placeholder="+33 …"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="apt-piece" className="mb-1.5 block text-[10px] uppercase tracking-[0.24em] text-espresso/50">
                  The piece
                </label>
                <select
                  id="apt-piece"
                  value={form.piece}
                  onChange={set('piece')}
                  className={`${inputCls} appearance-none pr-8`}
                >
                  {PIECES.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="The full collection">The full collection</option>
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-4 right-1 h-4 w-4 text-espresso/40" />
              </div>

              {status === 'error' && <p className="text-sm text-[#A0322D]">{error}</p>}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="flex h-12 w-full items-center justify-center gap-2 bg-espresso text-[11px] uppercase tracking-[0.24em] text-champagne transition-colors duration-300 hover:bg-golddeep disabled:opacity-60"
              >
                {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
                Request Appointment
              </button>

              <p className="text-center text-[10px] uppercase tracking-[0.22em] text-espresso/35">
                21 Rue de la Paix, Paris · By appointment only
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  )
}
