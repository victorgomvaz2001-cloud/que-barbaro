'use client'

import { useState } from 'react'
import { usePathname, Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import LanguageSelector from './LanguageSelector'
import Logo from '@/components/Logo'

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
      <header className="sticky top-0 z-50 bg-cream">
        <div className="mx-auto flex items-center justify-between max-w-[1680px] px-6 py-3 md:grid md:grid-cols-3">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" aria-label="Que Bárbaro" className="text-navy transition-opacity hover:opacity-70">
              <Logo className="h-14 w-auto" />
            </Link>
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
            <div className="hidden md:flex items-center gap-6">
              <LanguageSelector />
              <Link
                href="/reservar-cita"
                className="bg-navy text-cream font-secondary text-[12px] uppercase tracking-[0.12em] px-4 py-2 transition-opacity duration-150 hover:opacity-80"
              >
                {t('reservar')}
              </Link>
            </div>

            {/* Hamburger - visible only on mobile */}
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
          <div className="relative flex flex-col items-center px-6 pt-8 pb-4 gap-4">
            {/* Close button - top right */}
            <button
              onClick={() => closeMenu()}
              aria-label="Cerrar menú"
              className="absolute top-8 right-6 text-navy opacity-75 hover:opacity-100 transition-opacity"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Logo centrado */}
            <Link href="/" onClick={() => closeMenu()} aria-label="Que Bárbaro" className="text-navy transition-opacity hover:opacity-70">
              <Logo className="h-20 w-auto" />
            </Link>

            {/* Reservar */}
            <Link
              href="/reservar-cita"
              onClick={() => closeMenu()}
              className="bg-navy text-cream font-secondary text-[12px] uppercase tracking-[0.12em] px-6 py-3 transition-opacity duration-150 hover:opacity-80"
            >
              {t('reservar')}
            </Link>
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
