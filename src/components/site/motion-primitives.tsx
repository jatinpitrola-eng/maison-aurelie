'use client'

import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'

const EASE_OUT = [0.22, 1, 0.36, 1] as const

/* ───────────────────────────── ParallaxImage ────────────────────────────── */

/**
 * Photograph that drifts against the scroll at its own speed.
 * Size the wrapper with className (aspect-*, w-full, absolute inset-0 …).
 */
export function ParallaxImage({
  src,
  alt,
  sizes,
  className,
  imgClassName,
  strength = 10,
  zoom = 1.16,
  priority = false,
  objectPosition,
}: {
  src: string
  alt: string
  sizes: string
  className?: string
  imgClassName?: string
  /** how far (in % of own height) the image travels across the scroll pass */
  strength?: number
  /** constant overscale so the drift never reveals an edge */
  zoom?: number
  priority?: boolean
  objectPosition?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`])

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ''}`}>
      <motion.div style={{ y, scale: zoom }} className="absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName ?? ''}`}
          style={objectPosition ? { objectPosition } : undefined}
        />
      </motion.div>
    </div>
  )
}

/* ───────────────────────────── LetterReveal ─────────────────────────────── */

/** Per-letter masked rise — for hero display type. Plays on mount. */
export function LetterReveal({
  text,
  className,
  letterClassName,
  delay = 0,
  stagger = 0.03,
}: {
  text: string
  className?: string
  /** styles for each inner letter span — put gold-text here so background-clip survives the transform */
  letterClassName?: string
  delay?: number
  stagger?: number
}) {
  return (
    <span className={`inline-block ${className ?? ''}`} aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            className={`inline-block will-change-transform ${letterClassName ?? ''}`}
            initial={{ y: '112%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: EASE_OUT,
            }}
          >
            {ch === ' ' ? '\u00A0' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

/* ───────────────────────────── WordsReveal ──────────────────────────────── */

/** Word-by-word masked rise for headlines split over styled lines. */
export function WordsReveal({
  lines,
  className,
  accentClassName = 'gold-text',
  delay = 0,
  stagger = 0.055,
}: {
  lines: { words: string; accent?: boolean }[]
  className?: string
  accentClassName?: string
  delay?: number
  stagger?: number
}) {
  /*
   * The scroll observer lives on this untransformed container — the words
   * themselves start 118% down inside overflow-hidden masks, which would
   * otherwise read as “fully clipped” and never fire whileInView.
   */
  const container = {
    closed: {},
    open: { transition: { staggerChildren: stagger, delayChildren: delay } },
  }
  const word = {
    closed: { y: '118%' },
    open: { y: '0%', transition: { duration: 0.9, ease: EASE_OUT } },
  }

  /* running word index so the stagger flows across lines */
  let index = 0

  return (
    <motion.span
      className={`block ${className ?? ''}`}
      variants={container}
      initial="closed"
      whileInView="open"
      viewport={{ once: true, margin: '-60px' }}
    >
      {lines.map((line, li) => (
        <span key={li} className="block">
          {line.words.split(' ').map((w) => {
            const i = index++
            void i
            return (
              <span
                key={i}
                className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
              >
                <motion.span
                  variants={word}
                  className={`inline-block will-change-transform ${
                    line.accent ? accentClassName : ''
                  }`}
                >
                  {w}
                  {'\u00A0'}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </motion.span>
  )
}

/* ─────────────────────────────── CountUp ────────────────────────────────── */

/** Number that counts up when it enters the viewport. Non-digits stay static. */
export function CountUp({
  value,
  className,
  duration = 1.9,
}: {
  value: string
  className?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState('0')

  const digits = value.match(/\d+/)?.[0]
  const target = digits ? parseInt(digits, 10) : NaN
  const [head, ...rest] = digits ? value.split(digits) : ['']
  const tail = rest.join('')

  useEffect(() => {
    if (!inView || Number.isNaN(target)) return
    const controls = animate(0, target, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    })
    return () => controls.stop()
  }, [inView, target, duration])

  if (Number.isNaN(target)) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    )
  }

  return (
    <span ref={ref} className={className}>
      {head}
      {display}
      {tail}
    </span>
  )
}

/* ─────────────────────────────── Sparkles ───────────────────────────────── */

/* deterministic positions — SSR-safe, no hydration drift */
const SPARKS = [
  { top: '16%', left: '9%', size: 5, delay: '0.2s', dur: '3.1s' },
  { top: '28%', left: '85%', size: 4, delay: '1.1s', dur: '3.8s' },
  { top: '38%', left: '22%', size: 3, delay: '2s', dur: '2.9s' },
  { top: '22%', left: '64%', size: 4, delay: '0.7s', dur: '3.5s' },
  { top: '58%', left: '78%', size: 5, delay: '1.6s', dur: '3.2s' },
  { top: '66%', left: '14%', size: 4, delay: '2.4s', dur: '3.9s' },
  { top: '74%', left: '90%', size: 3, delay: '0.4s', dur: '2.8s' },
  { top: '82%', left: '32%', size: 4, delay: '1.9s', dur: '3.6s' },
  { top: '12%', left: '44%', size: 3, delay: '2.8s', dur: '3s' },
  { top: '48%', left: '6%', size: 3, delay: '1.3s', dur: '3.4s' },
  { top: '86%', left: '58%', size: 5, delay: '0.9s', dur: '3.7s' },
  { top: '33%', left: '95%', size: 3, delay: '2.2s', dur: '2.7s' },
]

/** Twinkling gold dust. Position the parent relative. */
export function Sparkles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ''}`}
    >
      {SPARKS.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}
    </div>
  )
}

/* ──────────────────────────── RotatingBadge ─────────────────────────────── */

/** Slowly-rotating circular seal — “EST. 1962” style house stamp. */
export function RotatingBadge({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const id = useId()
  const pathId = `seal-path-${id}`

  return (
    <div className={`pointer-events-none ${className ?? ''}`} aria-hidden="true">
      <div className="animate-spin-slow h-full w-full">
        <svg viewBox="0 0 120 120" className="h-full w-full">
          <defs>
            <path
              id={pathId}
              d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
              fill="none"
            />
          </defs>
          <text
            className="fill-current text-[10px] font-light uppercase"
            style={{ letterSpacing: '0.2em' }}
          >
            <textPath href={`#${pathId}`}>{text}</textPath>
          </text>
        </svg>
      </div>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="text-base">✦</span>
      </span>
    </div>
  )
}

/* ───────────────────────────────── Tilt ─────────────────────────────────── */

/** Subtle perspective tilt that follows the pointer (desktop only). */
export function Tilt({
  children,
  className,
  max = 5,
}: {
  children: ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 160, damping: 20 })
  const rotateY = useSpring(ry, { stiffness: 160, damping: 20 })

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    const nx = (e.clientX - box.left) / box.width - 0.5
    const ny = (e.clientY - box.top) / box.height - 0.5
    ry.set(nx * max)
    rx.set(-ny * max)
  }

  function onLeave() {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
