'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { IMention } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

function usePerView() {
  const [perView, setPerView] = useState(2)
  useEffect(() => {
    function update() {
      const w = window.innerWidth
      if (w >= 1280) setPerView(5)
      else if (w >= 1024) setPerView(4)
      else if (w >= 640)  setPerView(3)
      else                setPerView(2)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return perView
}

export default function MentionsSection() {
  const t = useTranslations('mentionsSection')
  const [mentions, setMentions] = useState<IMention[]>([])
  const [loaded, setLoaded] = useState(false)
  const [current, setCurrent] = useState(0)
  const perView = usePerView()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/mentions`)
      .then((r) => r.json())
      .then((res) => { setMentions(res.data ?? []); setLoaded(true) })
      .catch(() => setLoaded(true))
  }, [])

  const maxIndex = Math.max(0, mentions.length - perView)

  const next = useCallback(() => {
    setCurrent((c) => (c >= maxIndex ? 0 : c + 1))
  }, [maxIndex])

  const prev = useCallback(() => {
    setCurrent((c) => (c <= 0 ? maxIndex : c - 1))
  }, [maxIndex])

  // Reset index when perView changes
  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, mentions.length - perView)))
  }, [perView, mentions.length])

  // Auto-advance
  useEffect(() => {
    if (mentions.length <= perView) return
    timerRef.current = setInterval(next, 4000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [next, mentions.length, perView])

  function resetTimer() {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 4000)
  }

  if (!loaded || mentions.length === 0) return null

  const translateX = -(current * (100 / perView))
  const itemWidth = `${100 / perView}%`
  const showArrows = mentions.length > perView

  return (
    <section className="bg-cream w-full py-16 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="font-secondary text-[9px] uppercase tracking-[0.28em] text-navy/35 mb-2">
              {t('eyebrow')}
            </p>
            <h2 className="font-neue font-medium text-navy text-2xl md:text-3xl leading-tight">
              {t('title')}
            </h2>
          </div>

          {showArrows && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => { prev(); resetTimer() }}
                aria-label={t('prev')}
                className="flex h-9 w-9 items-center justify-center border border-navy/20 text-navy/60 hover:border-navy hover:text-navy transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={() => { next(); resetTimer() }}
                aria-label={t('next')}
                className="flex h-9 w-9 items-center justify-center border border-navy/20 text-navy/60 hover:border-navy hover:text-navy transition-colors duration-200"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Carousel */}
        <div className="overflow-hidden">
          <div
            className="flex"
            style={{
              transform: `translateX(${translateX}%)`,
              transition: 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {mentions.map((mention) => (
              <div
                key={mention._id}
                className="shrink-0 px-2"
                style={{ width: itemWidth }}
              >
                <a
                  href={mention.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={mention.name}
                  className="group block aspect-square border border-navy/10 bg-white hover:border-navy/30 transition-colors duration-300"
                >
                  <div className="relative h-full w-full p-6">
                    <Image
                      src={mention.logoUrl}
                      alt={mention.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-contain p-6 grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {showArrows && (
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); resetTimer() }}
                aria-label={`${t('goTo')} ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-navy' : 'w-1.5 bg-navy/25 hover:bg-navy/50'
                }`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
