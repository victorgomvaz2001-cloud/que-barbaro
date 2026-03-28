import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

/* ─── Slug helper ────────────────────────────────────────────────────────── */

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default async function GaleriaHero() {
  const t = await getTranslations('galeria')
  const categories = t.raw('hero.categories') as string[]

  return (
    <section
      className="relative w-full py-28 md:py-40 overflow-hidden bg-navy"
      aria-labelledby="galeria-hero-title"
    >
      {/* ── Background image ─────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'url("https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/hero.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
        }}
        aria-hidden
      />

      {/* ── Dark navy gradient overlay ────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(1,10,73,0.6) 0%, rgba(1,10,73,0.45) 50%, rgba(1,10,73,0.72) 100%)',
        }}
        aria-hidden
      />

      {/* ── Grain texture overlay ─────────────────────────────────────────── */}
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

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1680px] mx-auto px-8 md:px-16">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6">
          <span
            className="block shrink-0 w-[6px] h-[6px] rounded-full bg-orange"
            aria-hidden="true"
          />
          <p
            className="font-neue text-cream/40 uppercase tracking-[0.3em]"
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
          className="font-primary text-cream uppercase leading-[0.88] tracking-tight"
          style={{ fontSize: 'clamp(5rem, 14vw, 12rem)' }}
        >
          {t('hero.title')}
        </h1>

        {/* Subtitle */}
        <p
          className="font-secondary italic text-cream/50 mt-3 mb-8 md:mb-12"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 2.5rem)' }}
        >
          {t('hero.subtitle')}
        </p>

        {/* Description */}
        <p
          className="font-secondary italic text-cream/65 leading-relaxed mb-12 md:mb-16"
          style={{
            fontSize: 'clamp(1rem, 1.3vw, 1.1rem)',
            maxWidth: '52ch',
          }}
        >
          {t('hero.description')}
        </p>

        {/* ── Category pills ───────────────────────────────────────────────── */}
        <div
          className="flex flex-row gap-2 pb-1"
          style={{
            overflowX: 'auto',
            scrollbarWidth: 'none',
          }}
          role="navigation"
          aria-label="Filtrar por categoría"
        >
          {/* "Todos" pill */}
          <Link
            href="#galeria-grid"
            className="shrink-0 inline-block font-neue uppercase tracking-[0.18em] border border-cream/20 text-cream/50 px-4 py-1.5 transition-colors duration-200 hover:border-cream hover:text-cream"
            style={{ fontSize: '9px' }}
          >
            {t('hero.allCategories')}
          </Link>

          {/* Category pills */}
          {categories.map((category) => (
            <Link
              key={category}
              href={`#${slugify(category)}`}
              className="shrink-0 inline-block font-neue uppercase tracking-[0.18em] border border-cream/20 text-cream/50 px-4 py-1.5 transition-colors duration-200 hover:border-cream hover:text-cream"
              style={{ fontSize: '9px' }}
            >
              {category}
            </Link>
          ))}
        </div>

      </div>

      {/* ── Bottom fade into cream ────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-20"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #F6F4F1 100%)',
        }}
        aria-hidden
      />
    </section>
  )
}
