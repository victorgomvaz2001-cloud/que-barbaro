'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

/* ─── Hook - single IntersectionObserver ───────────────────────────────────── */

function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

/* ─── Tiny anim helper ──────────────────────────────────────────────────────── */

function fadeUp(
  visible: boolean,
  delayMs: number,
  from = 'translateY(22px)'
): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate(0,0)' : from,
    transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
    transitionDelay: visible ? `${delayMs}ms` : '0ms',
  }
}

const BG_IMAGE =
  'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1920&q=80'

/* ─── Component ─────────────────────────────────────────────────────────────── */

interface SalonExperienciaProps {
  backgroundImage?: string | null
}

export default function SalonExperiencia({ backgroundImage }: SalonExperienciaProps) {
  const t = useTranslations('elSalon.experiencia')
  const pillars = t.raw('pillars') as { n: string; title: string; desc: string }[]
  const { ref: sectionRef, visible } = useReveal<HTMLElement>(0.15)

  return (
    <>
      {/* ── Keyframes ───────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes qb-expand-x {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes qb-fade-grain {
          0%, 100% { opacity: 0.045; }
          50%       { opacity: 0.07; }
        }
        .qb-orange-line {
          transform-origin: left center;
          animation: none;
        }
        .qb-orange-line.visible {
          animation: qb-expand-x 0.65s cubic-bezier(0.16,1,0.3,1) both;
        }
        .qb-grain {
          animation: qb-fade-grain 6s ease-in-out infinite;
        }
        /* Mobile: reset asymmetric padding and side borders */
        @media (max-width: 767px) {
          .qb-pillar {
            padding-left: 0 !important;
            padding-right: 0 !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(246,244,241,0.08);
          }
          .qb-pillar:last-child {
            border-bottom: none;
          }
        }
      `}</style>

      {/* ── Section ─────────────────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden py-24 md:py-32"
        aria-label={t('titleLine1')}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage ?? BG_IMAGE})` }}
          aria-hidden
        />

        {/* Heavy navy overlay ~75% */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(1,10,73,0.92) 0%, rgba(1,10,73,0.78) 55%, rgba(1,10,73,0.88) 100%)',
          }}
          aria-hidden
        />

        {/* Grain texture */}
        <div
          className="qb-grain absolute inset-0 pointer-events-none select-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            mixBlendMode: 'overlay',
          }}
          aria-hidden
        />

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">

          {/* Eyebrow label */}
          <p
            className="font-neue uppercase tracking-[0.32em] text-cream/40 mb-10"
            style={{ fontSize: '10px', ...fadeUp(visible, 0) }}
          >
            - {t('eyebrow')}
          </p>

          {/* Display title */}
          <div className="mb-4 overflow-hidden">
            <h2
              className="font-primary text-cream uppercase leading-[0.9] tracking-tight"
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                ...fadeUp(visible, 120),
              }}
            >
              {t('titleLine1')}
            </h2>
          </div>
          <div className="overflow-hidden mb-14">
            <h2
              className="font-primary uppercase leading-[0.9] tracking-tight"
              style={{
                fontSize: 'clamp(3rem, 7.5vw, 6.5rem)',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(246,244,241,0.35)',
                ...fadeUp(visible, 230),
              }}
            >
              {t('titleLine2')}
            </h2>
          </div>

          {/* Divider line */}
          <div
            className="mb-12"
            style={{
              height: '1px',
              width: '100%',
              background: 'rgba(246,244,241,0.08)',
            }}
            aria-hidden
          />

          {/* Body paragraph */}
          <p
            className="font-secondary text-cream/70 leading-relaxed max-w-2xl mb-8"
            style={{
              fontSize: 'clamp(1rem, 1.35vw, 1.15rem)',
              ...fadeUp(visible, 340),
            }}
          >
            {t('body')}
          </p>

          {/* Quote paragraph */}
          <div
            className="mb-16"
            style={fadeUp(visible, 460)}
          >
            <p
              className="font-secondary italic text-cream text-center mx-auto"
              style={{
                fontSize: 'clamp(1.25rem, 2.2vw, 1.75rem)',
                lineHeight: 1.45,
                maxWidth: '38ch',
                letterSpacing: '-0.01em',
              }}
            >
              {t('quote1')}{' '}
              <span style={{ color: 'rgba(246,244,241,0.55)' }}>
                {t('quote2')}
              </span>
            </p>
          </div>

          {/* ── Three pillars ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
            {pillars.map((pillar, i) => (
              <PillarCard
                key={pillar.n}
                pillar={pillar}
                index={i}
                visible={visible}
                isLast={i === pillars.length - 1}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

/* ─── Pillar Card ───────────────────────────────────────────────────────────── */

type Pillar = { title: string; desc: string; n: string }

function PillarCard({
  pillar,
  index,
  visible,
  isLast,
}: {
  pillar: Pillar
  index: number
  visible: boolean
  isLast: boolean
}) {
  const delay = 580 + index * 140

  return (
    <div
      className="qb-pillar relative flex flex-col pt-7 pb-10"
      style={{
        borderRight: !isLast ? '1px solid rgba(246,244,241,0.08)' : 'none',
        paddingLeft: index === 0 ? 0 : '2.5rem',
        paddingRight: !isLast ? '2.5rem' : 0,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)',
        transitionDelay: visible ? `${delay}ms` : '0ms',
      }}
    >
      {/* Orange top bar */}
      <div
        className={`qb-orange-line${visible ? ' visible' : ''} mb-6 h-[2px] w-10`}
        style={{
          backgroundColor: '#fe5100',
          animationDelay: visible ? `${delay + 100}ms` : '0ms',
          animationDuration: '0.6s',
        }}
        aria-hidden
      />

      {/* Number */}
      <span
        className="font-neue text-cream/20 tabular-nums mb-4"
        style={{ fontSize: '11px', letterSpacing: '0.18em' }}
      >
        {pillar.n}
      </span>

      {/* Pillar title */}
      <h3
        className="font-neue uppercase text-cream tracking-[0.14em] mb-3"
        style={{ fontSize: '13px', fontWeight: 500 }}
      >
        {pillar.title}
      </h3>

      {/* Description */}
      <p
        className="font-secondary text-cream/55 leading-relaxed"
        style={{ fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', maxWidth: '28ch' }}
      >
        {pillar.desc}
      </p>
    </div>
  )
}
