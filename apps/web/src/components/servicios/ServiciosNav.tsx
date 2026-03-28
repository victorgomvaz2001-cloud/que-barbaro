'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const SECTION_IDS = [
  'corte-peinado',
  'color-rubios',
  'tratamientos',
  'maquillaje-belleza',
  'manicura-belleza',
  'eventos',
] as const

type SectionId = (typeof SECTION_IDS)[number]

const NAV_KEYS: Record<SectionId, string> = {
  'corte-peinado':      'cortes',
  'color-rubios':       'color',
  'tratamientos':       'tratamientos',
  'maquillaje-belleza': 'maquillaje',
  'manicura-belleza':   'manicura',
  'eventos':            'eventos',
}

export default function ServiciosNav() {
  const t = useTranslations('servicios.nav')
  const [activeId, setActiveId] = useState<SectionId | null>(null)
  const mobileRef = useRef<HTMLDivElement>(null)
  const activeElRef = useRef<HTMLAnchorElement | null>(null)

  // Observe each section and update active ID
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry?.isIntersecting) {
            setActiveId(id)
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // Scroll active mobile item into view
  useEffect(() => {
    if (activeElRef.current) {
      activeElRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [activeId])

  return (
    <>
      <style>{`
        .sn-label {
          opacity: 0;
          transform: translateX(4px);
          transition: opacity 0.25s ease, transform 0.25s ease, color 0.25s ease;
        }
        .sn-link[data-active="true"] .sn-label {
          opacity: 1;
          transform: translateX(0);
          color: rgb(1 10 73);
        }
        .sn-link:hover .sn-label {
          opacity: 1;
          transform: translateX(0);
          color: rgba(1,10,73,0.55);
        }
        .sn-dot {
          transition: width 0.25s ease, height 0.25s ease, background-color 0.25s ease;
        }
      `}</style>

      {/* ── Desktop: fixed right sidebar ─────────────────────────────────── */}
      <nav
        aria-label="Navegación de servicios"
        className="hidden md:flex flex-col gap-4 fixed right-6 top-1/2 -translate-y-1/2 z-40"
      >
        {SECTION_IDS.map((id) => {
          const isActive = activeId === id
          const key = NAV_KEYS[id]

          return (
            <Link
              key={id}
              href={`/servicios#${id}`}
              className="sn-link flex items-center gap-2 justify-end"
              data-active={isActive ? 'true' : 'false'}
              aria-current={isActive ? 'location' : undefined}
            >
              <span
                className="sn-label font-neue uppercase tracking-[0.2em]"
                style={{ fontSize: '10px' }}
              >
                {t(key)}
              </span>

              <span
                className="sn-dot block shrink-0 rounded-full"
                style={{
                  width:           isActive ? '8px' : '5px',
                  height:          isActive ? '8px' : '5px',
                  backgroundColor: isActive ? '#fe5100' : 'rgba(1,10,73,0.2)',
                }}
                aria-hidden="true"
              />
            </Link>
          )
        })}
      </nav>

      {/* ── Mobile: sticky horizontal bar ────────────────────────────────── */}
      <nav
        ref={mobileRef as React.RefObject<HTMLElement>}
        aria-label="Navegación de servicios"
        className="md:hidden sticky top-[60px] z-40 bg-cream/95 backdrop-blur-sm border-b border-navy/8 flex gap-6 overflow-x-auto px-6 py-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
      >
        {SECTION_IDS.map((id) => {
          const isActive = activeId === id
          const key = NAV_KEYS[id]

          return (
            <Link
              key={id}
              href={`/servicios#${id}`}
              ref={isActive ? (activeElRef as React.RefObject<HTMLAnchorElement>) : undefined}
              className="shrink-0 pb-2 transition-colors duration-200"
              style={{
                borderBottom: isActive ? '2px solid #fe5100' : '2px solid transparent',
              }}
              aria-current={isActive ? 'location' : undefined}
            >
              <span
                className="font-neue uppercase tracking-[0.18em] whitespace-nowrap"
                style={{
                  fontSize: '10px',
                  color:    isActive ? 'rgb(1 10 73)' : 'rgba(1,10,73,0.4)',
                }}
              >
                {t(key)}
              </span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
