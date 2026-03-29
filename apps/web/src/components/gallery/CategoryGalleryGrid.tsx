'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { IGalleryPhoto } from '@falcanna/types'

type Direction = 'right' | 'left' | 'open'

const CONTENT_ANIMATION: Record<Direction, string> = {
  open:  'scaleInCat 0.3s cubic-bezier(0.22,1,0.36,1) both',
  right: 'slideInRightCat 0.28s cubic-bezier(0.22,1,0.36,1) both',
  left:  'slideInLeftCat  0.28s cubic-bezier(0.22,1,0.36,1) both',
}

interface Props {
  photos: IGalleryPhoto[]
  comingSoon?: string
}

export default function CategoryGalleryGrid({ photos, comingSoon = 'Próximamente' }: Props) {
  const [selected, setSelected]         = useState<IGalleryPhoto | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [direction, setDirection]       = useState<Direction>('open')
  const [closing, setClosing]           = useState(false)

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

  if (photos.length === 0) {
    return (
      <p className="py-14 font-neue text-[10px] tracking-[0.28em] uppercase text-navy/25">
        {comingSoon}
      </p>
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeInCatOverlay  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes fadeOutCatOverlay { from { opacity: 1 } to { opacity: 0 } }
        @keyframes scaleInCat {
          from { opacity: 0; transform: scale(0.94) }
          to   { opacity: 1; transform: scale(1) }
        }
        @keyframes slideInRightCat {
          from { opacity: 0; transform: translateX(52px) scale(0.97) }
          to   { opacity: 1; transform: translateX(0) scale(1) }
        }
        @keyframes slideInLeftCat {
          from { opacity: 0; transform: translateX(-52px) scale(0.97) }
          to   { opacity: 1; transform: translateX(0) scale(1) }
        }
      `}</style>

      {/* ── Masonry grid ─────────────────────────────────────────────────── */}
      <div className="columns-2 md:columns-3" style={{ columnGap: '4px' }}>
        {photos.map((photo, i) => (
          <div
            key={photo._id}
            className="break-inside-avoid group relative overflow-hidden cursor-pointer"
            style={{ marginBottom: '4px' }}
            onClick={() => openPhoto(photo, i)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt={photo.alt}
              loading={i < 6 ? 'eager' : 'lazy'}
              style={{ width: '100%', height: 'auto', display: 'block' }}
              className="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(to top, rgba(1,10,73,0.78) 0%, transparent 65%)' }}
            >
              {photo.alt && (
                <span className="font-secondary text-cream/80 text-sm leading-tight block translate-y-1.5 group-hover:translate-y-0 transition-transform duration-300">
                  {photo.alt}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            animation: closing ? 'fadeOutCatOverlay 0.22s ease both' : 'fadeInCatOverlay 0.22s ease both',
          }}
          onClick={close}
        >
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-10 py-6 pointer-events-none z-10">
            <span className="font-neue text-white/40 text-[10px] tracking-[0.28em] uppercase">
              {String(selectedIndex + 1).padStart(2, '0')} - {String(photos.length).padStart(2, '0')}
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
