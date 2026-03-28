'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { IReview } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function anim(visible: boolean, delay: number, mounted: boolean, from = 'translateY(22px)') {
  if (!mounted) return {}
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0)' : from,
    transition: 'opacity 0.75s ease, transform 0.75s ease',
    transitionDelay: visible ? `${delay}ms` : '0ms',
  }
}

function Stars({ size = 16, gap = 3 }: { size?: number; gap?: number }) {
  return (
    <span className="flex items-center" style={{ gap }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill="#e8632a">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function TestimonialsSection() {
  const tl = useTranslations('testimonials')
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [reviews, setReviews] = useState<IReview[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    fetch(`${API_URL}/reviews`)
      .then((r) => r.json())
      .then((res) => setReviews(res.data ?? []))
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (reviews.length === 0) return
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [reviews.length])

  if (reviews.length === 0) return null

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-cream"
      style={{ paddingTop: '7rem', paddingBottom: '7rem' }}
    >
      {/* Decorative background numeral */}
      <div
        className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 font-primary leading-none"
        aria-hidden
        style={{
          fontSize: 'clamp(14rem, 30vw, 28rem)',
          color: 'rgba(26,31,58,0.04)',
          lineHeight: 1,
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.2s ease',
          transitionDelay: '200ms',
        }}
      >
        5
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-8 md:px-16 lg:px-24">

        {/* ── Header ── */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8">

          {/* Left: H2 + rating */}
          <div>
            <h2
              className="font-primary uppercase text-navy mb-8 leading-none"
              style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', ...anim(visible, 0, mounted) }}
            >
              {tl('h2')}
            </h2>

            <div className="flex items-baseline gap-4" style={anim(visible, 120, mounted)}>
              <div className="flex flex-col">
                <span className="font-neue text-[10px] uppercase tracking-[0.35em] text-navy/30 mb-2">
                  {tl('eyebrow')}
                </span>
                <span
                  className="font-neue font-light leading-none"
                  style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', color: '#1a1f3a', lineHeight: 1 }}
                >
                  5.0
                </span>
              </div>
              <div className="flex flex-col gap-2 pb-2">
                <Stars size={20} gap={4} />
              </div>
            </div>
          </div>

          {/* Right: Google badge */}
          <a
            href="https://share.google/hor7u24FsyXTZVydP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border px-6 py-4 self-start md:self-auto transition-opacity hover:opacity-70"
            style={{ borderColor: 'rgba(26,31,58,0.12)', ...anim(visible, 200, mounted, 'translateY(12px)') }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <div>
              <p className="font-neue font-light text-[11px] uppercase tracking-[0.18em]" style={{ color: '#1a1f3a' }}>
                {tl('reviewCount')}
              </p>
              <p className="font-neue font-light text-[10px] uppercase tracking-[0.14em]" style={{ color: 'rgba(26,31,58,0.4)' }}>
                {tl('verified')}
              </p>
            </div>
          </a>
        </div>

        {/* ── Divider ── */}
        <div
          className="mb-16 h-px"
          style={{
            backgroundColor: 'rgba(26,31,58,0.1)',
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.9s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: '300ms',
          }}
        />

        {/* ── Review cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, ri) => (
            <ReviewCard key={review._id} review={review} index={ri} visible={visible} mounted={mounted} />
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6" style={anim(visible, 900, mounted)}>
          <p className="font-neue font-light text-[13px] tracking-[0.08em]" style={{ color: 'rgba(26,31,58,0.5)' }}>
            {tl('joinUs')}
          </p>
          <a
            href="https://g.page/r/CZB0xjaUuYRfEBM/review"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 font-neue font-light text-[11px] uppercase tracking-[0.28em] transition-all duration-300"
            style={{ color: '#1a1f3a' }}
          >
            <span className="h-px w-8 transition-all duration-300 group-hover:w-14" style={{ backgroundColor: '#e8632a' }} />
            {tl('leaveReview')}
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Review Card ───────────────────────────────────────────────────────── */

function ReviewCard({
  review,
  index,
  visible,
  mounted,
}: {
  review: IReview
  index: number
  visible: boolean
  mounted: boolean
}) {
  return (
    <article
      className="flex flex-col p-7 md:p-8 bg-white"
      style={{
        boxShadow: '0 2px 12px rgba(26,31,58,0.07), 0 1px 3px rgba(26,31,58,0.05)',
        ...(mounted ? {
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(28px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
          transitionDelay: visible ? `${400 + index * 120}ms` : '0ms',
        } : {}),
      }}
    >
      {/* Top row: stars + photo */}
      <div className="flex items-start justify-between mb-5">
        <Stars size={18} gap={3} />
        {review.authorPhotoUrl ? (
          <Image src={review.authorPhotoUrl} alt={review.authorName} width={48} height={48} className="h-12 w-12 rounded-full object-cover shrink-0" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-neue font-light text-base" style={{ backgroundColor: 'rgba(26,31,58,0.07)', color: '#1a1f3a' }}>
            {review.authorName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Quote */}
      <p className="font-neue font-light leading-snug flex-1" style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', color: '#1a1f3a' }}>
        &ldquo;{review.text}&rdquo;
      </p>

      {/* Divider */}
      <div className="my-6 h-px" style={{ backgroundColor: 'rgba(26,31,58,0.08)' }} />

      {/* Author */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-neue text-sm font-medium" style={{ color: '#1a1f3a' }}>{review.authorName}</p>
          <p className="font-neue font-light text-xs mt-0.5" style={{ color: 'rgba(26,31,58,0.45)' }}>{review.relativeTime}</p>
        </div>
        <a href="https://share.google/hor7u24FsyXTZVydP" target="_blank" rel="noopener noreferrer" title="Ver en Google" className="shrink-0 opacity-30 hover:opacity-60 transition-opacity">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </a>
      </div>
    </article>
  )
}
