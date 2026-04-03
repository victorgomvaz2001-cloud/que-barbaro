import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

interface GaleriaHeroProps {
  backgroundImage?: string | null
}

export default async function GaleriaHero({ backgroundImage }: GaleriaHeroProps) {
  const t = await getTranslations('galeria')

  return (
    <section
      className="relative w-full py-28 md:py-40 overflow-hidden bg-navy"
      aria-labelledby="galeria-hero-title"
    >
      {backgroundImage && (
        <>
          {/* ── Background image ─────────────────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("${backgroundImage}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.8,
            }}
            aria-hidden
          />

          {/* ── Dark gradient overlay ──────────────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.20) 100%)',
            }}
            aria-hidden
          />

          {/* ── Grain texture overlay ─────────────────────────────────────── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.75\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.035\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'repeat',
              opacity: 0.6,
              mixBlendMode: 'overlay',
            }}
            aria-hidden
          />
        </>
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-8 md:px-16">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="block shrink-0 w-[6px] h-[6px] rounded-full bg-orange"
            aria-hidden="true"
          />
          <p
            className="font-neue text-cream uppercase tracking-[0.3em]"
            style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.75rem)' }}
          >
            {t('hero.eyebrow')}
          </p>
        </div>

        {/* Orange accent line */}
        <div
          className="bg-orange mb-8"
          style={{ height: '2px', width: '64px' }}
          aria-hidden="true"
        />

        {/* Title */}
        <h1
          id="galeria-hero-title"
          className="font-primary text-cream uppercase leading-[0.88] tracking-[0.04em]"
          style={{ fontSize: 'clamp(5rem, 14vw, 12rem)' }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p
          className="font-secondary text-cream mt-3 mb-8 md:mb-12"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 2.5rem)' }}
        >
          {t('hero.subtitle')}
        </p>

        {/* Description */}
        <p
          className="font-secondary text-cream leading-relaxed mb-12 md:mb-16"
          style={{
            fontSize: 'clamp(1rem, 1.3vw, 1.1rem)',
            maxWidth: '52ch',
          }}
        >
          {t('hero.description')}
        </p>

      </div>

    </section>
  )
}
