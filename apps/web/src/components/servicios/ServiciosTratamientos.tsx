'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const S3 = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com'
const CARD_IMAGES = [
  `${S3}/servicios/keratin.webp`,
  `${S3}/servicios/softymood.jpg`,
  `${S3}/servicios/sublime.jpg`,
  `${S3}/servicios/baeberry.png`,
]

/* ─── Types ─────────────────────────────────────────────────────────────── */

type Service = {
  name: string
  tagline: string
  desc: string
  price: string
}

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
    transform: visible ? 'none' : from,
    transition: 'opacity 0.72s ease, transform 0.72s cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: visible ? `${delay}ms` : '0ms',
  }
}

/* ─── Card ──────────────────────────────────────────────────────────────── */

function ServiceCard({
  service,
  index,
  visible,
  mounted,
  delay,
  image,
}: {
  service: Service
  index: number
  visible: boolean
  mounted: boolean
  delay: number
  image?: string
}) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <article
      className="relative flex flex-col gap-0 overflow-hidden"
      style={anim(visible, delay, mounted, 'translateY(32px)')}
    >
      {/* Photo */}
      {image && (
        <div className="relative w-full aspect-[3/2] overflow-hidden mb-6 group">
          <Image
            src={image}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream/30 to-transparent" aria-hidden />
        </div>
      )}

      {/* Orange top bar - animated scaleX on reveal */}
      <div className="overflow-hidden mb-7">
        <div
          aria-hidden
          style={{
            height: '2px',
            background: '#fe5100',
            transformOrigin: 'left',
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: mounted ? `${delay + 80}ms` : '0ms',
          }}
        />
      </div>

      {/* Index number */}
      <p
        aria-hidden
        className="font-neue text-navy/20 tabular-nums mb-3 select-none"
        style={{ fontSize: '10px', letterSpacing: '0.18em' }}
      >
        {num}
      </p>

      {/* Service name */}
      <h3
        className="font-primary text-navy uppercase leading-[0.88] tracking-tight mb-4"
        style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.5rem)' }}
      >
        {service.name}
      </h3>

      {/* GOA Organics badge */}
      <div className="flex items-center gap-1.5 mb-5" aria-hidden>
        <span
          className="block shrink-0 rounded-full bg-orange/60"
          style={{ width: '4px', height: '4px' }}
        />
        <span
          className="font-neue uppercase text-orange/60 tracking-[0.3em]"
          style={{ fontSize: '9px' }}
        >
          {service.tagline}
        </span>
      </div>

      {/* Description */}
      <p
        className="font-secondarytext-navy/60 leading-relaxed flex-1 mb-6"
        style={{ fontSize: 'clamp(0.9rem, 1.2vw, 1.02rem)', maxWidth: '36ch' }}
      >
        {service.desc}
      </p>

      {/* Price tag */}
      <div>
        <span
          className="font-neue uppercase tracking-widest bg-navy text-cream px-3 py-1 inline-block"
          style={{ fontSize: '10px' }}
        >
          {service.price}
        </span>
      </div>
    </article>
  )
}

/* ─── Main component ────────────────────────────────────────────────────── */

export default function ServiciosTratamientos() {
  const t = useTranslations('servicios.tratamientos')
  const services = t.raw('services') as Service[]

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
      { threshold: 0.08 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="tratamientos"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-cream py-24 md:py-32"
      aria-labelledby="tratamientos-title"
    >

      {/* ── Ghost watermark "GOA" ────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        aria-hidden
      >
        <span
          className="font-primary text-navy uppercase leading-none"
          style={{
            fontSize: 'clamp(18rem, 40vw, 52rem)',
            opacity: 0.025,
            letterSpacing: '-0.04em',
            userSelect: 'none',
          }}
        >
          GOA
        </span>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-8 md:px-16 lg:px-24">

        {/* ── Section header ─────────────────────────────────────────────── */}
        <header className="mb-16 md:mb-20">

          {/* Eyebrow row with brand badge */}
          <div
            className="flex items-center justify-between mb-6"
            style={anim(visible, 0, mounted, 'translateY(10px)')}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span
                className="block shrink-0 w-[6px] h-[6px] rounded-full bg-orange"
                aria-hidden
              />
              <p
                className="font-neue text-orange uppercase tracking-widest"
                style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)' }}
              >
                {t('eyebrow')}
              </p>
            </div>

            {/* Brand editorial label */}
            <div className="hidden md:flex items-center gap-2" aria-hidden>
              <span
                className="block shrink-0 rounded-full bg-orange"
                style={{ width: '4px', height: '4px' }}
              />
              <span
                className="font-neue uppercase text-navy/30 tracking-[0.3em]"
                style={{ fontSize: '9px' }}
              >
                {t('brand')}
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="overflow-hidden mb-4">
            <h2
              id="tratamientos-title"
              className="font-primary text-navy uppercase leading-[0.88] tracking-tight"
              style={{
                fontSize: 'clamp(2.8rem, 11vw, 9.5rem)',
                ...anim(visible, 120, mounted, 'translateY(60px)'),
              }}
            >
              {t('title')}
            </h2>
          </div>

          {/*intro note */}
          <p
            className="font-secondarytext-navy/50 mb-6 leading-relaxed"
            style={{
              fontSize: 'clamp(0.9rem, 1.3vw, 1.05rem)',
              maxWidth: '50ch',
              ...anim(visible, 240, mounted),
            }}
          >
            {t('intro')}
          </p>

          {/* Orange rule */}
          <div
            className="bg-orange"
            aria-hidden
            style={{
              height: '2px',
              width: visible ? '64px' : '0px',
              transition: 'width 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: mounted ? '380ms' : '0ms',
            }}
          />
        </header>

        {/* ── Services 2×2 grid ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-16 lg:gap-x-24 lg:gap-y-20">
          {services.map((service, i) => (
            <ServiceCard
              key={service.name}
              service={service}
              index={i}
              visible={visible}
              mounted={mounted}
              delay={440 + i * 110}
              image={CARD_IMAGES[i]}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
