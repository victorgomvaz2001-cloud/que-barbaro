import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import Logo from '@/components/Logo'
import BackToTopButton from './BackToTopButton'

const NAV_LINKS = [
  { href: '/',              key: 'inicio' },
  { href: '/el-salon',      key: 'elSalon' },
  { href: '/servicios',     key: 'servicios' },
  { href: '/galeria',       key: 'galeria' },
  { href: '/blog',          key: 'blog' },
  { href: '/contacto',      key: 'contacto' },
  { href: '/reservar-cita', key: 'reservar' },
] as const

const SOCIAL = [
  { name: 'Instagram', href: 'https://www.instagram.com/quebarbaro.es' },
  { name: 'Facebook',  href: 'https://facebook.com/quebarbaro' },
  { name: 'TikTok',    href: 'https://tiktok.com/@quebarbaro' },
  { name: 'YouTube',   href: 'https://youtube.com/@quebarbaro' },
]

export default async function Footer() {
  const tNav  = await getTranslations('nav')
  const tFoot = await getTranslations('footer')
  const year  = new Date().getFullYear()

  return (
    <footer>
      {/* ── Navy container ──────────────────────────────────────────────────── */}
      <div className="bg-cream px-8">
        <div className="bg-cream mx-auto max-w-[1680px] px-8 pt-10 pb-0">

          {/* Top row: Logo · Slogan */}
          <div className="flex flex-col items-center mb-16 md:flex-row md:items-start md:justify-between">
            <Link href="/" className="text-navy transition-opacity hover:opacity-70" aria-label="Que Bárbaro">
              <Logo className="h-24 w-auto" />
            </Link>
            <p className="hidden md:block font-neue text-navy text-right text-[clamp(1.2rem,2.5vw,1.5rem)] leading-tight max-w-xs">
              {tFoot('tagline')}
            </p>
          </div>

          {/* Middle: Nav · Contact · Social */}
          <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-0 md:min-h-[300px]">

            {/* Left: Nav links */}
            <div className="flex flex-col justify-center items-center md:items-start gap-1">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="font-primary text-navy text-[clamp(1.6rem,2.5vw,2.4rem)] leading-tight transition-opacity hover:opacity-60"
                >
                  {tNav(item.key)}
                </Link>
              ))}
            </div>

            {/* Center: Contact + Location */}
            <div className="flex flex-col justify-center items-center text-center gap-8">
              <div>
                <h3 className="font-primary text-navy text-[clamp(1.4rem,2.5vw,1.8rem)] tracking-[0.18em] mb-3">
                  Contacto
                </h3>
                <a
                  href={`mailto:${tFoot('email')}`}
                  className="font-neue block text-navy text-[clamp(1.4rem,2.5vw,1.8rem)] leading-relaxed transition-colors hover:text-navy"
                >
                  {tFoot('email')}
                </a>
                <a
                  href={`tel:${tFoot('phone')}`}
                  className="font-neue block text-navy text-[clamp(1.4rem,2.5vw,1.8rem)] leading-relaxed transition-colors hover:text-navy"
                >
                  {tFoot('phone')}
                </a>
              </div>

              <div>
                <h3 className="font-primary text-navy text-[clamp(1.4rem,2.5vw,1.8rem)] tracking-[0.18em] mb-3">
                  El Salón
                </h3>
                <p className="font-neue text-navy text-[clamp(1.4rem,2.5vw,1.8rem)] leading-relaxed">
                  {tFoot('address')}
                </p>
                <p className="font-neue text-navy text-[clamp(1.4rem,2.5vw,1.8rem)] leading-relaxed">
                  {tFoot('city')}
                </p>
              </div>
            </div>

            {/* Right: Social */}
            <div className="flex flex-col justify-center items-center md:items-end gap-1">
              {SOCIAL.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-neue text-navy text-[clamp(1.6rem,2.5vw,2.4rem)] leading-tight transition-opacity hover:opacity-60"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar: copyright · legal · back to top */}
          <div className="border-t border-navy/15 mt-12 py-5 flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
            <p className="font-neue text-navy/35 text-xs text-center md:text-left">
              © {year} Que Bárbaro. {tFoot('rights')}
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <Link
                href="/aviso-legal"
                className="font-neue text-navy/35 text-xs transition-colors hover:text-navy"
              >
                {tFoot('legalPages.avisoLegal')}
              </Link>
              <Link
                href="/politica-privacidad"
                className="font-neue text-navy/35 text-xs transition-colors hover:text-navy"
              >
                {tFoot('legalPages.privacidad')}
              </Link>
              <Link
                href="/politica-cookies"
                className="font-neue text-navy/35 text-xs transition-colors hover:text-navy"
              >
                {tFoot('legalPages.cookies')}
              </Link>
            </div>

            <BackToTopButton />
          </div>
        </div>
      </div>

      {/* ── Big display name ────────────────────────────────────────────────── */}
      <div className="bg-cream overflow-hidden leading-none select-none pt-10" style={{ maxHeight: 'clamp(5rem, calc(2.5rem + 10.84vw), 14rem)' }}>
        <p className="font-primary text-navy whitespace-nowrap text-[clamp(4rem,17vw,18rem)] leading-[0.85] text-center">
          Qué Bárbaro
        </p>
      </div>
    </footer>
  )
}
