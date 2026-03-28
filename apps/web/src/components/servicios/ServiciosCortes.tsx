'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const S3 = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com'
const EDITORIAL_IMAGES = [
  { src: `${S3}/servicios/cortediseño.webp`,              label: 'Artístico Design' },
  { src: `${S3}/servicios/metodocurly.webp`,              label: 'Danza de Rizos' },
  { src: `${S3}/servicios/recogido.webp`,        label: 'Glamour en Altura' },
  { src: `${S3}/servicios/ondas.webp`,           label: 'Alfombra Roja' },
]

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface Service {
  name: string
  tagline: string
  desc: string
  price: string
}

/* ─── Animation helper ───────────────────────────────────────────────────── */

function rowStyle(
  visible: boolean,
  delay: number,
  mounted: boolean,
): React.CSSProperties {
  if (!mounted) return { opacity: 0, transform: 'translateY(28px)' }
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(28px)',
    transition: 'opacity 0.72s ease, transform 0.72s cubic-bezier(0.16, 1, 0.3, 1)',
    transitionDelay: visible ? `${delay}ms` : '0ms',
  }
}

/* ─── Service row ────────────────────────────────────────────────────────── */

function ServiceRow({
  service,
  index,
  visible,
  mounted,
}: {
  service: Service
  index: number
  visible: boolean
  mounted: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const num = String(index + 1).padStart(2, '0')
  const delay = 120 + index * 110

  return (
    <div
      style={rowStyle(visible, delay, mounted)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top rule */}
      <div className="w-full h-px bg-navy/12" />

      {/* Row body */}
      <div
        className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto_1fr] md:items-start gap-x-10 lg:gap-x-16 px-0 py-7 md:py-8 transition-colors duration-300"
        style={{ backgroundColor: hovered ? 'rgba(1,10,73,0.028)' : 'transparent' }}
      >
        {/* Index number */}
        <div className="hidden md:flex items-start pt-[0.55rem]">
          <span
            className="font-neue text-[11px] tracking-[0.18em] select-none"
            style={{ color: 'rgba(1,10,73,0.22)' }}
          >
            {num}
          </span>
        </div>

        {/* Name + tagline */}
        <div className="flex flex-col gap-[0.35rem]">
          {/* Mobile: number inline */}
          <span
            className="font-neue text-[10px] tracking-[0.18em] md:hidden mb-1"
            style={{ color: 'rgba(1,10,73,0.28)' }}
          >
            {num}
          </span>

          <h3
            className="font-primary text-navy uppercase leading-[0.9] tracking-[0.03em]"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)' }}
          >
            {service.name}
          </h3>

          <p
            className="font-neue uppercase tracking-[0.26em] text-[10px]"
            style={{ color: 'rgba(254,81,0,0.65)' }}
          >
            {service.tagline}
          </p>
        </div>

        {/* Spacer column — only on md grid, holds layout alignment */}
        <div className="hidden md:block" />

        {/* Description + price */}
        <div className="flex flex-col gap-5 mt-4 md:mt-[0.35rem]">
          <p
            className="font-secondary leading-[1.72] max-w-[52ch]"
            style={{
              fontSize: 'clamp(0.9rem, 1.1vw, 1rem)',
              color: 'rgba(1,10,73,0.58)',
            }}
          >
            {service.desc}
          </p>

          {/* Price label */}
          <div className="flex md:justify-end">
            <span className="font-neue uppercase text-[10px] tracking-[0.2em] text-cream bg-navy px-3 py-[0.35rem] inline-block">
              {service.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────── */

export default function ServiciosCortes() {
  const t = useTranslations('servicios.cortes')
  const services = t.raw('services') as Service[]

  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  /* Header animation helper */
  function headerStyle(delay: number): React.CSSProperties {
    if (!mounted) return { opacity: 0, transform: 'translateY(18px)' }
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(18px)',
      transition: 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16,1,0.3,1)',
      transitionDelay: visible ? `${delay}ms` : '0ms',
    }
  }

  return (
    <section
      id={t('anchor')}
      ref={sectionRef}
      className="relative w-full bg-cream overflow-hidden py-24 md:py-32"
      aria-labelledby="cortes-title"
    >
      {/* ── Ghost watermark ──────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute top-0 right-0 font-primary leading-none text-navy"
        style={{
          fontSize: 'clamp(9rem, 22vw, 22rem)',
          opacity: mounted ? (visible ? 0.03 : 0) : 0,
          transform: mounted
            ? visible
              ? 'translateX(8%) translateY(-6%)'
              : 'translateX(14%) translateY(-10%)'
            : 'translateX(14%) translateY(-10%)',
          transition: 'opacity 1.2s ease, transform 1.2s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: visible ? '200ms' : '0ms',
          lineHeight: 0.85,
          zIndex: 0,
          userSelect: 'none',
        }}
      >
        {t('title')}
      </div>

      {/* ── Inner container ──────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-20 xl:px-28">

        {/* ── Section header ────────────────────────────────────────────── */}
        <div className="mb-14 md:mb-20 max-w-[820px]">

          {/* Eyebrow */}
          <p
            className="font-neue uppercase text-orange tracking-[0.3em] text-[10px] mb-5"
            style={headerStyle(0)}
          >
            {t('eyebrow')}
          </p>

          {/* Title */}
          <h2
            id="cortes-title"
            className="font-primary uppercase text-navy leading-[0.88] mb-7"
            style={{
              fontSize: 'clamp(3.5rem, 7vw, 6.5rem)',
              ...headerStyle(100),
            }}
          >
            {t('title')}
          </h2>

          {/* Orange rule */}
          <div
            className="bg-orange h-px mb-8"
            style={{
              width: mounted ? (visible ? '56px' : '0px') : '0px',
              transition: 'width 0.65s cubic-bezier(0.16,1,0.3,1)',
              transitionDelay: visible ? '220ms' : '0ms',
            }}
          />

          {/* Intro paragraph */}
          <p
            className="font-secondary text-navy/65 leading-[1.8] max-w-[62ch]"
            style={{
              fontSize: 'clamp(1rem, 1.2vw, 1.1rem)',
              ...headerStyle(320),
            }}
          >
            {t('intro')}
          </p>
        </div>

        {/* ── Editorial photo strip ────────────────────────────────────── */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16 md:mb-20"
          style={headerStyle(440)}
        >
          {EDITORIAL_IMAGES.map(({ src, label }) => (
            <div key={src} className="relative group overflow-hidden aspect-[4/5]">
              <Image
                src={src}
                alt={label}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/50 to-transparent px-4 py-3">
                <span className="font-neue uppercase text-[9px] tracking-[0.18em] text-cream/70">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Editorial numbered list ───────────────────────────────────── */}
        <div className="flex flex-col">
          {services.map((service, i) => (
            <ServiceRow
              key={service.name}
              service={service}
              index={i}
              visible={visible}
              mounted={mounted}
            />
          ))}

          {/* Bottom rule */}
          <div
            className="w-full h-px bg-navy/12"
            style={rowStyle(visible, 120 + services.length * 110, mounted)}
          />
        </div>

      </div>
    </section>
  )
}
