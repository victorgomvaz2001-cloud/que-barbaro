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
    <header className="relative z-50 bg-cream">
      <nav className="mx-auto flex max-w-[1680px] items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-primary text-2xl font-bold uppercase tracking-wide text-navy select-none"
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
                className={[
                  'font-secondary rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em]',
                  'transition-colors duration-150 whitespace-nowrap',
                  active
                    ? 'bg-navy text-cream'
                    : 'text-navy hover:bg-navy/8',
                ].join(' ')}
              >
                {t(item.key)}
              </Link>
            )
          })}

          {/* Divider */}
          <span className="mx-3 h-4 w-px bg-navy opacity-30" aria-hidden />

          <LanguageSelector />
        </div>
      </nav>

      {/* Bottom border */}
      <div className="h-px w-full bg-navy opacity-20" />
    </header>
  )
}
