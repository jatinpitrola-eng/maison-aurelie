'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import { scrollState, lenisRef } from '@/lib/product-store'
import { Nav } from '@/components/site/nav'
import { Hero } from '@/components/site/hero'
import { FeatureSection } from '@/components/site/feature-section'
import { ColorSection } from '@/components/site/color-section'
import { SpecSection } from '@/components/site/spec-section'
import { ProgressDots } from '@/components/site/progress-dots'
import { Footer } from '@/components/site/footer'

/* 3D scene is client-only (WebGL can't render on the server) */
const Scene = dynamic(() => import('@/components/three/scene'), { ssr: false })

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenisRef.current = lenis

    let raf = 0
    const loop = (time: number) => {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onScroll = (e: Lenis) => {
      scrollState.progress = typeof e.progress === 'number' ? e.progress : 0
      // clamp + scale px/frame velocity into a shader-friendly range
      scrollState.velocity = Math.max(-0.55, Math.min(0.55, (e.velocity ?? 0) * 0.0035))
    }
    lenis.on('scroll', onScroll)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[#050506] text-zinc-100 selection:bg-amber-400/30">
      {/* fixed WebGL canvas behind everything */}
      <Scene />

      {/* glow + vignette overlay */}
      <div className="vignette pointer-events-none fixed inset-0 z-[1]" aria-hidden="true" />

      <Nav />
      <ProgressDots />

      <main className="relative z-10 flex flex-col">
        <Hero />

        <FeatureSection
          id="sound"
          index="01"
          tag="Adaptive ANC Pro"
          title="Nine microphones. Absolute silence."
          body="Six beam-forming microphones map the room 48,000 times a second. AURA X1 cancels up to −48 dB of cabin roar, café chatter and city hum — before it ever reaches your ears."
          stats={[
            { value: '−48 dB', label: 'ANC depth' },
            { value: '9', label: 'Microphones' },
            { value: '48 kHz', label: 'Room mapping' },
          ]}
        />

        <FeatureSection
          id="acoustics"
          index="02"
          tag="Acoustic Engine"
          title="40 mm drivers, exploded."
          body="One machined 40 mm dynamic driver per side, suspended in a neodymium field. As you scroll, the cup disassembles — cushion, acoustic chamber, diaphragm and machined cap — each part tuned to a single frequency range."
          chip="Exploded view · live"
          stats={[
            { value: '40 mm', label: 'Dynamic driver' },
            { value: '8–42 kHz', label: 'Frequency range' },
            { value: '24-bit', label: 'Hi-Res lossless' },
          ]}
          align="right"
        />

        <FeatureSection
          id="design"
          index="03"
          tag="Materials"
          title="Aerospace-grade aluminium."
          body="Each shell is CNC-milled from a single billet of 6000-series aluminium, bead-blasted, anodized, then hand-polished for nine hours. 384 grams that disappear the moment you put them on."
          stats={[
            { value: '384 g', label: 'Total weight' },
            { value: '9 h', label: 'Hand polish' },
            { value: '1', label: 'Machined billet' },
          ]}
        />

        <ColorSection />
        <SpecSection />
      </main>

      <Footer />
    </div>
  )
}
