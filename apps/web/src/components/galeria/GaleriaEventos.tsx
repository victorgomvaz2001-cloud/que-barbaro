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

export default function GaleriaEventos() {
  const t = useTranslations('galeria.eventos')

  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [images, setImages] = useState<IGalleryPhoto[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
    fetch(`${API_URL}/gallery/section/eventos`)
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

  const [heroImg, ...restImgs] = images

  return (
    <section
      id="packs-y-eventos"
      ref={sectionRef}
      className="relative bg-navy overflow-hidden py-24 md:py-32"
    >
      {/* ── Grain texture overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          opacity: 0.5,
          mixBlendMode: 'overlay',
        }}
        aria-hidden
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-[1680px] mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* ── Left column: text block ───────────────────────────────────── */}
          <div>

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
                className="font-neue text-cream/40 uppercase tracking-[0.3em]"
                style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)' }}
              >
                {t('eyebrow')}
              </p>
            </div>

            {/* Title */}
            <h2
              className="font-primary uppercase text-cream leading-[0.88] tracking-[0.04em]"
              style={{
                fontSize: 'clamp(3rem, 7vw, 6rem)',
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
              className="font-secondarytext-cream/65 leading-relaxed mt-6"
              style={{
                fontSize: 'clamp(1rem, 1.2vw, 1.05rem)',
                maxWidth: '40ch',
                ...anim(visible, 160, mounted),
              }}
            >
              {t('description')}
            </p>

            {/* CTA label */}
            <p
              className="font-neue uppercase text-orange tracking-[0.15em] text-[11px] mt-8"
              style={anim(visible, 240, mounted)}
            >
              {t('cta')}
            </p>

            {/* WhatsApp button */}
            <div style={anim(visible, 320, mounted)}>
              <a
                href="https://wa.me/34644817835"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-orange text-cream font-neue uppercase tracking-[0.2em] text-[11px] px-10 py-4 mt-4 transition-colors duration-300 hover:bg-cream hover:text-navy"
              >
                {/* WhatsApp icon */}
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {t('whatsapp')}
              </a>
            </div>

          </div>

          {/* ── Right column: image grid ──────────────────────────────────── */}
          <div
            className="grid grid-cols-2 gap-3"
            style={anim(visible, 160, mounted, 'translateY(32px)')}
          >

            {/* First image spans full width */}
            <div className="col-span-2 relative aspect-[16/7] overflow-hidden group">
              {heroImg && (
                <Image
                  src={heroImg.url}
                  alt={heroImg.alt || ''}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/50 to-transparent px-4 py-3">
                <span className="font-neue uppercase text-[9px] tracking-[0.15em] text-cream">
                  {heroImg?.alt}
                </span>
              </div>
            </div>

            {/* Remaining 3 images */}
            {restImgs.map((img, i) => (
              <div
                key={img._id}
                className="relative aspect-square overflow-hidden group"
                style={anim(visible, 280 + i * 80, mounted)}
              >
                <Image
                  src={img.url}
                  alt={img.alt || ''}
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/50 to-transparent px-4 py-3">
                  <span className="font-neue uppercase text-[9px] tracking-[0.15em] text-cream">
                    {img.alt}
                  </span>
                </div>
              </div>
            ))}

          </div>

        </div>
      </div>
    </section>
  )
}
