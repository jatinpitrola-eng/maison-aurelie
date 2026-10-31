'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { lenisRef } from '@/lib/jewelry-store'
import { Nav } from '@/components/site/nav'
import { Hero } from '@/components/site/hero'
import { Marquee } from '@/components/site/marquee'
import { Collections } from '@/components/site/collections'
import { Signature } from '@/components/site/signature'
import { QuoteBanner } from '@/components/site/quote-banner'
import { Atelier } from '@/components/site/atelier'
import { Products } from '@/components/site/products'
import { BridalBanner } from '@/components/site/bridal-banner'
import { Testimonials } from '@/components/site/testimonials'
import { Appointment } from '@/components/site/appointment'
import { Footer } from '@/components/site/footer'

export default function Home() {
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    /* deterministic start — ignore browser scroll restoration */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-noir font-sans text-ivory selection:bg-gold/30">
      <Nav />

      <main ref={mainRef} className="relative flex flex-col">
        <Hero />
        <Marquee />
        <Collections />
        <Signature />
        <QuoteBanner />
        <Atelier />
        <Products />
        <BridalBanner />
        <Testimonials />
        <Appointment />
      </main>

      <Footer />
    </div>
  )
}
