import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function SalonCtaReserva() {
  const t = await getTranslations('elSalon.cta')

  return (
    <section
      className="relative w-full bg-navy overflow-hidden py-32"
      aria-label={t('title')}
    >
      {/* ── Background image ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/inicio/madonnagoldfinch.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
        }}
        aria-hidden
      />

      {/* ── Black overlay ────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.25)' }}
        aria-hidden
      />

      {/* ── Subtle grain texture overlay ─────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          opacity: 0.5,
          mixBlendMode: 'overlay',
        }}
        aria-hidden
      />

      {/* ── Ghost watermark ────────────────────────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute right-0 bottom-0 font-primary leading-none text-cream uppercase"
        style={{
          fontSize: 'clamp(8rem, 24vw, 22rem)',
          opacity: 0.028,
          transform: 'translateX(6%) translateY(20%)',
          lineHeight: 0.82,
          zIndex: 0,
        }}
      >
        {t('watermark')}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-10 lg:px-16 flex flex-col items-center text-center">

        {/* Orange accent line */}
        <div
          className="bg-orange mb-10"
          style={{ width: '48px', height: '2px' }}
          aria-hidden
        />

        {/* Main title */}
        <h2
          className="font-primary uppercase text-cream leading-[0.88] tracking-tight mb-8"
          style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
        >
          {t('title')}
        </h2>

        {/* Subtitle */}
        <p
          className="font-secondary italic text-cream leading-relaxed mb-14"
          style={{
            fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
            opacity: 0.55,
            maxWidth: '50ch',
          }}
        >
          {t('subtitle')}
        </p>

        {/* CTA Button */}
        <Link
          href="https://wa.me/34644817835"
          className={[
            'group relative inline-flex items-center gap-3',
            'bg-cream text-navy',
            'font-neue uppercase tracking-widest',
            'text-[11px] px-12 py-4',
            'transition-colors duration-300 ease-out',
            'hover:bg-orange hover:text-cream',
          ].join(' ')}
          style={{ letterSpacing: '0.22em' }}
        >
          {t('button')}

          {/* Arrow accent */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M2 8h12M8 2l6 6-6 6" />
          </svg>
        </Link>

        {/* Bottom label - location whisper */}
        <p
          className="mt-10 font-neue uppercase tracking-[0.3em] text-cream text-[9px]"
          style={{ opacity: 0.3 }}
        >
          {t('location')}
        </p>

      </div>
    </section>
  )
}
