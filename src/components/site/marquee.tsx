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

const HOUSES = ['Rings', 'Necklaces', 'Earrings', 'Bangles', 'Bridal', 'Bespoke']

export function Marquee() {
  const row = [...ITEMS, ...ITEMS]
  const outlineRow = [...HOUSES, ...HOUSES]
  return (
    <div
      className="relative overflow-hidden border-y border-gold/20 bg-onyx"
      aria-hidden="true"
    >
      {/* top row — house credentials, drifts left */}
      <div className="animate-marquee flex w-max items-center py-5">
        {row.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="px-8 text-[11px] font-light uppercase tracking-[0.38em] text-gold/90">
              {item}
            </span>
            <span className="text-[9px] text-gold/50">✦</span>
          </span>
        ))}
      </div>

      {/* bottom row — outlined house names, drifts right */}
      <div className="border-t border-gold/10">
        <div className="animate-marquee-reverse flex w-max items-center py-3.5">
          {outlineRow.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="text-outline-gold px-8 font-display text-2xl font-medium tracking-[0.14em] uppercase sm:text-3xl">
                {item}
              </span>
              <span className="text-[10px] text-gold/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
