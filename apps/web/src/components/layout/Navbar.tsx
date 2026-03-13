'use client'

import { usePathname, Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import LanguageSelector from './LanguageSelector'

const NAV_ITEMS = [
  { href: '/',               key: 'inicio' },
  { href: '/sobre-nosotros', key: 'sobreNosotros' },
  { href: '/servicios',      key: 'servicios' },
  { href: '/tratamientos',   key: 'tratamientos' },
  { href: '/marcas',         key: 'marcas' },
  { href: '/galeria',        key: 'galeria' },
  { href: '/equipo',         key: 'equipo' },
  { href: '/reservar-cita',  key: 'reservarCita' },
  { href: '/blog',           key: 'blog' },
  { href: '/contacto',       key: 'contacto' },
] as const

export default function Navbar() {
  const pathname = usePathname()
  const t = useTranslations('nav')

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      style={{ backgroundColor: 'var(--color-cream)' }}
      className="relative z-50"
    >
      <nav className="mx-auto flex max-w-[1680px] items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-primary)',
            color: 'var(--color-navy)',
            letterSpacing: '0.04em',
          }}
          className="text-2xl font-bold uppercase tracking-wide select-none"
        >
          Que Bárbaro
        </Link>

        {/* Nav links + lang switcher */}
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  fontFamily: 'var(--font-secondary)',
                  letterSpacing: '0.08em',
                  ...(active
                    ? {
                        backgroundColor: 'var(--color-navy)',
                        color: 'var(--color-cream)',
                      }
                    : {
                        color: 'var(--color-navy)',
                      }),
                }}
                className={`
                  rounded-full px-3 py-1.5 text-[11px] font-bold uppercase
                  transition-colors duration-150 whitespace-nowrap
                  ${active ? '' : 'hover:bg-[#010A49]/8'}
                `}
              >
                {t(item.key)}
              </Link>
            )
          })}

          {/* Divider */}
          <span
            className="mx-3 h-4 w-px opacity-30"
            style={{ backgroundColor: 'var(--color-navy)' }}
            aria-hidden
          />

          <LanguageSelector />
        </div>
      </nav>

      {/* Bottom border */}
      <div
        className="h-px w-full opacity-20"
        style={{ backgroundColor: 'var(--color-navy)' }}
      />
    </header>
  )
}
