'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

/* ─── Animation helper ──────────────────────────────────────────────────── */

function anim(
  visible: boolean,
  delay: number,
  mounted: boolean,
  from = 'translateY(22px)',
): React.CSSProperties {
  if (!mounted) return {}
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0)' : from,
    transition: 'opacity 0.75s ease, transform 0.75s ease',
    transitionDelay: visible ? `${delay}ms` : '0ms',
  }
}

/* ─── Component ─────────────────────────────────────────────────────────── */

interface SalonHeroProps {
  backgroundImage?: string | null
}

export default function SalonHero({ backgroundImage }: SalonHeroProps) {
  const t = useTranslations('elSalon.hero')
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
      { threshold: 0.15 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen overflow-hidden flex flex-col justify-end"
      aria-label={`${t('title')} - ${t('brand')}, ${t('location')}`}
    >
      {/* ── Background image ─────────────────────────────────────────────── */}
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt="Interior de un salón de peluquería elegante"
          fill
          sizes="100vw"
          quality={90}
          priority
          className="object-cover object-center"
        />
      )}

      {/* ── Dark overlay ─────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, rgba(1,10,73,0.62) 45%, rgba(1,10,73,0.78) 80%, rgba(1,10,73,0.9) 100%)',
        }}
        aria-hidden
      />

      {/* ── Grain texture overlay ──────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          opacity: 0.6,
          mixBlendMode: 'overlay',
        }}
        aria-hidden
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-8 md:px-16 pb-20 md:pb-28">

        {/* Tagline / location */}
        <div
          className="flex items-center gap-3 mb-8 md:mb-10"
          style={anim(visible, 100, mounted, 'translateY(10px)')}
        >
          <span
            className="block shrink-0 w-1.5 h-1.5 rounded-full bg-orange"
            aria-hidden
          />
          <p
            className="font-neue text-cream/55 uppercase tracking-[0.3em]"
            style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)' }}
          >
            {t('location')}
          </p>
        </div>

        {/* Page title */}
        <div className="overflow-hidden mb-4">
          <h1
            className="font-primary text-cream uppercase leading-[0.85] tracking-tight"
            style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
              ...anim(visible, 220, mounted, 'translateY(60px)'),
            }}
          >
            {t('title')}
          </h1>
        </div>

        {/* Brand name - lighter, as subtitle */}
        <div className="overflow-hidden mb-10 md:mb-14">
          <p
            className="font-primary text-orange uppercase leading-[0.85] tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 5.5vw, 4.5rem)',
              ...anim(visible, 380, mounted, 'translateY(40px)'),
            }}
          >
            {t('brand')}
          </p>
        </div>

        {/* Thin rule */}
        <div
          className="bg-cream/20 mb-10 md:mb-12"
          style={{
            height: '1px',
            width: visible ? '72px' : '0px',
            transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: visible ? '520ms' : '0ms',
          }}
          aria-hidden
        />

        {/* Body text */}
        <p
          className="font-secondary text-cream leading-relaxed max-w-lg"
          style={{
            fontSize: 'clamp(0.95rem, 1.35vw, 1.1rem)',
            ...anim(visible, 620, mounted),
          }}
        >
          {t('body')}
        </p>

      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-10"
        style={{
          opacity: visible ? 0.45 : 0,
          transition: 'opacity 0.5s ease',
          transitionDelay: visible ? '1100ms' : '0ms',
        }}
        aria-hidden
      >
        <div className="w-px h-10 bg-gradient-to-b from-cream to-transparent animate-pulse" />
      </div>

      {/* ── Bottom fade into cream ────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-20"
        style={{
          background:
            'linear-gradient(to bottom, transparent 0%, #F6F4F1 100%)',
        }}
        aria-hidden
      />
    </section>
  )
}
