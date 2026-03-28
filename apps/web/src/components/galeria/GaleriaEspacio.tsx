'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { IGalleryPhoto } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

/* ─── Animation helper ───────────────────────────────────────────────────── */

function anim(visible: boolean, delay: number, mounted: boolean, from = 'translateY(24px)'): React.CSSProperties {
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

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function GaleriaEspacio() {
  const t = useTranslations('galeria.espacio')

  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [images, setImages] = useState<IGalleryPhoto[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
    fetch(`${API_URL}/gallery/section/espacio`)
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((json) => setImages(json.data ?? []))
      .catch(() => setImages([]))
  }, [])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const [heroImg, ...gridImgs] = images

  return (
    <section
      id="el-salon"
      ref={sectionRef}
      className="bg-cream py-24 md:py-32"
    >
      <div className="max-w-[1680px] mx-auto px-8 md:px-16">

        {/* ── Section header ───────────────────────────────────────────────── */}
        <div className="mb-12 md:mb-16">

          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-6"
            style={anim(visible, 0, mounted)}
          >
            <span
              className="block shrink-0 w-[6px] h-[6px] rounded-full bg-orange"
              aria-hidden="true"
            />
            <p
              className="font-neue text-navy/40 uppercase tracking-[0.3em]"
              style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)' }}
            >
              {t('eyebrow')}
            </p>
          </div>

          {/* Title */}
          <h2
            className="font-primary uppercase text-navy leading-[0.88] tracking-tight"
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 8rem)',
              ...anim(visible, 80, mounted),
            }}
          >
            {t('title')}
          </h2>

          {/* Animated orange rule */}
          <div
            className="bg-orange mt-5"
            style={{
              height: '2px',
              width: visible ? '80px' : '0px',
              transitionProperty: mounted ? 'width' : 'none',
              transitionDuration: '0.8s',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: visible ? '200ms' : '0ms',
            }}
            aria-hidden="true"
          />

          {/* Description */}
          <p
            className="font-secondary italic text-navy/55 leading-relaxed mt-4"
            style={{
              fontSize: 'clamp(1rem, 1.3vw, 1.1rem)',
              maxWidth: '48ch',
              ...anim(visible, 160, mounted),
            }}
          >
            {t('description')}
          </p>
        </div>

        {/* ── Photo grid ───────────────────────────────────────────────────── */}

        {/* Hero image — full-width tall */}
        <div
          style={anim(visible, 240, mounted)}
          className="relative group overflow-hidden aspect-[21/9] w-full"
        >
          {heroImg && (
            <Image
              src={heroImg.url}
              alt={heroImg.alt || ''}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-navy/70 px-4 py-2">
            <span className="font-neue uppercase text-[9px] tracking-[0.18em] text-cream/80">
              {heroImg?.alt}
            </span>
          </div>
        </div>

        {/* Grid of 4 square images */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-3 md:mt-4">
          {gridImgs.map((img, i) => (
            <div
              key={img._id}
              className="relative group overflow-hidden aspect-square"
              style={anim(visible, 320 + i * 80, mounted)}
            >
              <Image
                src={img.url}
                alt={img.alt || ''}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-navy/70 px-4 py-2">
                <span className="font-neue uppercase text-[9px] tracking-[0.18em] text-cream/80">
                  {img.alt}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
