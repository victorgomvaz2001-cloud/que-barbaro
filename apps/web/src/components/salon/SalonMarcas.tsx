'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

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
    transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: visible ? `${delay}ms` : '0ms',
  }
}

/* ─── Types ─────────────────────────────────────────────────────────────── */

type BrandData = {
  index: string
  nameLines: string[]
  products: string[]
  desc: string
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function SalonMarcas() {
  const t = useTranslations('elSalon.marcas')
  const goa = t.raw('goa') as BrandData
  const oribe = t.raw('oribe') as BrandData
  const brands = [goa, oribe]

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
      { threshold: 0.12 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="marcas"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-navy py-24 md:py-32"
      aria-label={t('eyebrow')}
    >

      {/* ── Background image — very low opacity ──────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          style={{ opacity: 0.15 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(1,10,73,0.6) 0%, rgba(1,10,73,0.3) 50%, rgba(1,10,73,0.7) 100%)',
          }}
        />
      </div>

      {/* ── Subtle noise grain ───────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.78\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          opacity: 0.55,
          mixBlendMode: 'overlay',
        }}
        aria-hidden
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-8 md:px-16 lg:px-24">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <header className="mb-16 md:mb-20">

          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-6"
            style={anim(visible, 80, mounted, 'translateY(10px)')}
          >
            <span
              className="block shrink-0 w-1.5 h-1.5 rounded-full bg-orange"
              aria-hidden
            />
            <p
              className="font-neue uppercase tracking-[0.3em] text-cream/40"
              style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.72rem)' }}
            >
              {t('eyebrow')}
            </p>
          </div>

          {/* Title */}
          <div className="overflow-hidden">
            <h2
              className="font-primary text-cream uppercase leading-[0.88]"
              style={{
                fontSize: 'clamp(4.5rem, 11vw, 9.5rem)',
                letterSpacing: '-0.01em',
                ...anim(visible, 200, mounted, 'translateY(60px)'),
              }}
            >
              {t('title')}
            </h2>
          </div>

          {/* Animated rule under title */}
          <div
            className="mt-6 bg-orange/70"
            style={{
              height: '1px',
              width: visible ? '80px' : '0px',
              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: visible ? '420ms' : '0ms',
            }}
            aria-hidden
          />
        </header>

        {/* ── Brand grid ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start gap-0">

          {brands.map((brand, bi) => (
            <div
              key={brand.index}
              className="flex flex-col md:flex-row w-full md:w-1/2"
            >
              {/* Brand block */}
              <div
                className="flex-1 flex flex-col py-10 md:py-0"
                style={{
                  paddingRight: bi === 0 ? 'clamp(2rem, 5vw, 5rem)' : '0',
                  paddingLeft: bi === 1 ? 'clamp(2rem, 5vw, 5rem)' : '0',
                }}
              >

                {/* Index number */}
                <p
                  className="font-neue text-cream/25 tabular-nums mb-6"
                  style={{
                    fontSize: 'clamp(0.6rem, 0.75vw, 0.68rem)',
                    letterSpacing: '0.2em',
                    ...anim(visible, 320 + bi * 120, mounted, 'translateY(10px)'),
                  }}
                >
                  {brand.index}
                </p>

                {/* Brand logo */}
                <div
                  className="mb-8"
                  style={anim(visible, 380 + bi * 120, mounted, 'translateY(16px)')}
                >
                  {bi === 0 ? (
                    <div className="relative" style={{ width: '220px', maxWidth: '100%', height: '88px' }}>
                      <Image
                        src="/goa_organics.png"
                        alt="GOA Organics"
                        fill
                        sizes="220px"
                        className="object-contain object-left"
                        style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
                      />
                    </div>
                  ) : (
                    <div className="relative" style={{ width: '120px', maxWidth: '100%', height: '162px' }}>
                      <Image
                        src="/oribe.svg"
                        alt="ORIBE"
                        fill
                        sizes="120px"
                        className="object-contain object-left"
                        style={{ filter: 'invert(1) brightness(0.95)' }}
                      />
                    </div>
                  )}
                </div>

                {/* Brand name — typographic treatment */}
                <div
                  className="mb-5"
                  style={anim(visible, 460 + bi * 120, mounted, 'translateY(20px)')}
                >
                  {brand.nameLines.map((line, li) => (
                    <p
                      key={li}
                      className="font-primary text-cream/30 uppercase leading-[0.88] tracking-tight"
                      style={{
                        fontSize:
                          brand.nameLines.length === 1
                            ? 'clamp(2rem, 4vw, 3.5rem)'
                            : 'clamp(1.5rem, 3vw, 2.8rem)',
                      }}
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Orange rule */}
                <div
                  className="bg-orange mb-6"
                  style={{
                    height: '1.5px',
                    width: visible ? '100%' : '0%',
                    maxWidth: '56px',
                    transition: 'width 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: visible ? `${580 + bi * 120}ms` : '0ms',
                  }}
                  aria-hidden
                />

                {/* Products — pill tags (GOA only) */}
                {brand.products.length > 0 && (
                  <div
                    className="flex flex-wrap gap-2 mb-6"
                    style={anim(visible, 720 + bi * 120, mounted)}
                  >
                    {brand.products.map((product) => (
                      <span
                        key={product}
                        className="font-neue uppercase text-cream/50 border border-cream/15 px-3 py-1"
                        style={{
                          fontSize: 'clamp(0.55rem, 0.7vw, 0.64rem)',
                          letterSpacing: '0.18em',
                        }}
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                )}

                {/* Description */}
                <p
                  className="font-secondary italic text-cream/65 leading-relaxed"
                  style={{
                    fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
                    maxWidth: '34ch',
                    ...anim(visible, 800 + bi * 120, mounted),
                  }}
                >
                  {brand.desc}
                </p>
              </div>

              {/* Vertical divider — desktop only, between brands */}
              {bi === 0 && (
                <div
                  className="hidden md:block shrink-0 self-stretch"
                  aria-hidden
                >
                  <div
                    className="w-px h-full bg-cream/10"
                    style={{
                      opacity: visible ? 1 : 0,
                      transition: 'opacity 0.6s ease',
                      transitionDelay: visible ? '600ms' : '0ms',
                    }}
                  />
                </div>
              )}

              {/* Mobile horizontal divider — between brands */}
              {bi === 0 && (
                <div
                  className="block md:hidden w-full bg-cream/10 my-2"
                  style={{ height: '1px' }}
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Bottom rule ────────────────────────────────────────────────── */}
        <div
          className="mt-16 md:mt-20 bg-cream/10"
          style={{
            height: '1px',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.7s ease',
            transitionDelay: visible ? '900ms' : '0ms',
          }}
          aria-hidden
        />
      </div>
    </section>
  )
}
