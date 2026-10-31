'use client'

import { create } from 'zustand'
import type Lenis from 'lenis'

/* ---------------------------------- colors --------------------------------- */

export interface ProductColor {
  id: string
  name: string
  hex: string
  swatch: string
}

export const PRODUCT_COLORS: ProductColor[] = [
  { id: 'obsidian', name: 'Obsidian', hex: '#26282f', swatch: '#2b2d35' },
  { id: 'moonstone', name: 'Moonstone', hex: '#d6d7db', swatch: '#d6d7db' },
  { id: 'terracotta', name: 'Terracotta', hex: '#a4583a', swatch: '#b05f3c' },
]

interface ProductState {
  colorId: string
  setColor: (id: string) => void
}

export const useProductStore = create<ProductState>((set) => ({
  colorId: 'obsidian',
  setColor: (id) => set({ colorId: id }),
}))

export function getColor(id: string): ProductColor {
  return PRODUCT_COLORS.find((c) => c.id === id) ?? PRODUCT_COLORS[0]
}

/* --------------------------------- products --------------------------------- */

export interface ProductInfo {
  id: string
  name: string
  tagline: string
  price: string
  spec: string
}

export const PRODUCTS: ProductInfo[] = [
  { id: 'x1', name: 'AURA X1', tagline: 'Over-ear flagship', price: '$549', spec: '40 h · ANC −48 dB' },
  { id: 'buds', name: 'AURA Buds', tagline: 'Pocket silence', price: '$249', spec: '32 h · ANC −42 dB' },
  { id: 'orb', name: 'AURA Orb', tagline: '360° home speaker', price: '$399', spec: 'Room-filling array' },
]

/* ------------------------------ 3D animation IO ------------------------------ */

/** Shared mutable driver value (0..1) written by rigs, read inside model useFrames */
export interface Driver {
  current: number
}

export const zeroDriver: Driver = { current: 0 }
export const oneDriver: Driver = { current: 1 }

/* ------------------------- shared mutable scroll state ---------------------- */
/* Read inside useFrame without triggering React re-renders. */

export const scrollState = {
  /** 0 → 1 across the whole page */
  progress: 0,
  /** clamped, scaled scroll velocity for particle turbulence */
  velocity: 0,
}

/* Lenis instance ref so nav links / dots can smooth-scroll programmatically */
export const lenisRef: { current: Lenis | null } = { current: null }

/* expose for live debugging in the browser console */
if (typeof window !== 'undefined') {
  const w = window as unknown as { __aura: typeof scrollState; __auraLenis: typeof lenisRef }
  w.__aura = scrollState
  w.__auraLenis = lenisRef
}

export function scrollToSection(index: number) {
  const target = index * (typeof window !== 'undefined' ? window.innerHeight : 0)
  if (lenisRef.current) {
    lenisRef.current.scrollTo(target, { duration: 1.4 })
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' })
  }
}
