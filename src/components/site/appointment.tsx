'use client'

import { useState } from 'react'
import { CalendarCheck, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { APPOINTMENT_INTERESTS, useJewelryStore } from '@/lib/jewelry-store'
import { Reveal, SectionHeader } from './reveal'

type Status = 'idle' | 'submitting' | 'done' | 'error'

export function Appointment() {
  const interest = useJewelryStore((s) => s.interest)
  const setInterest = useJewelryStore((s) => s.setInterest)

  const [status, setStatus] = useState<Status>('idle')
  const [reference, setReference] = useState('')
  const [error, setError] = useState('')

  /* client-only: stamp the date input's minimum after mount (no SSR mismatch) */
  const dateRef = (el: HTMLInputElement | null) => {
    if (el) el.min = new Date().toISOString().split('T')[0]
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)

    setStatus('submitting')
    setError('')

    try {
      const res = await fetch('/api/reservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(fd.get('name') ?? ''),
          email: String(fd.get('email') ?? ''),
          phone: String(fd.get('phone') ?? ''),
          piece: String(fd.get('interest') ?? ''),
          date: String(fd.get('date') ?? ''),
        }),
      })
      const data: { ok: boolean; id?: string; error?: string } = await res.json()

      if (res.ok && data.ok && data.id) {
        setReference(data.id)
        setStatus('done')
        form.reset()
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
        setStatus('error')
      }
    } catch {
      setError('The salon is unreachable at the moment. Please try again.')
      setStatus('error')
    }
  }

  return (
    <section
      id="appointment"
      className="relative overflow-hidden bg-noir py-24 sm:py-32"
      aria-label="Book a private viewing"
    >
      <div className="glow-gold pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <SectionHeader
          kicker="Private Salon"
          title={
            <>
              Book a <em className="gold-text font-medium">Private Viewing</em>
            </>
          }
          sub="Champagne, quiet rooms and the vault opened only for you. Our concierge will confirm your appointment within a few hours."
        />

        <Reveal delay={0.15}>
          {status === 'done' ? (
            <div className="mt-12 border border-gold/30 bg-onyx p-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
              <h3 className="mt-5 font-display text-3xl font-medium text-ivory">
                Your viewing is requested
              </h3>
              <p className="mt-3 text-sm font-light leading-relaxed tracking-wide text-ivory/60">
                Reference{' '}
                <span className="font-normal tracking-[0.14em] text-gold">
                  {reference.slice(0, 8).toUpperCase()}
                </span>
                <br />
                Our salon concierge will call you within a few hours to confirm the
                hour and the room.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-8 border border-gold/50 px-7 py-3 text-[10px] font-light uppercase tracking-[0.3em] text-gold transition-colors duration-300 hover:bg-gold hover:text-noir"
              >
                Book another
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-12 border border-gold/20 bg-onyx p-6 sm:p-10"
              noValidate={false}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="appt-name" className="text-ivory/70">
                    Full name
                  </Label>
                  <Input
                    id="appt-name"
                    name="name"
                    required
                    minLength={2}
                    placeholder="Aarya Patel"
                    className="border-gold/25 bg-noir/60 text-ivory placeholder:text-ivory/30 focus-visible:ring-gold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appt-email" className="text-ivory/70">
                    Email
                  </Label>
                  <Input
                    id="appt-email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="border-gold/25 bg-noir/60 text-ivory placeholder:text-ivory/30 focus-visible:ring-gold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appt-phone" className="text-ivory/70">
                    Phone <span className="text-ivory/35">(optional)</span>
                  </Label>
                  <Input
                    id="appt-phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="border-gold/25 bg-noir/60 text-ivory placeholder:text-ivory/30 focus-visible:ring-gold"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appt-date" className="text-ivory/70">
                    Preferred date
                  </Label>
                  <div className="relative">
                    <Input
                      ref={dateRef}
                      id="appt-date"
                      name="date"
                      type="date"
                      className="border-gold/25 bg-noir/60 text-ivory focus-visible:ring-gold [&::-webkit-calendar-picker-indicator]:opacity-60"
                    />
                    <CalendarCheck
                      className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gold/60"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="appt-interest" className="text-ivory/70">
                    You wish to view
                  </Label>
                  <Select
                    name="interest"
                    value={interest}
                    onValueChange={(v) => setInterest(v)}
                    required
                  >
                    <SelectTrigger
                      id="appt-interest"
                      className="border-gold/25 bg-noir/60 w-full text-ivory focus-visible:ring-gold"
                    >
                      <SelectValue placeholder="Choose a piece or experience" />
                    </SelectTrigger>
                    <SelectContent className="border-gold/25 bg-onyx text-ivory">
                      {APPOINTMENT_INTERESTS.map((it) => (
                        <SelectItem
                          key={it}
                          value={it}
                          className="focus:bg-gold/15 focus:text-gold"
                        >
                          {it}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="appt-note" className="text-ivory/70">
                    A note for the concierge <span className="text-ivory/35">(optional)</span>
                  </Label>
                  <Textarea
                    id="appt-note"
                    name="note"
                    rows={3}
                    placeholder="An anniversary, a size, a stone you are searching for…"
                    className="resize-none border-gold/25 bg-noir/60 text-ivory placeholder:text-ivory/30 focus-visible:ring-gold"
                  />
                </div>
              </div>

              {status === 'error' ? (
                <p role="alert" className="mt-6 text-sm text-red-400">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={status === 'submitting'}
                className="mt-8 w-full cursor-pointer bg-gold py-6 text-[11px] font-normal uppercase tracking-[0.32em] text-noir transition-colors duration-300 hover:bg-champagne disabled:opacity-60 sm:w-auto sm:px-12"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Sending request…
                  </>
                ) : (
                  'Request Appointment'
                )}
              </Button>

              <p className="mt-5 text-[11px] font-light tracking-[0.12em] text-ivory/35">
                Viewings are held at our salons in Ahmedabad, Mumbai and Paris.
                Mon–Sat, 10:30–20:00.
              </p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}
