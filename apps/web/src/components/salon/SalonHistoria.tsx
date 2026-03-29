'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

/* ─── Animation helper ───────────────────────────────────────────────────── */

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

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function SalonHistoria() {
  const t = useTranslations('elSalon.historia')
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
      { threshold: 0.18 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="historia"
      ref={sectionRef}
      className="relative w-full bg-cream overflow-hidden py-24 md:py-32"
      aria-label={t('eyebrow')}
    >
      {/* ── Ghost year watermark ─────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute left-0 bottom-0 font-primary leading-none text-navy"
        style={{
          fontSize: 'clamp(10rem, 28vw, 26rem)',
          opacity: mounted ? (visible ? 0.045 : 0) : 0,
          transform: mounted
            ? visible
              ? 'translateX(-4%) translateY(18%)'
              : 'translateX(-10%) translateY(24%)'
            : 'translateX(-10%) translateY(24%)',
          transition: 'opacity 1.1s ease, transform 1.1s cubic-bezier(0.16,1,0.3,1)',
          transitionDelay: visible ? '300ms' : '0ms',
          lineHeight: 0.82,
          zIndex: 0,
        }}
      >
        2025
      </div>

      {/* ── Inner grid ───────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-[1680px] px-6 sm:px-10 lg:px-20 xl:px-28">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.72fr] gap-12 lg:gap-16 xl:gap-24 items-start">

          {/* ── LEFT column: editorial copy ─────────────────────────────── */}
          <div className="flex flex-col justify-center lg:py-8">

            {/* Eyebrow */}
            <p
              className="font-neue uppercase text-orange tracking-[0.3em] text-[10px] mb-6"
              style={anim(visible, 0, mounted)}
            >
              {t('eyebrow')}
            </p>

            {/* Title */}
            <h2
              className="font-primary uppercase text-navy leading-[0.88] mb-8"
              style={{
                fontSize: 'clamp(4.5rem, 9vw, 8rem)',
                ...anim(visible, 120, mounted),
              }}
            >
              {t('title')}
            </h2>

            {/* Orange rule */}
            <div
              className="bg-orange h-px mb-10"
              style={{
                width: mounted ? (visible ? '56px' : '0px') : '0px',
                transition: 'width 0.65s cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: visible ? '260ms' : '0ms',
              }}
            />

            {/* Body */}
            <p
              className="font-secondary text-navy/75 leading-[1.75] max-w-[52ch]"
              style={{
                fontSize: 'clamp(1rem, 1.25vw, 1.125rem)',
                ...anim(visible, 340, mounted),
              }}
            >
              {t('body')}
            </p>

            {/* Spacer */}
            <div className="mt-14 lg:mt-20" />

            {/* Founder credits */}
            <div
              className="flex flex-col gap-2"
              style={anim(visible, 520, mounted)}
            >
              <div
                className="h-px bg-navy/15 mb-4"
                style={{
                  width: mounted ? (visible ? '40px' : '0px') : '0px',
                  transition: 'width 0.55s ease',
                  transitionDelay: visible ? '520ms' : '0ms',
                }}
              />
              <p className="font-neue uppercase tracking-[0.28em] text-navy/40 text-[9px]">
                {t('foundedBy')}
              </p>
              <p className="font-neue uppercase tracking-[0.2em] text-navy text-[11px]">
                {t('founders')}
              </p>
            </div>
          </div>

          {/* ── RIGHT column: image ─────────────────────────────────────── */}
          <div
            className="relative w-full"
            style={{
              ...anim(visible, 160, mounted, 'translateX(32px)'),
            }}
          >
            {/* Tall image wrapper - slight negative top offset for asymmetric feel */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                height: 'clamp(480px, 70vh, 820px)',
                marginTop: 'clamp(-2rem, -4vw, -4rem)',
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=960&q=80"
                alt="Dos estilistas trabajando en el salón Qué Bárbaro"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
                priority={false}
              />

              {/* Subtle cream-to-transparent overlay at bottom edge */}
              <div
                className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(246,244,241,0.5) 0%, transparent 100%)',
                }}
              />
            </div>

            {/* Decorative orange accent line on the left edge of the image */}
            <div
              className="absolute left-0 top-0 w-[3px] bg-orange"
              style={{
                height: mounted ? (visible ? '100%' : '0%') : '0%',
                transition: 'height 0.9s cubic-bezier(0.16,1,0.3,1)',
                transitionDelay: visible ? '400ms' : '0ms',
              }}
            />

            {/* Year stamp on image - bottom right corner */}
            <div
              className="absolute bottom-6 right-6 pointer-events-none select-none"
              style={anim(visible, 600, mounted)}
            >
              <p className="font-neue uppercase tracking-[0.32em] text-cream/80 text-[9px]">
                Est. 2025
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
