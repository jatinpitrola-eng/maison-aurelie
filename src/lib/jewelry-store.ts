'use client'

import { create } from 'zustand'
import type Lenis from 'lenis'

/* --------------------------------- Lenis IO -------------------------------- */

/** Lenis instance ref so nav links can smooth-scroll programmatically */
export const lenisRef: { current: Lenis | null } = { current: null }

export function scrollToId(id: string) {
  if (lenisRef.current) {
    lenisRef.current.scrollTo(`#${id}`, {
      duration: 1.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    })
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }
}

/* --------------------------------- UI state --------------------------------- */

interface UIState {
  /** piece or experience pre-selected for the appointment form */
  interest: string
  setInterest: (v: string) => void
}

export const useJewelryStore = create<UIState>((set) => ({
  interest: 'Private Viewing',
  setInterest: (v) => set({ interest: v }),
}))

/* ---------------------------------- Data ----------------------------------- */

export interface Product {
  id: string
  name: string
  category: 'Rings' | 'Necklaces' | 'Earrings' | 'Bangles'
  spec: string
  price: string
  image: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Éternel Solitaire',
    category: 'Rings',
    spec: '2.05 ct old-European cut · 18k gold',
    price: '₹ 11,20,000',
    image: '/images/ring-5.jpg',
  },
  {
    id: 'p2',
    name: 'Trilogy Héritage',
    category: 'Rings',
    spec: 'Three-stone brilliant set · platinum crown',
    price: '₹ 7,85,000',
    image: '/images/ring-2.jpg',
  },
  {
    id: 'p3',
    name: 'Aurore Radiant',
    category: 'Rings',
    spec: 'Radiant-cut solitaire · champagne setting',
    price: '₹ 9,40,000',
    image: '/images/neck-4.jpg',
  },
  {
    id: 'p4',
    name: 'Rivière Émeraude',
    category: 'Necklaces',
    spec: 'Colombian emeralds · 118 baguette diamonds',
    price: '₹ 24,80,000',
    image: '/images/neck-2.jpg',
  },
  {
    id: 'p5',
    name: 'Fleur de Minuit',
    category: 'Necklaces',
    spec: 'Rose gold pendant set · 52 pavé brilliants',
    price: '₹ 3,65,000',
    image: '/images/neck-1.jpg',
  },
  {
    id: 'p6',
    name: 'Cascade Pear Drops',
    category: 'Earrings',
    spec: '4.8 ct pair · pear & round brilliants',
    price: '₹ 6,15,000',
    image: '/images/ear-4.jpg',
  },
  {
    id: 'p7',
    name: 'Mayura Kada',
    category: 'Bangles',
    spec: 'Pair · 22k gold with emerald accents',
    price: '₹ 8,90,000',
    image: '/images/bangle-1.jpg',
  },
  {
    id: 'p8',
    name: 'Rajwada Heritage',
    category: 'Bangles',
    spec: 'Set of four · hand-chased 22k gold',
    price: '₹ 5,75,000',
    image: '/images/bangle-2.jpg',
  },
]

export interface Collection {
  id: string
  no: string
  name: string
  caption: string
  image: string
  target: string
}

export const COLLECTIONS: Collection[] = [
  {
    id: 'c1',
    no: '01',
    name: 'Rings',
    caption: 'The solitaire archive',
    image: '/images/ring-3.jpg',
    target: 'collection',
  },
  {
    id: 'c2',
    no: '02',
    name: 'Necklaces',
    caption: 'Rivières & pendants',
    image: '/images/neck-5.jpg',
    target: 'collection',
  },
  {
    id: 'c3',
    no: '03',
    name: 'Earrings',
    caption: 'Drops, studs & chandeliers',
    image: '/images/ear-1.jpg',
    target: 'collection',
  },
  {
    id: 'c4',
    no: '04',
    name: 'Bangles',
    caption: 'Kadas, cuffs & chooda',
    image: '/images/bangle-4.jpg',
    target: 'collection',
  },
]

export const APPOINTMENT_INTERESTS = [
  'Private Viewing',
  'Bridal Consultation',
  'Custom Commission',
  'Engagement Rings',
  'Éternel Solitaire',
  'Trilogy Héritage',
  'Aurore Radiant',
  'Rivière Émeraude',
  'Fleur de Minuit',
  'Cascade Pear Drops',
  'Mayura Kada',
  'Rajwada Heritage',
] as const
