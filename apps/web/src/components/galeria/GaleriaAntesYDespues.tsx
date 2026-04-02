'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { IGalleryPhoto } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

/* ─── Animation helper ──────────────────────────────────────────────────── */

function anim(
  visible: boolean,
  delay: number,
  mounted: boolean,
  from = 'translateY(24px)',
): React.CSSProperties {
  if (!mounted) return {}
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0)' : from,
    transitionProperty: 'opacity, transform',
    transitionDuration: '0.8s',
    transitionTimingFunction: 'ease, cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: visible ? `${delay}ms` : '0ms',
  }
}

/* ─── Flip card ─────────────────────────────────────────────────────────── */

function FlipCard({
  pair,
  beforeLabel,
  afterLabel,
}: {
  pair: IGalleryPhoto
  beforeLabel: string
  afterLabel: string
}) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className="cursor-pointer"
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onFocus={() => setFlipped(true)}
      onBlur={() => setFlipped(false)}
      // touch support
      onTouchStart={() => setFlipped((f) => !f)}
      tabIndex={0}
      aria-label={`${pair.pairLabel ?? ''} - ${flipped ? afterLabel : beforeLabel}`}
      style={{ perspective: '1200px' }}
    >
      {/* Card wrapper - rotates on flip */}
      <div
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transitionProperty: 'transform',
          transitionDuration: '0.7s',
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* ── Front: Antes ──────────────────────────────────────────────── */}
        <div
          className="relative aspect-[3/4] overflow-hidden"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <Image
            src={pair.url}
            alt={`${pair.pairLabel ?? ''} - ${beforeLabel}`}
            fill
            sizes="(max-width: 768px) 90vw, 30vw"
            className="object-cover object-top"
          />
          {/* Gradient + label */}
          <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3">
            <span className="bg-navy/75 px-2.5 py-1 font-neue uppercase text-[9px] tracking-[0.2em] text-cream/80">
              {beforeLabel}
            </span>
          </div>
          {/* Hover hint */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1.5 opacity-60"
            aria-hidden
          >
            <span className="font-neue uppercase text-[8px] tracking-[0.15em] text-cream">
              {afterLabel}
            </span>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-cream">
              <path d="M2 8h12M8 2l6 6-6 6" />
            </svg>
          </div>
        </div>

        {/* ── Back: Después ─────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 aspect-[3/4] overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <Image
            src={pair.urlAfter ?? pair.url}
            alt={`${pair.pairLabel ?? ''} - ${afterLabel}`}
            fill
            sizes="(max-width: 768px) 90vw, 30vw"
            className="object-cover object-top"
          />
          {/* Gradient + label */}
          <div className="absolute inset-0 bg-gradient-to-t from-orange/50 via-transparent to-transparent" />
          <div className="absolute bottom-3 right-3">
            <span className="bg-orange px-2.5 py-1 font-neue uppercase text-[9px] tracking-[0.2em] text-cream">
              {afterLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Service label */}
      <p className="text-center font-neue uppercase tracking-[0.2em]text-cream text-[10px] mt-3">
        {pair.pairLabel}
      </p>
    </div>
  )
}

/* ─── Section ───────────────────────────────────────────────────────────── */

export default function GaleriaAntesYDespues() {
  const t = useTranslations('galeria')

  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pairs, setPairs] = useState<IGalleryPhoto[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetch(`${API_URL}/gallery/section/antes-despues`)
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((json) => { setPairs(json.data ?? []); setLoaded(true) })
      .catch(() => { setPairs([]); setLoaded(true) })
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (!loaded || pairs.length === 0) return null

  return (
    <section
      id="antes-y-despues"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-navy py-24 md:py-32"
      aria-label={t('antesYDespues.title')}
    >
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-8 md:px-16">

        {/* ── Section header ───────────────────────────────────────────── */}
        <header className="mb-16 md:mb-20">

          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-6"
            style={anim(visible, 80, mounted, 'translateY(10px)')}
          >
            <span className="block shrink-0 w-1.5 h-1.5 rounded-full bg-orange" aria-hidden />
            <p
              className="font-neue uppercase tracking-[0.3em] text-cream/40"
              style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.72rem)' }}
            >
              {t('antesYDespues.eyebrow')}
            </p>
          </div>

          {/* Title */}
          <div className="overflow-hidden">
            <h2
              className="font-primary text-cream uppercase leading-[0.88]"
              style={{
                fontSize: 'clamp(4rem, 10vw, 8rem)',
                ...anim(visible, 200, mounted, 'translateY(60px)'),
              }}
            >
              {t('antesYDespues.title')}
            </h2>
          </div>

          {/* Animated orange rule */}
          <div
            className="mt-6 bg-orange"
            style={{
              height: '2px',
              width: visible ? '80px' : '0px',
              transitionProperty: 'width',
              transitionDuration: '0.8s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: visible ? '420ms' : '0ms',
            }}
            aria-hidden
          />
        </header>

        {/* ── Flip cards grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {pairs.map((pair, i) => (
            <div key={pair._id} style={anim(visible, 500 + i * 120, mounted)}>
              <FlipCard
                pair={pair}
                beforeLabel={t('antesYDespues.before')}
                afterLabel={t('antesYDespues.after')}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
