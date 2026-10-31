'use client'

const ITEMS = [
  'Est. 1962',
  'GIA Certified Diamonds',
  '22k & 18k Hallmarked Gold',
  'Hand-Finished in Our Atelier',
  'Colombian Emeralds',
  'Bespoke Commissions',
  'Lifetime Care',
]

export function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  return (
    <div
      className="relative overflow-hidden border-y border-gold/20 bg-onyx py-5"
      aria-hidden="true"
    >
      <div className="animate-marquee flex w-max items-center">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 text-[11px] font-light uppercase tracking-[0.38em] text-gold/90">
              {item}
            </span>
            <span className="text-[9px] text-gold/50">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
