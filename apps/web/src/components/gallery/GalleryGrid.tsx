'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { apiClient } from '@/lib/api-client'
import type { IGalleryPhoto, GalleryPageResponse } from '@falcanna/types'

type Direction = 'right' | 'left' | 'open'

const LIMIT = 16

const CONTENT_ANIMATION: Record<Direction, string> = {
  open:  'scaleInImage 0.3s cubic-bezier(0.22,1,0.36,1) both',
  right: 'slideInRight  0.28s cubic-bezier(0.22,1,0.36,1) both',
  left:  'slideInLeft   0.28s cubic-bezier(0.22,1,0.36,1) both',
}

interface GalleryGridProps {
  initialPhotos: IGalleryPhoto[]
  initialHasMore: boolean
}

export default function GalleryGrid({ initialPhotos, initialHasMore }: GalleryGridProps) {
  const [photos, setPhotos]     = useState<IGalleryPhoto[]>(initialPhotos)
  const [hasMore, setHasMore]   = useState(initialHasMore)
  const [page, setPage]         = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  const [selected, setSelected]         = useState<IGalleryPhoto | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [direction, setDirection]       = useState<Direction>('open')
  const [closing, setClosing]           = useState(false)
  const [entered, setEntered]           = useState(false)

  const sentinelRef = useRef<HTMLDivElement>(null)

  // Staggered entrance animation on mount
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Infinite scroll
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const res = await apiClient.get<GalleryPageResponse>(`/gallery?page=${nextPage}&limit=${LIMIT}`)
      setPhotos((prev) => [...prev, ...res.data])
      setHasMore(res.hasMore)
      setPage(nextPage)
    } catch (err) {
      console.error('Error loading gallery page:', err)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, page])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) loadMore() },
      { rootMargin: '500px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [loadMore])

  // Lightbox — animated close
  const close = useCallback(() => {
    setClosing(true)
    setTimeout(() => { setSelected(null); setClosing(false) }, 220)
  }, [])

  const openPhoto = useCallback((photo: IGalleryPhoto, index: number) => {
    setDirection('open')
    setSelected(photo)
    setSelectedIndex(index)
  }, [])

  const goTo = useCallback((index: number, dir: Direction) => {
    if (photos.length === 0) return
    const i = (index + photos.length) % photos.length
    const next = photos[i]
    if (!next) return
    setDirection(dir)
    setSelectedIndex(i)
    setSelected(next)
  }, [photos])

  useEffect(() => {
    if (!selected) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowRight') goTo(selectedIndex + 1, 'right')
      if (e.key === 'ArrowLeft')  goTo(selectedIndex - 1, 'left')
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selected, selectedIndex, close, goTo])

  if (photos.length === 0 && !loadingMore) {
    return (
      <p className="py-24 text-center font-neue text-[11px] tracking-[0.25em] uppercase text-navy/30">
        Próximamente
      </p>
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeInOverlay  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOutOverlay { from { opacity: 1 } to { opacity: 0 } }
        @keyframes scaleInImage {
          from { opacity: 0; transform: scale(0.94) }
          to   { opacity: 1; transform: scale(1)    }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(52px) scale(0.97) }
          to   { opacity: 1; transform: translateX(0)    scale(1)    }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-52px) scale(0.97) }
          to   { opacity: 1; transform: translateX(0)     scale(1)    }
        }
      `}</style>

      {/* ── Masonry grid ───────────────────────────────────────────────────── */}
      <div className="columns-2 md:columns-3 lg:columns-4" style={{ columnGap: '2px' }}>
        {photos.map((photo, i) => (
          <div
            key={photo._id}
            className="break-inside-avoid group relative overflow-hidden cursor-pointer"
            style={{
              marginBottom: '2px',
              opacity: entered ? 1 : 0,
              transform: entered ? 'translateY(0)' : 'translateY(16px)',
              // Only animate the first batch; subsequent batches appear immediately
              transition: i < LIMIT
                ? `opacity 0.65s ease ${i * 0.04}s, transform 0.65s ease ${i * 0.04}s`
                : 'none',
            }}
            onClick={() => openPhoto(photo, i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.alt}
              loading={i < 4 ? 'eager' : 'lazy'}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            {/* Hover overlay */}
            <div
              className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(to top, rgba(1,10,73,0.78) 0%, transparent 65%)' }}
            >
              {photo.category && (
                <span className="font-neue text-orange text-[9px] tracking-[0.25em] uppercase mb-0.5 block translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {photo.category}
                </span>
              )}
              {photo.alt && (
                <span className="font-secondary text-cream/80 text-sm leading-tight block translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                  {photo.alt}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sentinel — triggers next page load when visible */}
      <div ref={sentinelRef} className="h-1" />

      {/* Loading indicator */}
      {loadingMore && (
        <div className="flex justify-center py-12">
          <span className="font-neue text-[10px] tracking-[0.3em] uppercase text-navy/35 animate-pulse">
            Cargando
          </span>
        </div>
      )}

      {/* End of gallery */}
      {!hasMore && photos.length > 0 && (
        <div className="flex justify-center py-10">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-navy/15" />
            <span className="font-neue text-[9px] tracking-[0.3em] uppercase text-navy/25">
              {photos.length} fotos
            </span>
            <div className="h-px w-12 bg-navy/15" />
          </div>
        </div>
      )}

      {/* ── Lightbox ───────────────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: closing ? 'fadeOutOverlay 0.22s ease both' : 'fadeInOverlay 0.22s ease both',
          }}
          onClick={close}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-10 py-6 pointer-events-none z-10">
            <span className="font-neue text-white/40 text-[10px] tracking-[0.28em] uppercase">
              {String(selectedIndex + 1).padStart(2, '0')} — {String(photos.length).padStart(2, '0')}
            </span>
            <button
              className="pointer-events-auto font-neue text-white/50 hover:text-white text-3xl leading-none transition-colors duration-200"
              onClick={close}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {/* Prev */}
          <button
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 font-neue text-white/35 hover:text-white text-xl transition-colors duration-200 p-4 z-10"
            onClick={(e) => { e.stopPropagation(); goTo(selectedIndex - 1, 'left') }}
            aria-label="Anterior"
          >
            ←
          </button>

          {/* Next */}
          <button
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 font-neue text-white/35 hover:text-white text-xl transition-colors duration-200 p-4 z-10"
            onClick={(e) => { e.stopPropagation(); goTo(selectedIndex + 1, 'right') }}
            aria-label="Siguiente"
          >
            →
          </button>

          {/* Image + caption */}
          <div
            key={selectedIndex}
            className="flex flex-col items-center gap-5 px-14 md:px-20"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: closing ? 'none' : CONTENT_ANIMATION[direction] }}
          >
            <div
              className="relative"
              style={{ width: 'min(84vw, 1000px)', height: 'min(74vh, 800px)' }}
            >
              <Image
                src={selected.url}
                alt={selected.alt}
                fill
                sizes="(max-width: 1000px) 84vw, 1000px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>

            {(selected.category || selected.alt) && (
              <div className="text-center">
                {selected.category && (
                  <span className="font-neue text-orange text-[9px] tracking-[0.28em] uppercase block mb-1">
                    {selected.category}
                  </span>
                )}
                {selected.alt && (
                  <span className="font-secondary text-white/45 text-sm italic">
                    {selected.alt}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
