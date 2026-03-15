'use client'

import { useState } from 'react'
import { usePathname, Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import LanguageSelector from './LanguageSelector'

const NAV_ITEMS = [
  { href: '/',          key: 'inicio' },
  { href: '/el-salon',  key: 'elSalon' },
  { href: '/servicios', key: 'servicios' },
  { href: '/galeria',   key: 'galeria' },
  { href: '/blog',      key: 'blog' },
  { href: '/contacto',  key: 'contacto' },
] as const

export default function Navbar() {
  const pathname = usePathname()
  const t = useTranslations('nav')
  const [open, setOpen]       = useState(false)
  const [closing, setClosing] = useState(false)

  const closeMenu = () => {
    setClosing(true)
    setTimeout(() => { setOpen(false); setClosing(false) }, 300)
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <>
      <header className="relative z-50 bg-cream">
        <div className="mx-auto grid max-w-[1680px] grid-cols-3 items-center px-6 py-6">
          {/* Left: Instagram */}
          <div className="flex items-center">
            <a
              href="https://www.instagram.com/quebarbaro.es"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-navy opacity-75 transition-opacity duration-200 hover:opacity-100"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>

          {/* Center: Nav links (desktop only) */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center justify-center gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'font-secondary whitespace-nowrap px-3 py-1 text-[13px] uppercase tracking-[0.12em]',
                    'transition-all duration-150',
                    active
                      ? 'text-navy underline underline-offset-4 decoration-1'
                      : 'text-navy/60 hover:text-navy',
                  ].join(' ')}
                >
                  {t(item.key)}
                </Link>
              )
            })}
          </nav>

          {/* Right: Reservar + Lang (desktop) · Hamburger (mobile) */}
          <div className="flex items-center justify-end gap-3">
            <div className="hidden md:flex items-center gap-3">
              <LanguageSelector />
              <Link
                href="/reservar-cita"
                className="bg-navy text-cream font-secondary text-[12px] uppercase tracking-[0.12em] px-4 py-2 transition-opacity duration-150 hover:opacity-80"
              >
                {t('reservar')}
              </Link>
            </div>

            {/* Hamburger — visible only on mobile */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
              className="md:hidden text-navy opacity-75 hover:opacity-100 transition-opacity"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <line x1="3" y1="6"  x2="21" y2="6"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu overlay ───────────────────────────────────────── */}
      {open && (
        <div className={`${closing ? 'animate-slide-out-right' : 'animate-slide-in-right'} fixed inset-0 z-[100] bg-cream flex flex-col`}>
          {/* Top bar */}
          <div className="flex flex-col px-6 pt-8 pb-4 gap-4">
            <div className="flex items-center justify-between">
              <Link
                href="/reservar-cita"
                onClick={() => closeMenu()}
                className="bg-navy text-cream font-secondary text-[12px] uppercase tracking-[0.12em] px-4 py-3 transition-opacity duration-150 hover:opacity-80"
              >
                {t('reservar')}
              </Link>

              <button
                onClick={() => closeMenu()}
                aria-label="Cerrar menú"
                className="text-navy opacity-75 hover:opacity-100 transition-opacity"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col items-center justify-center flex-1 gap-2">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => closeMenu()}
                  className={[
                    'font-primary text-[clamp(2rem,8vw,3rem)] leading-tight uppercase tracking-wide',
                    'transition-opacity duration-150',
                    active ? 'text-navy' : 'text-navy/50 hover:text-navy',
                  ].join(' ')}
                >
                  {t(item.key)}
                </Link>
              )
            })}
          </nav>

          {/* Bottom: lang */}
          <div className="flex justify-center pb-10">
            <LanguageSelector />
          </div>
        </div>
      )}
    </>
  )
}
