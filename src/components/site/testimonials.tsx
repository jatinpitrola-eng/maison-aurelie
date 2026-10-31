'use client'

import { Star } from 'lucide-react'
import { Reveal, SectionHeader } from './reveal'

const QUOTES = [
  {
    quote:
      'My bridal set was finished three days before the wedding — and my grandmother cried when she saw it. It now waits, in the same box, for my daughter.',
    name: 'Anaya Desai',
    detail: 'Bridal Commission · Ahmedabad',
  },
  {
    quote:
      'They re-cut a stone I inherited until it finally held the light the way my mother described it. That is not service — that is devotion.',
    name: 'Rohan & Meera Kapoor',
    detail: 'Heirloom Restoration · Mumbai',
  },
  {
    quote:
      'I have bought from Place Vendôme and from Johri Bazaar. Aurélie is the only house where both the craft and the courtesy feel equal.',
    name: 'Sofia D’Souza',
    detail: 'Private Viewing · Paris',
  },
]

export function Testimonials() {
  return (
    <section className="bg-parchment py-24 text-espresso sm:py-32" aria-label="Client words">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeader
          tone="light"
          kicker="Client Words"
          title={
            <>
              Kept, like the <em className="text-golddeep">jewels</em>
            </>
          }
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <Reveal key={q.name} delay={0.1 * i}>
              <figure className="flex h-full flex-col border border-espresso/10 bg-ivory/70 p-7 transition-shadow duration-500 hover:shadow-[0_18px_50px_-24px_rgba(25,21,18,0.35)] sm:p-8">
                <div className="flex gap-1 text-golddeep" aria-label="Five star review">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="mt-5 flex-1 font-display text-[21px] leading-relaxed font-medium text-espresso/85 italic">
                  “{q.quote}”
                </blockquote>
                <figcaption className="mt-7 border-t border-espresso/10 pt-5">
                  <p className="text-[13px] font-normal tracking-[0.14em] uppercase">
                    {q.name}
                  </p>
                  <p className="mt-1 text-[11px] font-light tracking-[0.18em] text-espresso/50 uppercase">
                    {q.detail}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
