'use client'

import { create } from 'zustand'
import type Lenis from 'lenis'

/* --------------------------------- metals --------------------------------- */

export type MetalKey = 'yellow' | 'rose' | 'platinum'

export interface Metal {
  id: MetalKey
  name: string
  note: string
  /** PBR base color for the 3D metal material */
  color: string
  roughness: number
  /** css gradient for the UI swatch */
  swatch: string
}

export const METALS: Record<MetalKey, Metal> = {
  yellow: {
    id: 'yellow',
    name: 'Yellow Gold',
    note: '18k — warm, eternal',
    color: '#E3B15C',
    roughness: 0.16,
    swatch: 'linear-gradient(135deg,#F5D78E 0%,#C89337 55%,#8C6420 100%)',
  },
  rose: {
    id: 'rose',
    name: 'Rose Gold',
    note: '18k — blush of dawn',
    color: '#DFA583',
    roughness: 0.18,
    swatch: 'linear-gradient(135deg,#F4C9AC 0%,#D08D67 55%,#9A5E41 100%)',
  },
  platinum: {
    id: 'platinum',
    name: 'Platinum',
    note: '950 — cool, rare',
    color: '#D7D7D0',
    roughness: 0.22,
    swatch: 'linear-gradient(135deg,#F0F0EB 0%,#B9B9B2 55%,#7E7E78 100%)',
  },
}

/* --------------------------------- pieces ---------------------------------- */

export interface Piece {
  id: string
  no: string
  name: string
  kind: string
  gem: string
  blurb: string
}

export const PIECES: Piece[] = [
  {
    id: 'ring',
    no: '01',
    name: 'Solitaire Éternel',
    kind: 'Ring',
    gem: 'Brilliant-cut diamond · 2.1 ct · D, Flawless',
    blurb:
      'One stone. Six claws. Nothing else. The Éternel lifts its diamond on whisper-thin claws so light enters from every side — cut over eleven weeks to a heart of fifty-seven facets.',
  },
  {
    id: 'necklace',
    no: '02',
    name: 'Rivière de Lumière',
    kind: 'Necklace',
    gem: 'Colombian emerald · 4.6 ct · 118 diamonds',
    blurb:
      'A river of gold narrows to a single Muzo emerald, set to float a millimetre above the skin. Worn once by a duchess; reimagined — line by line — for you.',
  },
  {
    id: 'earrings',
    no: '03',
    name: 'Cascade',
    kind: 'Ear pendants',
    gem: 'Burmese rubies · Akoya pearls',
    blurb:
      'Two pigeon-blood rubies fall from Akoya pearls on links fine as thread. They move as you move — the whole pendant is articulated through seventeen invisible joints.',
  },
  {
    id: 'bangle',
    no: '04',
    name: 'Onde',
    kind: 'Bangle',
    gem: 'Champagne citrines · hand-twisted gold',
    blurb:
      'Onde means wave. A single ribbon of precious metal is twisted, chased and polished for ninety hours, then set with six citrines the colour of late-afternoon sun. Choose your finish below — the piece re-pours live.',
  },
  {
    id: 'tiara',
    no: '05',
    name: 'Impératrice',
    kind: 'High-jewelry tiara',
    gem: 'Rubies & diamonds · drawn by hand',
    blurb:
      'Nine marquise stones rise from a hand-drawn band like a crown of flame. Our most asked-for commission — shown here from the vault, seen by appointment only.',
  },
]

/* ---------------------------------- ui state -------------------------------- */

interface UIState {
  metal: MetalKey
  setMetal: (m: MetalKey) => void
  /** true while the dark "vault" chapter owns the screen */
  onDark: boolean
  setOnDark: (v: boolean) => void
}

export const useJewelryStore = create<UIState>((set) => ({
  metal: 'yellow',
  setMetal: (m) => set({ metal: m }),
  onDark: false,
  setOnDark: (v) => set({ onDark: v }),
}))

/* ------------------------------ 3D animation IO ----------------------------- */

/** Mutable scroll state — read inside useFrame without React re-renders. */
export const scrollState = {
  /** 0 → 1 across the whole page */
  progress: 0,
  /** clamped scroll velocity for ambient motion */
  velocity: 0,
}

/** Mutable pointer state tracked on window (canvas sits under DOM content). */
export const pointerState = { x: 0, y: 0 }

/* Lenis instance ref so nav links / dots can smooth-scroll programmatically */
export const lenisRef: { current: Lenis | null } = { current: null }

/* expose for live debugging in the browser console */
if (typeof window !== 'undefined') {
  const w = window as unknown as { __aurelie: typeof scrollState; __aurelieLenis: typeof lenisRef }
  w.__aurelie = scrollState
  w.__aurelieLenis = lenisRef
}

export function scrollToId(id: string) {
  if (lenisRef.current) {
    lenisRef.current.scrollTo(`#${id}`, { duration: 1.7, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}
