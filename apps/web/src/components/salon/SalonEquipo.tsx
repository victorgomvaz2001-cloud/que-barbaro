'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

/* ─── Types ─────────────────────────────────────────────────────────────────── */

type Member = { name: string; role: string; bio: string }

/* ─── Animation helper ──────────────────────────────────────────────────────── */

function anim(
  visible: boolean,
  delay: number,
  mounted: boolean,
  from = 'translateY(28px)',
): React.CSSProperties {
  if (!mounted) return {}
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0)' : from,
    transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
    transitionDelay: visible ? `${delay}ms` : '0ms',
  }
}

/* ─── Person silhouette SVG ─────────────────────────────────────────────────── */

function PersonSilhouette({ index }: { index: number }) {
  const gradientId = `person-grad-${index}`
  const hue = index % 2 === 0 ? '0.06' : '0.04'

  return (
    <svg
      viewBox="0 0 280 360"
      aria-hidden
      focusable="false"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(1,10,73)" stopOpacity={hue} />
          <stop offset="100%" stopColor="rgb(1,10,73)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <rect width="280" height="360" fill={`url(#${gradientId})`} />
      <ellipse cx="140" cy="92" rx="44" ry="50" fill="rgb(1,10,73)" fillOpacity="0.10" />
      <rect x="124" y="136" width="32" height="28" rx="6" fill="rgb(1,10,73)" fillOpacity="0.08" />
      <path
        d="M56 200 C56 170, 86 160, 108 160 L140 160 L172 160 C194 160, 224 170, 224 200 L224 310 C224 316, 219 320, 214 320 L66 320 C61 320, 56 316, 56 310 Z"
        fill="rgb(1,10,73)"
        fillOpacity="0.08"
      />
      <path
        d="M124 164 L140 186 L156 164"
        stroke="rgb(1,10,73)"
        strokeOpacity="0.12"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="72" y1="336" x2="208" y2="336" stroke="rgb(1,10,73)" strokeOpacity="0.08" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

/* ─── Team card ─────────────────────────────────────────────────────────────── */

function TeamCard({
  member,
  index,
  visible,
  mounted,
}: {
  member: Member
  index: number
  visible: boolean
  mounted: boolean
}) {
  const delay = 200 + index * 120

  return (
    <article
      style={
        mounted
          ? {
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(36px)',
              transition: 'opacity 0.85s ease, transform 0.85s cubic-bezier(0.16,1,0.3,1)',
              transitionDelay: visible ? `${delay}ms` : '0ms',
            }
          : {}
      }
      className="flex flex-col group"
    >
      {/* Portrait placeholder */}
      <div
        className="relative w-full overflow-hidden mb-6"
        style={{ aspectRatio: '3 / 4' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(1,10,73,0.045) 0%, rgba(246,244,241,0) 60%, rgba(1,10,73,0.025) 100%)',
            backgroundColor: 'rgba(1,10,73,0.04)',
          }}
        />
        <div className="absolute inset-0 flex items-end justify-center">
          <div
            className="w-full transition-transform duration-700 ease-out"
            style={{
              height: '88%',
              transform: visible ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: mounted && visible ? `${delay + 100}ms` : '0ms',
            }}
          >
            <PersonSilhouette index={index} />
          </div>
        </div>
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
          style={{
            background:
              'linear-gradient(120deg, transparent 30%, rgba(254,81,0,0.035) 60%, transparent 80%)',
          }}
          aria-hidden
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(246,244,241,0.6))',
          }}
          aria-hidden
        />
      </div>

      {/* Card text */}
      <div className="flex flex-col flex-1">
        <p
          className="font-neue uppercase tracking-[0.22em] text-orange mb-2"
          style={{ fontSize: '10px' }}
        >
          {member.role}
        </p>
        <h3
          className="font-primary text-navy uppercase leading-[1.05] tracking-[0.08em] mb-3"
          style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.75rem)' }}
        >
          {member.name}
        </h3>
        <div
          className="bg-navy/15 mb-4 shrink-0"
          style={{
            height: '1px',
            width: visible ? '40px' : '0px',
            transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: mounted && visible ? `${delay + 300}ms` : '0ms',
          }}
          aria-hidden
        />
        <p
          className="font-secondary text-navy/60 leading-relaxed"
          style={{ fontSize: 'clamp(0.875rem, 1.1vw, 0.975rem)', maxWidth: '32ch' }}
        >
          {member.bio}
        </p>
      </div>
    </article>
  )
}

/* ─── Main component ────────────────────────────────────────────────────────── */

export default function SalonEquipo() {
  const t = useTranslations('elSalon.equipo')
  const members = t.raw('members') as Member[]

  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)

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

  return (
    <section
      id="equipo"
      ref={sectionRef}
      className="relative w-full bg-cream overflow-hidden py-24 md:py-32"
      aria-label={t('title')}
    >
      {/* ── Decorative background letter ─────────────────────────────────────── */}
      <div
        className="pointer-events-none select-none absolute left-0 top-1/2 -translate-y-1/2 font-primary leading-none"
        aria-hidden
        style={{
          fontSize: 'clamp(16rem, 34vw, 32rem)',
          color: 'rgba(1,10,73,0.028)',
          lineHeight: 1,
          letterSpacing: '-0.06em',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateX(-12%)' : 'translateX(-18%)',
          transition: 'opacity 1.4s ease, transform 1.4s ease',
          transitionDelay: '150ms',
          userSelect: 'none',
        }}
      >
        Q
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-8 md:px-16 lg:px-24">

        {/* ── Section header ───────────────────────────────────────────────── */}
        <div className="mb-16 md:mb-20 max-w-xl">

          <p
            className="font-neue uppercase tracking-[0.32em] text-orange mb-5"
            style={{ fontSize: '11px', ...anim(visible, 0, mounted, 'translateY(10px)') }}
          >
            {t('eyebrow')}
          </p>

          <h2
            className="font-primary text-navy uppercase leading-[0.9] mb-8"
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 5.5rem)',
              ...anim(visible, 100, mounted, 'translateY(24px)'),
            }}
          >
            {t('title')}
          </h2>

          <div
            className="bg-navy/20 mb-8"
            style={{
              height: '1px',
              width: visible ? '56px' : '0px',
              transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
              transitionDelay: visible ? '250ms' : '0ms',
            }}
            aria-hidden
          />

          <p
            className="font-secondarytext-navy/55 leading-relaxed"
            style={{
              fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
              maxWidth: '52ch',
              ...anim(visible, 320, mounted),
            }}
          >
            {t('intro')}
          </p>
        </div>

        {/* ── Team grid ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
          {members.map((member, i) => (
            <TeamCard
              key={member.name}
              member={member}
              index={i}
              visible={visible}
              mounted={mounted}
            />
          ))}
        </div>

        {/* ── Bottom rule ──────────────────────────────────────────────────── */}
        <div
          className="mt-20 h-px"
          style={{
            backgroundColor: 'rgba(1,10,73,0.08)',
            transform: visible ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 1s cubic-bezier(0.16,1,0.3,1)',
            transitionDelay: visible ? '900ms' : '0ms',
          }}
          aria-hidden
        />

      </div>
    </section>
  )
}
