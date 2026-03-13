import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const NAV_LINKS = [
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

const SOCIAL = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://tiktok.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon fill="#010A49" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
      </svg>
    ),
  },
  {
    name: 'X',
    href: 'https://x.com',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

export default async function Footer() {
  const tNav = await getTranslations('nav')
  const tFooter = await getTranslations('footer')

  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy">
      {/* Main grid */}
      <div className="mx-auto max-w-[1680px] px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

          {/* Col 1 — Logo + info */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="font-primary text-3xl font-bold uppercase leading-none tracking-[0.04em] text-cream"
            >
              Que Bárbaro
            </Link>

            <p className="font-secondary text-xs uppercase tracking-widest text-cream opacity-50">
              {tFooter('tagline')}
            </p>

            <address className="font-secondary not-italic flex flex-col gap-2 text-sm leading-relaxed text-cream opacity-70">
              <span>{tFooter('address')}</span>
              <span>{tFooter('city')}</span>
              <a
                href={`tel:${tFooter('phone')}`}
                className="transition-opacity hover:opacity-100 hover:underline underline-offset-2"
              >
                {tFooter('phone')}
              </a>
              <a
                href={`mailto:${tFooter('email')}`}
                className="text-orange transition-opacity hover:opacity-100 hover:underline underline-offset-2"
              >
                {tFooter('email')}
              </a>
            </address>
          </div>

          {/* Col 2 — Secciones */}
          <div>
            <h3 className="font-secondary mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-cream opacity-40">
              {tFooter('sections')}
            </h3>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-secondary text-sm text-cream opacity-70 transition-opacity hover:opacity-100 hover:underline underline-offset-2"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Redes sociales */}
          <div>
            <h3 className="font-secondary mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-cream opacity-40">
              {tFooter('followUs')}
            </h3>
            <ul className="flex flex-col gap-4">
              {SOCIAL.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-secondary group flex items-center gap-3 text-sm text-cream opacity-70 transition-opacity hover:opacity-100"
                  >
                    <span className="transition-colors group-hover:text-orange">
                      {s.icon}
                    </span>
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Legal */}
          <div>
            <h3 className="font-secondary mb-6 text-[10px] font-bold uppercase tracking-[0.2em] text-cream opacity-40">
              {tFooter('legal')}
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/aviso-legal"
                  className="font-secondary text-sm text-cream opacity-70 transition-opacity hover:opacity-100 hover:underline underline-offset-2"
                >
                  {tFooter('legalPages.avisoLegal')}
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-privacidad"
                  className="font-secondary text-sm text-cream opacity-70 transition-opacity hover:opacity-100 hover:underline underline-offset-2"
                >
                  {tFooter('legalPages.privacidad')}
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-cookies"
                  className="font-secondary text-sm text-cream opacity-70 transition-opacity hover:opacity-100 hover:underline underline-offset-2"
                >
                  {tFooter('legalPages.cookies')}
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-[1680px] border-t border-cream/10 px-8 py-5">
        <p className="font-secondary text-xs uppercase tracking-widest text-cream opacity-40">
          © {year} Que Bárbaro. {tFooter('rights')}
        </p>
      </div>
    </footer>
  )
}
