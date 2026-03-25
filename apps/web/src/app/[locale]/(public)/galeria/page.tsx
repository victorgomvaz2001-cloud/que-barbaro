export const dynamic = 'force-dynamic'

import { getLocale, getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import CategoryGalleryGrid from '@/components/gallery/CategoryGalleryGrid'
import type { IGalleryPhoto, GalleryPageResponse } from '@falcanna/types'

const HERO_IMAGE = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/experience2.webp'

async function fetchAllPhotos(): Promise<IGalleryPhoto[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
    const res = await fetch(`${apiUrl}/gallery?page=1&limit=500`, { cache: 'no-store' })
    if (!res.ok) return []
    const data: GalleryPageResponse = await res.json()
    return data.data
  } catch {
    return []
  }
}

function byCategory(photos: IGalleryPhoto[], categories: string[]): IGalleryPhoto[] {
  return photos.filter((p) => categories.includes(p.category))
}

export default async function GaleriaPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('galeria')])
  const seoRoute = locale === 'es' ? '/galeria' : `/${locale}/galeria`
  const photos = await fetchAllPhotos()

  const cortes      = byCategory(photos, ['Corte', 'Estilismo'])
  const color       = byCategory(photos, ['Color'])
  const trat        = byCategory(photos, ['Tratamientos'])
  const makeup      = byCategory(photos, ['Beauty', 'Barbería'])
  const beforeAfter = byCategory(photos, ['Antes-Después'])
  const espacio     = byCategory(photos, ['Espacio'])

  const comingSoon = t('comingSoon')

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Galería - Que Bárbaro' }} />

      {/* ── Hero con imagen de fondo ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-navy px-8 py-28 md:px-12 md:py-40">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/55 via-navy/70 to-navy/95" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <h1 className="font-primary text-[clamp(2.4rem,5.5vw,5rem)] uppercase leading-[0.95] text-cream mb-6 max-w-3xl">
            {t('title')}
          </h1>
          <p className="max-w-2xl font-neue font-light text-lg md:text-xl leading-relaxed text-white/70 mb-4">
            {t('intro1')}
          </p>
          <p className="max-w-2xl font-neue font-light text-base md:text-lg leading-relaxed text-white/45">
            {t('intro2')}
          </p>
        </div>
      </div>

      {/* ── Resto de secciones ───────────────────────────────────────────── */}
      <div className="w-full px-6 md:px-10 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-20 md:gap-28">

          {/* ── Resultados reales ────────────────────────────────────────── */}
          <section>
            <div className="mb-14 md:mb-16">
              <h2 className="font-primary text-[clamp(1.9rem,4vw,3.4rem)] uppercase leading-[0.95] text-navy mb-3">
                {t('resultsTitle')}
              </h2>
              <p className="max-w-2xl font-neue font-light text-base md:text-lg leading-relaxed text-navy/65">
                {t('resultsText')}
              </p>
            </div>

            <div className="flex flex-col gap-16 md:gap-20">

              {/* Cortes y peinados */}
              <div>
                <h3 className="font-primary text-[clamp(1.4rem,2.4vw,2rem)] uppercase leading-[0.95] text-navy mb-2">
                  {t('cortesTitle')}
                </h3>
                <p className="max-w-xl font-neue font-light text-sm md:text-base leading-relaxed text-navy/55 mb-7">
                  {t('cortesText')}
                </p>
                <CategoryGalleryGrid photos={cortes} comingSoon={comingSoon} />
              </div>

              {/* Coloración y rubios */}
              <div>
                <h3 className="font-primary text-[clamp(1.4rem,2.4vw,2rem)] uppercase leading-[0.95] text-navy mb-2">
                  {t('colorTitle')}
                </h3>
                <p className="max-w-xl font-neue font-light text-sm md:text-base leading-relaxed text-navy/55 mb-7">
                  {t('colorText')}
                </p>
                <CategoryGalleryGrid photos={color} comingSoon={comingSoon} />
              </div>

              {/* Tratamientos y acabados */}
              <div>
                <h3 className="font-primary text-[clamp(1.4rem,2.4vw,2rem)] uppercase leading-[0.95] text-navy mb-2">
                  {t('tratTitle')}
                </h3>
                <p className="max-w-xl font-neue font-light text-sm md:text-base leading-relaxed text-navy/55 mb-7">
                  {t('tratText')}
                </p>
                <CategoryGalleryGrid photos={trat} comingSoon={comingSoon} />
              </div>

              {/* Maquillaje y eventos */}
              <div>
                <h3 className="font-primary text-[clamp(1.4rem,2.4vw,2rem)] uppercase leading-[0.95] text-navy mb-2">
                  {t('makeupTitle')}
                </h3>
                <p className="max-w-xl font-neue font-light text-sm md:text-base leading-relaxed text-navy/55 mb-7">
                  {t('makeupText')}
                </p>
                <CategoryGalleryGrid photos={makeup} comingSoon={comingSoon} />
              </div>

            </div>
          </section>

          {/* ── Antes y después ──────────────────────────────────────────── */}
          <section>
            <h2 className="font-primary text-[clamp(1.9rem,4vw,3.4rem)] uppercase leading-[0.95] text-navy mb-3">
              {t('beforeAfterTitle')}
            </h2>
            <p className="max-w-2xl font-neue font-light text-base md:text-lg leading-relaxed text-navy/65 mb-10">
              {t('beforeAfterText')}
            </p>
            <CategoryGalleryGrid photos={beforeAfter} comingSoon={comingSoon} />
          </section>

          {/* ── El espacio ───────────────────────────────────────────────── */}
          <section>
            <h2 className="font-primary text-[clamp(1.9rem,4vw,3.4rem)] uppercase leading-[0.95] text-navy mb-3">
              {t('espacioTitle')}
            </h2>
            <p className="max-w-2xl font-neue font-light text-base md:text-lg leading-relaxed text-navy/65 mb-10">
              {t('espacioText')}
            </p>
            <CategoryGalleryGrid photos={espacio} comingSoon={comingSoon} />
          </section>

          {/* ── CTA ──────────────────────────────────────────────────────── */}
          <section className="border-t border-navy/10 pt-14">
            <h2 className="font-primary text-[clamp(1.9rem,4vw,3.4rem)] uppercase leading-[0.95] text-navy mb-4 max-w-2xl">
              {t('ctaTitle')}
            </h2>
            <p className="max-w-xl font-neue font-light text-base md:text-lg leading-relaxed text-navy/65 mb-7">
              {t('ctaText')}
            </p>
            <a
              href="/reservar-cita"
              className="inline-flex items-center gap-3 bg-navy text-cream font-neue text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-orange transition-colors duration-300"
            >
              {t('bookCta')}
              <span className="text-base leading-none">→</span>
            </a>
          </section>

        </div>
      </div>
    </>
  )
}
