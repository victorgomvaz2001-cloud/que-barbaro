'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const S3 = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com'
const IMAGES = [
  `${S3}/makeupnoche.webp`,
  `${S3}/quemecaso.webp`,
  `${S3}/mevoydefiesta.webp`,
]

type Service = {
  name: string
  tagline: string
  desc: string
  price: string
}

export default function ServiciosMaquillaje() {
  const t = useTranslations('servicios.maquillaje')
  const services = t.raw('services') as Service[]

  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes maq-fadeUp {
          from {
            opacity: 0;
            transform: translateY(32px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes maq-ruleExpand {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }

        @keyframes maq-barDrop {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }

        @keyframes maq-imageReveal {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }

        .maq-visible .maq-header-0 {
          animation: maq-fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 0ms;
        }
        .maq-visible .maq-header-1 {
          animation: maq-fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 100ms;
        }
        .maq-visible .maq-header-rule {
          animation: maq-ruleExpand 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 200ms;
        }
        .maq-visible .maq-header-2 {
          animation: maq-fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 260ms;
        }

        .maq-visible .maq-card-0 {
          animation: maq-fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 360ms;
        }
        .maq-visible .maq-card-1 {
          animation: maq-fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 480ms;
        }
        .maq-visible .maq-card-2 {
          animation: maq-fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 600ms;
        }

        .maq-visible .maq-bar-0 {
          animation: maq-barDrop 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 420ms;
        }
        .maq-visible .maq-bar-1 {
          animation: maq-barDrop 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 540ms;
        }
        .maq-visible .maq-bar-2 {
          animation: maq-barDrop 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 660ms;
        }

        .maq-visible .maq-img-0 {
          animation: maq-imageReveal 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 380ms;
        }
        .maq-visible .maq-img-1 {
          animation: maq-imageReveal 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 500ms;
        }
        .maq-visible .maq-img-2 {
          animation: maq-imageReveal 1s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 620ms;
        }
      `}</style>

      <section
        id="maquillaje-belleza"
        ref={sectionRef}
        className={`relative w-full bg-navy py-24 md:py-32 overflow-hidden${visible ? ' maq-visible' : ''}`}
        aria-labelledby="maquillaje-title"
      >
        {/* Ghost watermark */}
        <span
          className="pointer-events-none select-none absolute -bottom-[6vw] -right-[4vw] font-primary text-cream/[0.03] leading-none uppercase"
          style={{ fontSize: 'clamp(10rem, 28vw, 28rem)', zIndex: 0 }}
          aria-hidden="true"
        >
          M
        </span>

        <div className="relative z-10 max-w-[1680px] mx-auto px-8 md:px-16 lg:px-24">

          {/* ── Section header ──────────────────────────────────────────── */}
          <div className="mb-16 md:mb-20">

            {/* Eyebrow */}
            <p
              className="maq-header-0 font-neue uppercase tracking-[0.3em] text-cream/40 mb-4"
              style={{ fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)' }}
            >
              {t('eyebrow')}
            </p>

            {/* Title */}
            <h2
              id="maquillaje-title"
              className="maq-header-1 font-primary uppercase text-cream leading-[0.88] tracking-tight"
              style={{ fontSize: 'clamp(3rem, 9vw, 8rem)' }}
            >
              {t('title')}
            </h2>

            {/* Orange rule */}
            <div className="mt-6 md:mt-8 mb-8 overflow-hidden">
              <div
                className="maq-header-rule h-px w-16 bg-orange"
                aria-hidden="true"
              />
            </div>

            {/* Intro */}
            <p
              className="maq-header-2 font-secondary italic text-cream/60 leading-relaxed"
              style={{
                fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
                maxWidth: '52ch',
              }}
            >
              {t('intro')}
            </p>
          </div>

          {/* ── Services grid ───────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-cream/5">
            {services.map((service, i) => (
              <article
                key={service.name}
                className={`maq-card-${i} relative flex flex-col bg-navy group`}
              >
                {/* Top orange bar — animates in on scroll, scales on hover */}
                <div
                  className={`maq-bar-${i} h-[2px] w-full bg-orange origin-left`}
                  style={{ transformOrigin: 'left' }}
                  aria-hidden="true"
                />

                {/* Image panel ~40% height */}
                <div className={`maq-img-${i} relative w-full aspect-[4/5] overflow-hidden`}>
                  <Image
                    src={IMAGES[i] ?? IMAGES[0]!}
                    alt={service.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {/* Dark gradient overlay at bottom of image */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(1,10,73,0.85) 0%, rgba(1,10,73,0.3) 45%, transparent 75%)',
                    }}
                    aria-hidden="true"
                  />
                  {/* Index number ghost */}
                  <span
                    className="absolute bottom-4 left-5 font-primary text-cream/20 leading-none select-none pointer-events-none"
                    style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content panel ~60% */}
                <div className="flex flex-col flex-1 px-6 pt-6 pb-8 md:px-7 md:pt-7 md:pb-9 gap-4">

                  {/* Name */}
                  <h3
                    className="font-primary text-cream uppercase leading-tight tracking-[0.04em]"
                    style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}
                  >
                    {service.name}
                  </h3>

                  {/* Tagline — only rendered if non-empty */}
                  {service.tagline ? (
                    <p
                      className="font-neue uppercase tracking-[0.18em] text-orange"
                      style={{ fontSize: '10px' }}
                    >
                      {service.tagline}
                    </p>
                  ) : (
                    /* spacer so layout stays consistent across cards */
                    <span className="block" style={{ height: '14px' }} aria-hidden="true" />
                  )}

                  {/* Description */}
                  <p
                    className="font-secondary text-cream/60 leading-relaxed flex-1"
                    style={{ fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)' }}
                  >
                    {service.desc}
                  </p>

                  {/* Price badge */}
                  <div className="pt-2">
                    <span
                      className="inline-block border border-cream/20 font-neue uppercase tracking-[0.14em] text-cream px-4 py-2 transition-colors duration-300 group-hover:bg-orange group-hover:border-orange group-hover:text-cream"
                      style={{ fontSize: '11px' }}
                    >
                      {service.price}
                    </span>
                  </div>

                </div>
              </article>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
