'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

/* ─── Static (non-translatable) data ────────────────────────────────────── */

const SERVICE_META = [
  { index: '01', image: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service1.jpg' },
  { index: '02', image: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service2.jpg' },
  { index: '03', image: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service3.jpg' },
  { index: '04', image: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service4.jpg' },
  { index: '05', image: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service5.jpg' },
]

type ServiceTranslation = {
  tab: string
  name: string
  description: string
  treatments: string[]
  price: string
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function ServiciosSection() {
  const t = useTranslations('serviciosPage')
  const servicesText = t.raw('services') as ServiceTranslation[]
  const SERVICES = SERVICE_META.map((meta, i) => ({ ...meta, ...servicesText[i]! }))

  const [active, setActive] = useState(0)
  const [fading, setFading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Animate the underline indicator
  useEffect(() => {
    const el = tabRefs.current[active]
    if (!el) return
    const parent = el.parentElement
    if (!parent) return
    const parentRect = parent.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    setIndicatorStyle({
      left: rect.left - parentRect.left,
      width: rect.width,
    })
  }, [active, mounted])

  function switchTab(i: number) {
    if (i === active) return
    setFading(true)
    setTimeout(() => {
      setActive(i)
      setFading(false)
    }, 220)
  }

  const service = SERVICES[active]!

  return (
    <div style={{ backgroundColor: '#F6F4F1' }}>
      {/* ── Hero title ─────────────────────────────────────────────────── */}
      <div
        className="w-full text-center"
        style={{
          paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
          paddingBottom: 'clamp(3rem, 6vw, 5rem)',
        }}
      >
        <p
          className="font-neue font-light uppercase tracking-[0.3em] mb-6"
          style={{ fontSize: '11px', color: 'rgba(26,31,58,0.45)' }}
        >
          {t('eyebrow')}
        </p>
        <h1
          className="font-primary uppercase leading-[0.88] text-center"
          style={{
            fontSize: 'clamp(4.5rem, 12vw, 10rem)',
            color: '#1a1f3a',
            letterSpacing: '-0.01em',
          }}
        >
          {t('title')}
        </h1>
      </div>

      {/* ── Tab bar ────────────────────────────────────────────────────── */}
      <div
        className="w-full sticky top-0 z-30"
        style={{ backgroundColor: '#1a1f3a' }}
      >
        <div className="relative mx-auto flex max-w-[1440px] px-8 md:px-16">
          {SERVICES.map((s, i) => (
            <button
              key={s.index}
              ref={(el) => { tabRefs.current[i] = el }}
              onClick={() => switchTab(i)}
              className="group relative flex-1 py-5 text-center transition-colors duration-300"
              style={{
                color: active === i ? '#ffffff' : 'rgba(255,255,255,0.38)',
              }}
            >
              <span
                className="font-neue font-light uppercase block"
                style={{
                  fontSize: 'clamp(8px, 1.1vw, 11px)',
                  letterSpacing: '0.25em',
                  transition: 'color 0.3s ease',
                }}
              >
                {s.tab}
              </span>
              {/* Hover underline */}
              {active !== i && (
                <span
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 group-hover:w-1/2 transition-all duration-300"
                  style={{ backgroundColor: 'rgba(232,99,42,0.4)' }}
                />
              )}
            </button>
          ))}

          {/* Animated active indicator */}
          {mounted && (
            <span
              className="absolute bottom-0 h-[2px]"
              style={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                backgroundColor: '#e8632a',
                transition: 'left 0.35s cubic-bezier(0.16,1,0.3,1), width 0.35s cubic-bezier(0.16,1,0.3,1)',
              }}
            />
          )}
        </div>

        {/* Service number ticker */}
        <div
          className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          style={{
            fontFamily: 'inherit',
            color: 'rgba(255,255,255,0.06)',
            fontSize: 'clamp(3rem, 7vw, 6rem)',
            fontWeight: 300,
            lineHeight: 1,
          }}
        >
          {service.index}
        </div>
      </div>

      {/* ── Service panel ──────────────────────────────────────────────── */}
      <div
        style={{
          opacity: mounted ? (fading ? 0 : 1) : 1,
          transform: mounted ? (fading ? 'translateX(-16px)' : 'translateX(0)') : 'none',
          transition: 'opacity 0.22s ease, transform 0.22s ease',
        }}
      >
        <div className="flex flex-col md:flex-row w-full" style={{ minHeight: '80vh' }}>
          {/* Left: Image */}
          <div className="relative w-full md:w-1/2" style={{ minHeight: '45vh' }}>
            <Image
              src={service.image}
              alt={service.tab}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              priority={active === 0}
            />
            {/* Subtle dark overlay bottom */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(26,31,58,0.35) 0%, transparent 50%)',
              }}
            />
          </div>

          {/* Right: Info */}
          <div
            className="w-full md:w-1/2 flex flex-col justify-center"
            style={{
              backgroundColor: '#F6F4F1',
              padding: 'clamp(3rem, 6vw, 6rem) clamp(2.5rem, 6vw, 5rem)',
            }}
          >
            {/* Label */}
            <p
              className="font-neue font-light uppercase tracking-[0.3em] mb-8"
              style={{ fontSize: '11px', color: '#e8632a' }}
            >
              — {t('serviceLabel')} {service.index}
            </p>

            {/* Service name */}
            <h2
              className="font-neue font-light uppercase leading-[0.9] mb-8"
              style={{
                fontSize: 'clamp(3rem, 5vw, 5rem)',
                color: '#1a1f3a',
                whiteSpace: 'pre-line',
              }}
            >
              {service.name}
            </h2>

            {/* Divider */}
            <div
              className="mb-8"
              style={{ height: '1px', backgroundColor: 'rgba(26,31,58,0.12)', width: '4rem' }}
            />

            {/* Description */}
            <p
              className="font-neue font-light leading-relaxed mb-10"
              style={{ fontSize: '1rem', color: 'rgba(26,31,58,0.7)', maxWidth: '38ch' }}
            >
              {service.description}
            </p>

            {/* Treatments */}
            <ul className="mb-10 space-y-3">
              {service.treatments.map((t) => (
                <li
                  key={t}
                  className="font-neue font-light flex items-center gap-3"
                  style={{ fontSize: '0.875rem', color: '#1a1f3a' }}
                >
                  <span style={{ color: '#e8632a', flexShrink: 0 }}>—</span>
                  {t}
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="mb-10">
              <p
                className="font-neue font-light uppercase tracking-[0.2em] mb-1"
                style={{ fontSize: '10px', color: 'rgba(26,31,58,0.4)' }}
              >
                {t('priceNote')}
              </p>
              <p
                className="font-primary leading-none"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#1a1f3a' }}
              >
                {service.price}
              </p>
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/reservar-cita"
                className="inline-flex items-center gap-4 font-neue font-light uppercase tracking-[0.25em] transition-all duration-300 hover:opacity-70"
                style={{
                  fontSize: '11px',
                  color: '#ffffff',
                  backgroundColor: '#1a1f3a',
                  padding: '1.25rem 2.5rem',
                }}
              >
                {t('bookCta')}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <path
                    d="M1 5h14M10 1l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
