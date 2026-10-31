'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Lenis from 'lenis'
import { scrollState, lenisRef } from '@/lib/product-store'
import { Nav } from '@/components/site/nav'
import { Hero } from '@/components/site/hero'
import { CinemaSection } from '@/components/site/cinema-section'
import { ColorSection } from '@/components/site/color-section'
import { ReserveSection } from '@/components/site/reserve-section'
import { BgStory } from '@/components/site/bg-story'
import { BlueprintOverlay } from '@/components/site/blueprint-overlay'
import { ProgressBar } from '@/components/site/progress-bar'
import { Footer } from '@/components/site/footer'

/* 3D scene is client-only (WebGL can't render on the server) */
const Scene = dynamic(() => import('@/components/three/scene'), { ssr: false })

export default function Home() {
  const mainRef = useRef<HTMLElement>(null)
  const rangeRef = useRef(1)

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
      if (rangeRef.current <= 1) return // ignore events before layout is measured
      scrollState.progress = Math.min(1, Math.max(0, e.scroll / rangeRef.current))
      // clamp + scale px/frame velocity into a shader-friendly range
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
    <div className="flex min-h-screen flex-col overflow-x-clip bg-[#180f09] text-zinc-100 selection:bg-orange-400/30">
      {/* scroll-driven ambient scene color */}
      <BgStory />

      {/* fixed WebGL canvas behind everything */}
      <Scene />

      {/* blueprint annotations over the hero product */}
      <BlueprintOverlay />

      {/* edge vignette keeps the frame cinematic */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
        aria-hidden="true"
      />

      <Nav />
      <ProgressBar />

      <main ref={mainRef} className="relative z-10 flex flex-col">
        <Hero />

        {/* ——— AURA X1 ——— */}
        <CinemaSection
          id="sound"
          index="01"
          tag="Adaptive ANC Pro"
          title="Nine mics. Zero noise."
          body="Six beam-forming microphones map the room 48,000 times a second. AURA X1 cancels up to −48 dB of cabin roar, café chatter and city hum — before it ever reaches your ears."
          stats={[
            { value: '−48 dB', label: 'ANC depth' },
            { value: '9', label: 'Microphones' },
            { value: '48 kHz', label: 'Room mapping' },
          ]}
        />

        <CinemaSection
          id="acoustics"
          index="02"
          tag="Acoustic Engine"
          title="40 mm, exploded."
          body="One machined 40 mm dynamic driver per side, suspended in a neodymium field. As you scroll, the cup disassembles — cushion, acoustic chamber, diaphragm and machined cap — each part tuned to a single frequency range."
          chip="Exploded view — live"
          stats={[
            { value: '40 mm', label: 'Dynamic driver' },
            { value: '8–42 kHz', label: 'Frequency range' },
            { value: '24-bit', label: 'Hi-Res lossless' },
          ]}
        />

        <CinemaSection
          id="design"
          index="03"
          tag="Materials"
          title="Billet to beauty."
          body="Each shell is CNC-milled from a single billet of 6000-series aluminium, bead-blasted, anodized, then hand-polished for nine hours. 384 grams that disappear the moment you put them on."
          stats={[
            { value: '384 g', label: 'Total weight' },
            { value: '9 h', label: 'Hand polish' },
            { value: '1', label: 'Machined billet' },
          ]}
        />

        <ColorSection />

        {/* ——— THE FAMILY ——— */}
        <CinemaSection
          id="family"
          index="05"
          tag="The Family"
          title="One family. Three instruments."
          body="From the studio, to your pocket, to your living room — every AURA product shares the same acoustic DNA, the same milled aluminium, and the same three finishes. Keep scrolling to meet the family."
          center
        />

        <CinemaSection
          id="buds"
          index="05"
          tag="Pocket ANC"
          title="Six grams of silence."
          body="AURA Buds vanish into your ears — and the world vanishes with them. Keep scrolling and the machined case wakes up: the lid swings open and each bud lifts out, one by one, straight into the air."
          chip="The case opens as you scroll"
          stats={[
            { value: '4.9 g', label: 'Per bud' },
            { value: '32 h', label: 'With case' },
            { value: '−42 dB', label: 'ANC depth' },
          ]}
        />

        <CinemaSection
          id="buds-tech"
          index="06"
          tag="Spatial Engine"
          title="Spatial, pinned to the room."
          body="A six-axis gyroscope in each bud pins the soundstage to the room around you. Turn your head — the stage stays exactly where it was. Full cinema trickery, small enough to forget you're wearing it."
          stats={[
            { value: '6-axis', label: 'Head tracking' },
            { value: '48 kHz', label: 'Spatial render' },
            { value: '10 mm', label: 'Dual driver' },
          ]}
        />

        {/* ——— AURA ORB ——— */}
        <CinemaSection
          id="orb"
          index="07"
          tag="Home Speaker"
          title="360° of sound."
          body="AURA Orb throws sound in every direction at once — a 360° driver array wrapped in acoustic fabric, crowned with a machined cap and circled by two gravity-defying orbital rings."
          chip="Twin orbital rings — live"
          stats={[
            { value: '360°', label: 'Sound array' },
            { value: '110 dB', label: 'Peak output' },
            { value: '2×', label: 'Orbital rings' },
          ]}
        />

        <CinemaSection
          id="orb-tech"
          index="08"
          tag="Room IQ"
          title="It learns your room."
          body="Six hidden microphones sweep your space every hour, re-tuning the array to your walls, your furniture, your life. Put it anywhere on a shelf — it sounds like it was built into that shelf."
          stats={[
            { value: '6', label: 'Calibration mics' },
            { value: '1 h', label: 'Re-tune cycle' },
            { value: '24-bit', label: 'Wi-Fi lossless' },
          ]}
        />

        {/* ——— RESERVE ——— */}
        <ReserveSection />
      </main>

      <Footer />
    </div>
  )
}
