'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

interface ServiciosHeroProps {
  backgroundImage?: string | null
}

export default function ServiciosHero({ backgroundImage }: ServiciosHeroProps) {
  const t = useTranslations('servicios.hero')

  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroRuleExpand {
          from {
            transform: scaleX(0);
            transform-origin: left;
          }
          to {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        .hero-item-0 { animation-delay: 0ms; }
        .hero-item-1 { animation-delay: 120ms; }
        .hero-item-2 { animation-delay: 260ms; }
        .hero-item-3 { animation-delay: 340ms; }
        .hero-rule   { animation-delay: 420ms; }

        .servicios-hero-visible .hero-animate {
          animation: heroFadeUp 0.72s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .servicios-hero-visible .hero-rule-animate {
          animation: heroRuleExpand 0.64s cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: 420ms;
        }
      `}</style>

      <section
        ref={sectionRef}
        className={`relative w-full overflow-hidden bg-cream pt-20 md:pt-28 pb-16 md:pb-20${visible ? ' servicios-hero-visible' : ''}`}
        aria-labelledby="servicios-hero-title"
      >
        {backgroundImage && (
          <>
            <div
              className="absolute inset-0 pointer-events-none bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
              aria-hidden
            />
            <div className="absolute inset-0 pointer-events-none bg-black/50" aria-hidden />
          </>
        )}
        <div className="relative z-10 max-w-[1680px] mx-auto px-8 md:px-16 lg:px-24">

          {/* Eyebrow */}
          <div className={`flex items-center gap-3 mb-6 md:mb-8 hero-animate hero-item-0`}>
            <span
              className="block shrink-0 w-[6px] h-[6px] rounded-full bg-orange"
              aria-hidden="true"
            />
            <p
              className="font-neue text-orange uppercase tracking-widest"
              style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)' }}
            >
              {t('eyebrow')}
            </p>
          </div>

          {/* Main title block */}
          <div className={`hero-animate hero-item-1`}>
            <h1
              id="servicios-hero-title"
              className={`font-primary uppercase leading-[0.88] tracking-tight ${backgroundImage ? 'text-cream' : 'text-navy'}`}
              style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
            >
              {t('title')}
            </h1>
          </div>

          {/* Orange rule */}
          <div className="mt-6 md:mt-8 mb-8 md:mb-10 overflow-hidden">
            <div
              className={`h-px w-16 bg-orange hero-rule-animate`}
              aria-hidden="true"
            />
          </div>

          {/* Body + location suffix */}
          <div className={`hero-animate hero-item-3 flex flex-col gap-3 md:flex-row md:items-end md:gap-12`}>
            <p
              className={`font-secondaryleading-relaxed ${backgroundImage ? 'text-cream' : 'text-navy'}`}
              style={{
                fontSize: 'clamp(0.95rem, 1.3vw, 1.1rem)',
                maxWidth: '55ch',
              }}
            >
              {t('body')}
            </p>

            <span
              className={`shrink-0 font-neue uppercase tracking-[0.18em] pb-[2px] ${backgroundImage ? 'text-cream' : 'text-navy'}`}
              style={{ fontSize: 'clamp(0.6rem, 0.8vw, 0.7rem)' }}
              aria-hidden="true"
            >
              - {t('location')}
            </span>
          </div>

        </div>
      </section>
    </>
  )
}
