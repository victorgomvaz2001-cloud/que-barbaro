'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import type { IGalleryCategory, IGalleryPhoto } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

// ── Types ──────────────────────────────────────────────────────────────────────

interface CategoryWithPhotos {
  category: IGalleryCategory
  photos: IGalleryPhoto[]
}

// ── Lightbox ───────────────────────────────────────────────────────────────────

function Lightbox({
  photos,
  initialIndex,
  onClose,
}: {
  photos: IGalleryPhoto[]
  initialIndex: number
  onClose: () => void
}) {
  const [index, setIndex] = useState(initialIndex)
  const t = useTranslations('galeriaServicios')

  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, prev, next])

  const photo = photos[index]!

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 font-neue text-cream text-xs uppercase tracking-[0.2em]">
        {index + 1} {t('of')} {photos.length}
      </div>

      {/* Close */}
      <button
        className="absolute top-4 right-5 text-cream hover:text-cream text-2xl leading-none transition-colors"
        onClick={onClose}
        aria-label="Cerrar"
      >
        ×
      </button>

      {/* Prev */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-cream hover:text-cream transition-colors"
        onClick={(e) => { e.stopPropagation(); prev() }}
        aria-label="Anterior"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M13 4l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Image */}
      <div
        className="relative max-h-[85vh] max-w-[90vw] w-full"
        style={{ aspectRatio: '4/3' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.url}
          alt={photo.alt || ''}
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Next */}
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center text-cream hover:text-cream transition-colors"
        onClick={(e) => { e.stopPropagation(); next() }}
        aria-label="Siguiente"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

// ── Carousel ───────────────────────────────────────────────────────────────────

function CategoryCarousel({
  photos,
  onImageClick,
  onDark = false,
}: {
  photos: IGalleryPhoto[]
  onImageClick: (index: number) => void
  onDark?: boolean
}) {
  const [start, setStart] = useState(0)
  const VISIBLE = 3

  if (photos.length === 0) return null

  const canPrev = photos.length > VISIBLE
  const canNext = photos.length > VISIBLE

  function prev() {
    setStart((s) => (s - 1 + photos.length) % photos.length)
  }

  function next() {
    setStart((s) => (s + 1) % photos.length)
  }

  // Build visible slice (with wraparound)
  const visible = Array.from({ length: Math.min(VISIBLE, photos.length) }, (_, i) => {
    const idx = (start + i) % photos.length
    return { photo: photos[idx]!, realIndex: idx }
  })

  const arrowClass = onDark
    ? 'border-white/30 text-white/60 hover:border-white hover:text-white'
    : 'border-navy/20 text-navy/50 hover:border-navy hover:text-navy'

  return (
    <div className="relative flex items-center gap-3 md:gap-4">
      {/* Prev arrow */}
      <button
        onClick={prev}
        disabled={!canPrev}
        className={`shrink-0 flex h-10 w-10 items-center justify-center border transition-colors disabled:opacity-20 disabled:pointer-events-none ${arrowClass}`}
        aria-label="Anterior"
      >
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M15 5H1M6 1L2 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Photos */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {visible.map(({ photo, realIndex }, i) => (
          <button
            key={`${realIndex}-${i}`}
            onClick={() => onImageClick(realIndex)}
            className="relative overflow-hidden group"
            style={{ aspectRatio: '3/4' }}
            aria-label={photo.alt || 'Ver imagen'}
          >
            <Image
              src={photo.url}
              alt={photo.alt || ''}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Next arrow */}
      <button
        onClick={next}
        disabled={!canNext}
        className={`shrink-0 flex h-10 w-10 items-center justify-center border transition-colors disabled:opacity-20 disabled:pointer-events-none ${arrowClass}`}
        aria-label="Siguiente"
      >
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M1 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

// ── Category section ───────────────────────────────────────────────────────────

function CategorySection({
  category,
  photos,
  locale,
}: {
  category: IGalleryCategory
  photos: IGalleryPhoto[]
  locale: string
}) {
  const t = useTranslations('galeriaServicios')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const name        = locale === 'en' ? category.nameEn        : category.nameEs
  const description = locale === 'en' ? category.descriptionEn : category.descriptionEs
  const hasBg       = !!category.backgroundImage

  return (
    <div
      className={`relative border-b last:border-0 ${hasBg ? 'border-white/10' : 'border-navy/10 bg-white'}`}
      style={hasBg ? { backgroundImage: `url(${category.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
    >
      {/* Dark overlay when background image is present */}
      {hasBg && <div className="absolute inset-0 bg-black/25 pointer-events-none" aria-hidden="true" />}

      <div className="relative max-w-[1680px] mx-auto px-6 md:px-12 py-16 md:py-24">
        {/* Header */}
        <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-12">
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <span className="block shrink-0 w-2 h-2 rounded-full bg-orange" aria-hidden="true" />
              <p
                className={`font-neue uppercase tracking-[0.22em] ${hasBg ? 'text-white/70' : 'text-navy/50'}`}
                style={{ fontSize: 'clamp(0.6rem, 0.9vw, 0.75rem)' }}
              >
                {photos.length} {t('photos')}
              </p>
            </div>
            <h2
              className={`font-primary uppercase leading-[0.9] tracking-[0.04em] ${hasBg ? 'text-white' : 'text-navy'}`}
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)' }}
            >
              {name}
            </h2>
          </div>
          {description && (
            <p
              className={`font-secondary leading-relaxed max-w-sm md:text-right ${hasBg ? 'text-white/70' : 'text-navy/60'}`}
              style={{ fontSize: 'clamp(0.85rem, 1.1vw, 0.95rem)' }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Carousel */}
        <CategoryCarousel
          photos={photos}
          onImageClick={(idx) => setLightboxIndex(idx)}
          onDark={hasBg}
        />

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <Lightbox
            photos={photos}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function GaleriaServicios() {
  const locale = useLocale()
  const [data, setData] = useState<CategoryWithPhotos[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [catsRes, photosRes] = await Promise.all([
          fetch(`${API_URL}/gallery/categories`),
          fetch(`${API_URL}/gallery/section/services`),
        ])
        const catsJson   = await catsRes.json()
        const photosJson = await photosRes.json()

        const categories: IGalleryCategory[] = catsJson.data ?? []
        const photos: IGalleryPhoto[]        = photosJson.data ?? []

        // Group photos by category slug, filter out categories without visible photos
        const grouped: CategoryWithPhotos[] = categories
          .map((cat) => ({
            category: cat,
            photos: photos.filter((p) => p.category === cat.slug && p.visible),
          }))
          .filter((entry) => entry.photos.length > 0)

        setData(grouped)
      } catch (err) {
        console.error('GaleriaServicios load error', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || data.length === 0) return null

  return (
    <section className="w-full">
      {data.map(({ category, photos }) => (
        <CategorySection
          key={category.slug}
          category={category}
          photos={photos}
          locale={locale}
        />
      ))}
    </section>
  )
}
