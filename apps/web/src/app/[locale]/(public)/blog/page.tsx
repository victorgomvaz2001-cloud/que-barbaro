import { getLocale, getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import AllPostsSection from '@/components/blog/AllPostsSection'
import { getSectionBackgrounds } from '@/lib/getSectionBackgrounds'

const CATEGORIES = [
  'Cuidado capilar',
  'Coloración',
  'Rizos y método curly',
  'Tendencias',
  'Eventos y ocasiones especiales',
  'Noticias de ¡Qué Bárbaro!',
]

export default async function BlogPage() {
  const [locale, t, bg] = await Promise.all([
    getLocale(),
    getTranslations('blog'),
    getSectionBackgrounds('blog'),
  ])
  const heroImage = bg['hero'] ?? null
  const seoRoute = locale === 'es' ? '/blog' : `/${locale}/blog`

  const allPostsLabels = {
    title: t('allPostsTitle'),
    allCategories: t('allCategories'),
    searchPlaceholder: t('searchPlaceholder'),
    filterDate: t('filterDate'),
    sortLabel: t('sortLabel'),
    sortDateDesc: t('sortDateDesc'),
    sortDateAsc: t('sortDateAsc'),
    sortAlphaAsc: t('sortAlphaAsc'),
    sortAlphaDesc: t('sortAlphaDesc'),
    loadMore: t('loadMore'),
    noResults: t('noResults'),
  }

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Blog - ¡Qué Bárbaro!' }} />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy px-8 py-24 md:px-12 md:py-36">
        {heroImage && (
          <>
            {/* Background image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10" />
          </>
        )}

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-4 font-neue text-xs uppercase tracking-[0.25em] text-white/50">
            {t('eyebrow')}
          </p>
          <h1 className="font-primary max-w-3xl text-4xl uppercase tracking-wide text-white md:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 max-w-xl font-neue text-sm leading-relaxed text-white/70">
            {t('heroDescription')}
          </p>
        </div>
      </div>

      {/* All posts - unified grid with category filter pills */}
      <AllPostsSection locale={locale} categories={CATEGORIES} labels={allPostsLabels} />
    </>
  )
}
