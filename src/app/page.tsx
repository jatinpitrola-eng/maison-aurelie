'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import { lenisRef, scrollState, useJewelryStore } from '@/lib/jewelry-store'
import { Nav } from '@/components/site/nav'
import { Hero } from '@/components/site/hero'
import { PieceSection } from '@/components/site/piece-section'
import { MetalSwitcher } from '@/components/site/metal-switcher'
import { Vault } from '@/components/site/vault'
import { Appointment } from '@/components/site/appointment'
import { Footer } from '@/components/site/footer'
import { ProgressDots } from '@/components/site/progress-dots'

/* 3D scene is client-only (WebGL can't render on the server) */
const Scene = dynamic(() => import('@/components/three/scene'), { ssr: false })

export default function Home() {
  const mainRef = useRef<HTMLElement>(null)
  const rangeRef = useRef(1)
  const onDark = useJewelryStore((s) => s.onDark)

  useEffect(() => {
    /* deterministic start — ignore browser scroll restoration */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    /* progress maps over the main sections only (footer excluded) so 3D
       keyframes line up with section centers */
    const updateRange = () => {
      const main = mainRef.current
      if (main) rangeRef.current = Math.max(1, main.offsetHeight - window.innerHeight)
    }
    updateRange()
    window.addEventListener('resize', updateRange)
    const ro = new ResizeObserver(updateRange)
    if (mainRef.current) ro.observe(mainRef.current)

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onScroll = (e: Lenis) => {
      if (rangeRef.current <= 1) return
      scrollState.progress = Math.min(1, Math.max(0, e.scroll / rangeRef.current))
      scrollState.velocity = Math.max(-0.55, Math.min(0.55, (e.velocity ?? 0) * 0.0035))
    }
    lenis.on('scroll', onScroll)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('resize', updateRange)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col font-sans text-espresso selection:bg-gold/30">
      {/* ambient backdrop behind the canvas — ivory, then espresso through the vault */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 -z-10 transition-colors duration-700 ${
          onDark ? 'bg-coffee' : 'bg-ivory'
        }`}
      />

      {/* fixed WebGL canvas behind everything */}
      <Scene />

      {/* soft vignette keeps the frame photographic */}
      <div
        className="vignette pointer-events-none fixed inset-0 z-[1]"
        aria-hidden="true"
      />

      <Nav />
      <ProgressDots />

      <main ref={mainRef} className="relative z-10 flex flex-col">
        <Hero />

        <PieceSection id="piece-ring" pieceIndex={0} side="right" />
        <PieceSection id="piece-necklace" pieceIndex={1} side="left" />
        <PieceSection id="piece-earrings" pieceIndex={2} side="right" />
        <PieceSection id="piece-bangle" pieceIndex={3} side="left">
          <MetalSwitcher />
        </PieceSection>

        <Vault />
        <Appointment />
      </main>

      <Footer />
    </div>
  )
}
