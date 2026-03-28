import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export default async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="w-full bg-cream overflow-hidden">

      {/* ── Header block: eyebrow + H1 ─────────────────────────────────── */}
      <div className="max-w-[1680px] mx-auto px-6 md:px-12 pt-16 md:pt-20 pb-10 md:pb-14">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <span className="block shrink-0 w-2 h-2 rounded-full bg-orange" aria-hidden="true" />
          <p
            className="font-neue text-navy/50 uppercase tracking-[0.22em]"
            style={{ fontSize: 'clamp(0.65rem, 1vw, 0.8rem)' }}
          >
            {t('eyebrow')}
          </p>
        </div>

        {/* H1 */}
        <h1
          className="font-primary text-navy uppercase leading-[0.88] tracking-tight"
          style={{ fontSize: 'clamp(3rem, 15vw, 14rem)' }}
        >
          Qué&nbsp;Bárbaro
        </h1>
      </div>

      {/* ── Thin orange rule ───────────────────────────────────────────── */}
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        <div className="w-full h-px bg-orange/30" />
      </div>

      {/* ── Hero image: full-width, tall ──────────────────────────────── */}
      <div
        className="relative w-full"
        style={{ aspectRatio: '16 / 9', minHeight: '320px', maxHeight: '780px' }}
      >
        <Image
          src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/gallery/1774688213868-salon3.webp"
          alt="Interior del salón Qué Bárbaro en Torremolinos"
          fill
          sizes="100vw"
          quality={90}
          priority
          className="object-cover object-center"
        />
      </div>

      {/* ── Thin navy rule ─────────────────────────────────────────────── */}
      <div className="max-w-[1680px] mx-auto px-6 md:px-12">
        <div className="w-full h-px bg-navy/10" />
      </div>

      {/* ── Body + CTA ─────────────────────────────────────────────────── */}
      <div className="max-w-[1680px] mx-auto px-6 md:px-12 py-14 md:py-20 flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-20">

        <p
          className="font-secondary text-navy/65 leading-relaxed max-w-xl"
          style={{ fontSize: 'clamp(0.95rem, 1.4vw, 1.1rem)' }}
        >
          {t('body')}
        </p>

        <div className="shrink-0">
          <Link
            href="/reservar-cita"
            className="inline-flex items-center gap-4 bg-orange text-cream font-neue uppercase tracking-[0.18em] px-10 py-5 md:px-14 md:py-6 transition-colors duration-200 hover:bg-navy"
            style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1rem)' }}
          >
            {t('cta')}
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
              <path d="M1 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

      </div>

    </section>
  )
}
