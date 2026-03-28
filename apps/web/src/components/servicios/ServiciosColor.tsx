'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const S3 = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com'

// One image per service row (indexed by position)
const ROW_IMAGES = [
  `${S3}/servicios/balayagebrasil.webp`,
  `${S3}/servicios/babylight.webp`,
  `${S3}/servicios/balayagerubio.webp`,
]

type ServiceItem = {
  name: string
  tagline: string
  desc: string
  price: string
}

export default function ServiciosColor() {
  const t = useTranslations('servicios.color')
  const services = t.raw('services') as ServiceItem[]

  const sectionRef = useRef<HTMLElement>(null)
  const [sectionVisible, setSectionVisible] = useState(false)
  const [visibleRows, setVisibleRows] = useState<boolean[]>([false, false, false])
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  /* ── Section visibility (header) ──────────────────────── */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setSectionVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* ── Per-row stagger visibility ────────────────────────── */
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    rowRefs.current.forEach((el, i) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setVisibleRows((prev) => {
              const next = [...prev]
              next[i] = true
              return next
            })
            observer.disconnect()
          }
        },
        { threshold: 0.12 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <>
      <style>{`
        @keyframes colorFadeUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes colorRuleExpand {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }

        @keyframes colorRowIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .color-visible .color-eyebrow    { animation: colorFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0ms    both; }
        .color-visible .color-title      { animation: colorFadeUp 0.72s cubic-bezier(0.16, 1, 0.3, 1) 100ms  both; }
        .color-visible .color-rule       { animation: colorRuleExpand 0.6s cubic-bezier(0.16, 1, 0.3, 1) 200ms both; }
        .color-visible .color-intro      { animation: colorFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 280ms  both; }

        .color-row-visible { animation: colorRowIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }

        .color-service-row {
          transition: background-color 0.35s ease;
        }
        .color-service-row:hover {
          background-color: rgba(246, 244, 241, 0.04);
        }
      `}</style>

      <section
        ref={sectionRef}
        id="color-rubios"
        className={`relative w-full bg-navy py-24 md:py-32 overflow-hidden${sectionVisible ? ' color-visible' : ''}`}
        aria-labelledby="color-section-title"
      >

        {/* ── Background image at ~12% opacity ───────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${S3}/balayagerubio.webp)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.12,
            zIndex: 0,
          }}
        />

        {/* ── Navy gradient overlay ───────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(1,10,73,0.82) 0%, rgba(1,10,73,0.62) 50%, rgba(1,10,73,0.88) 100%)',
            zIndex: 1,
          }}
        />

        {/* ── Content ─────────────────────────────────────────── */}
        <div className="relative z-10 max-w-[1680px] mx-auto px-8 md:px-16 lg:px-24">

          {/* ── Section header ──────────────────────────────────── */}
          <header className="mb-16 md:mb-20">

            {/* Eyebrow */}
            <p
              className="color-eyebrow font-neue uppercase tracking-widest mb-5"
              style={{
                fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)',
                color: 'rgba(246, 244, 241, 0.4)',
                letterSpacing: '0.28em',
              }}
            >
              {t('eyebrow')}
            </p>

            {/* Title */}
            <h2
              id="color-section-title"
              className="color-title font-primary text-cream uppercase leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
            >
              {t('title')}
            </h2>

            {/* Orange rule */}
            <div className="mt-6 md:mt-8 mb-8 md:mb-10 overflow-hidden">
              <div
                className="color-rule h-px w-16 bg-orange"
                aria-hidden="true"
              />
            </div>

            {/* Intro */}
            <p
              className="color-intro font-secondary italic leading-relaxed"
              style={{
                fontSize: 'clamp(0.95rem, 1.25vw, 1.1rem)',
                color: 'rgba(246, 244, 241, 0.6)',
                maxWidth: '52ch',
              }}
            >
              {t('intro')}
            </p>

          </header>

          {/* ── Service rows ────────────────────────────────────── */}
          <div>
            {services.map((service, i) => (
              <div
                key={service.name}
                ref={(el) => { rowRefs.current[i] = el }}
                className={`color-service-row${visibleRows[i] ? ' color-row-visible' : ''}`}
                style={{
                  borderTop: '1px solid rgba(246, 244, 241, 0.1)',
                  animationDelay: `${i * 120}ms`,
                  opacity: visibleRows[i] ? undefined : 0,
                }}
              >
                <div
                  className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 md:gap-16 items-start"
                  style={{ paddingTop: 'clamp(1.75rem, 2.5vw, 2.5rem)', paddingBottom: 'clamp(1.75rem, 2.5vw, 2.5rem)' }}
                >

                  {/* ── Text block ────────────────────────────────── */}
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-12 flex-1 min-w-0">

                  {/* ── Left: index + name + tagline ──────────────── */}
                  <div className="flex items-start gap-5 md:gap-7 flex-1 min-w-0">

                    {/* Index */}
                    <span
                      className="font-neue shrink-0 mt-[0.35em]"
                      style={{
                        fontSize: 'clamp(0.6rem, 0.75vw, 0.7rem)',
                        color: 'rgba(246, 244, 241, 0.2)',
                        letterSpacing: '0.15em',
                        lineHeight: 1,
                      }}
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    {/* Name + tagline */}
                    <div className="min-w-0">
                      <h3
                        className="font-primary text-cream uppercase leading-[0.9] tracking-tight"
                        style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
                      >
                        {service.name}
                      </h3>
                      {service.tagline && (
                        <p
                          className="font-neue text-orange uppercase tracking-widest mt-2"
                          style={{ fontSize: '10px', letterSpacing: '0.22em' }}
                        >
                          {service.tagline}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* ── Right: desc + price ───────────────────────── */}
                  <div
                    className="flex flex-col gap-5 md:items-end"
                    style={{ flexShrink: 0, maxWidth: '42ch' }}
                  >

                    {/* Description */}
                    <p
                      className="font-secondary italic leading-relaxed"
                      style={{
                        fontSize: 'clamp(0.85rem, 1.05vw, 0.95rem)',
                        color: 'rgba(246, 244, 241, 0.6)',
                      }}
                    >
                      {service.desc}
                    </p>

                    {/* Price tag */}
                    <span
                      className="font-neue uppercase tracking-widest inline-block"
                      style={{
                        fontSize: '11px',
                        letterSpacing: '0.25em',
                        color: 'rgba(246, 244, 241, 0.8)',
                        border: '1px solid rgba(246, 244, 241, 0.2)',
                        padding: '0.5rem 1rem',
                        whiteSpace: 'nowrap',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {service.price}
                    </span>

                  </div>

                  </div>{/* end text block */}

                  {/* ── Large image panel ─────────────────────────── */}
                  {ROW_IMAGES[i] && (
                    <div
                      className="hidden md:block relative shrink-0 overflow-hidden self-stretch"
                      style={{ width: 'clamp(180px, 22vw, 300px)', minHeight: '220px' }}
                    >
                      <Image
                        src={ROW_IMAGES[i]!}
                        alt={service.name}
                        fill
                        sizes="(max-width: 1280px) 22vw, 300px"
                        className="object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-navy/15" aria-hidden />
                    </div>
                  )}

                </div>
              </div>
            ))}

            {/* Bottom border after last row */}
            <div
              aria-hidden="true"
              style={{ borderTop: '1px solid rgba(246, 244, 241, 0.1)' }}
            />
          </div>

        </div>
      </section>
    </>
  )
}
