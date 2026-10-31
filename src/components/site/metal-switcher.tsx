'use client'

import { METALS, useJewelryStore } from '@/lib/jewelry-store'

export function MetalSwitcher() {
  const metal = useJewelryStore((s) => s.metal)
  const setMetal = useJewelryStore((s) => s.setMetal)

  return (
    <div className="mt-8">
      <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-sand">
        Finish — <span className="text-golddeep">{METALS[metal].note}</span>
      </p>
      <div className="flex flex-wrap gap-3" role="group" aria-label="Metal finish">
        {Object.values(METALS).map((m) => {
          const active = metal === m.id
          return (
            <button
              key={m.id}
              onClick={() => setMetal(m.id)}
              aria-pressed={active}
              className={`flex items-center gap-3 rounded-full border px-4 py-2.5 transition-all duration-300 ${
                active
                  ? 'border-golddeep bg-gold/10 shadow-[0_0_0_1px_rgba(140,109,31,0.25)]'
                  : 'border-espresso/15 hover:border-golddeep/60'
              }`}
            >
              <span
                className="h-5 w-5 rounded-full shadow-inner ring-1 ring-espresso/10"
                style={{ background: m.swatch }}
                aria-hidden="true"
              />
              <span
                className={`text-[11px] uppercase tracking-[0.16em] ${
                  active ? 'text-espresso' : 'text-espresso/65'
                }`}
              >
                {m.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
