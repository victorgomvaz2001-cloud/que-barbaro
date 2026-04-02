'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type Service = { name: string; tagline: string; desc: string; price: string }

/* ─── Animation helper ──────────────────────────────────────────────────────── */

function anim(
  visible: boolean,
  delay: number,
  mounted: boolean,
  from = 'translateY(28px)',
): React.CSSProperties {
  if (!mounted) return {}
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0)' : from,
    transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
    transitionDelay: visible ? `${delay}ms` : '0ms',
  }
}

/* ─── Service card ──────────────────────────────────────────────────────────── */

function ServiceCard({
  service,
  imageUrl,
  imageSizes,
  accentSide,
  index,
  visible,
  mounted,
}: {
  service: Service
  imageUrl: string
  imageSizes: string
  accentSide: 'left' | 'right'
  index: number
  visible: boolean
  mounted: boolean
}) {
  const delay = 300 + index * 160

  return (
    <article
      style={
        mounted
          ? {
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(40px)',
              transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)',
              transitionDelay: visible ? `${delay}ms` : '0ms',
            }
          : {}
      }
      className="flex flex-col group"
    >
      {/* ── Image wrapper ─────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden mb-6"
        style={{ aspectRatio: '3 / 4' }}
      >
        {/* Accent strip */}
        <div
          className="absolute top-0 bottom-0 z-10 pointer-events-none"
          aria-hidden
          style={{
            [accentSide]: 0,
            width: '3px',
            backgroundColor: 'rgba(254,81,0,0.75)',
            transform: visible ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'top',
            transition: 'transform 0.8s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: mounted && visible ? `${delay + 200}ms` : '0ms',
          }}
        />

        {/* Image */}
        <Image
          src={imageUrl}
          alt={service.name}
          fill
          sizes={imageSizes}
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />

        {/* Subtle bottom gradient to ease into cream bg */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none z-10"
          aria-hidden
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(246,244,241,0.45))',
          }}
        />
      </div>

      {/* ── Card text ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 px-1">
        {/* Animated rule */}
        <div
          className="mb-4 shrink-0 bg-navy/20"
          aria-hidden
          style={{
            height: '1px',
            width: visible ? '40px' : '0px',
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: mounted && visible ? `${delay + 300}ms` : '0ms',
          }}
        />

        {/* Name */}
        <h3
          className="font-primary text-navy uppercase leading-[1.05] mb-3"
          style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)' }}
        >
          {service.name}
        </h3>

        {/* Description */}
        <p
          className="font-secondary text-navy leading-relaxed mb-5"
          style={{
            fontSize: 'clamp(0.875rem, 1.1vw, 0.975rem)',
            maxWidth: '34ch',
          }}
        >
          {service.desc}
        </p>

        {/* Price pill */}
        <div>
          <span
            className="inline-block bg-navy text-cream font-neue uppercase px-3 py-1 tracking-[0.14em]"
            style={{ fontSize: '13px' }}
          >
            {service.price}
          </span>
        </div>
      </div>
    </article>
  )
}

/* ─── Main component ────────────────────────────────────────────────────────── */

export default function ServiciosManicura() {
  const t = useTranslations('servicios.manicura')
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

  const images = [
    'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/servicios/manicura.jpg',
    'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/servicios/pedicura.jpg',
  ]

  return (
    <section
      id="manicura-belleza"
      ref={sectionRef}
      className="relative w-full bg-cream overflow-hidden py-24 md:py-32"
      aria-labelledby="manicura-title"
    >
      {/* ── Decorative background letter ─────────────────────────────── */}
      <div
        className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 font-primary leading-none"
        aria-hidden
        style={{
          fontSize: 'clamp(16rem, 34vw, 32rem)',
          color: 'rgba(1,10,73,0.025)',
          lineHeight: 1,
          letterSpacing: '-0.06em',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(14%)' : 'translateX(20%)',
          transition: 'opacity 1.4s ease, transform 1.4s ease',
          transitionDelay: '150ms',
          userSelect: 'none',
        }}
      >
        M
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-8 md:px-16 lg:px-24">

        {/* ── Section header ─────────────────────────────────────────── */}
        <div className="mb-14 md:mb-18 max-w-xl">

          {/* Eyebrow */}
          <p
            className="font-neue uppercase tracking-[0.32em] text-orange mb-5"
            style={{ fontSize: '11px', ...anim(visible, 0, mounted, 'translateY(10px)') }}
          >
            {t('eyebrow')}
          </p>

          {/* Title */}
          <h2
            id="manicura-title"
            className="font-primary text-navy uppercase leading-[0.9] mb-8"
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
              ...anim(visible, 100, mounted, 'translateY(24px)'),
            }}
          >
            {t('title')}
          </h2>

          {/* Animated rule */}
          <div
            className="bg-navy/20 mb-8"
            aria-hidden
            style={{
              height: '1px',
              width: visible ? '56px' : '0px',
              transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
              transitionDelay: visible ? '250ms' : '0ms',
            }}
          />

          {/* Intro */}
          <p
            className="font-secondary text-navy leading-relaxed"
            style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
              maxWidth: '52ch',
              ...anim(visible, 320, mounted),
            }}
          >
            {t('intro')}
          </p>
        </div>

        {/* ── Services grid - asymmetric 60/40 ───────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-x-8 lg:gap-x-12 gap-y-16">
          {services.map((service, i) => (
            <ServiceCard
              key={service.name}
              service={service}
              imageUrl={images[i] ?? images[0]!}
              imageSizes={
                i === 0
                  ? '(max-width: 768px) 100vw, 60vw'
                  : '(max-width: 768px) 100vw, 40vw'
              }
              accentSide={i === 0 ? 'left' : 'right'}
              index={i}
              visible={visible}
              mounted={mounted}
            />
          ))}
        </div>

        {/* ── Bottom rule ────────────────────────────────────────────── */}
        <div
          className="mt-20 h-px"
          aria-hidden
          style={{
            backgroundColor: 'rgba(1,10,73,0.08)',
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 1s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: visible ? '800ms' : '0ms',
          }}
        />

      </div>
    </section>
  )
}
