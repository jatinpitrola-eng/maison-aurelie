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

export function scrollToSection(index: number) {
  const target = index * (typeof window !== 'undefined' ? window.innerHeight : 0)
  if (lenisRef.current) {
    lenisRef.current.scrollTo(target, { duration: 1.4 })
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' })
  }
}
