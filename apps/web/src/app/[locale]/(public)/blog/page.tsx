import { getLocale, getMessages, getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import CategoryCarousel from '@/components/blog/CategoryCarousel'
import AllPostsSection from '@/components/blog/AllPostsSection'
import type { IBlogPost, BlogPageResponse } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
const HERO_IMAGE = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/hero.jpg'
const CATEGORY_LIMIT = 5

const CATEGORIES = [
  'Cuidado capilar',
  'Coloración',
  'Rizos y método curly',
  'Tendencias',
  'Eventos y ocasiones especiales',
  'Noticias de Qué Bárbaro',
] as const

async function fetchCategoryPosts(category: string, locale: string): Promise<IBlogPost[]> {
  try {
    const params = new URLSearchParams({
      offset: '0',
      limit: String(CATEGORY_LIMIT),
      locale,
      category,
    })
    const res = await fetch(`${API_URL}/blog/page?${params.toString()}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const json: BlogPageResponse = await res.json()
    return json.data
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const [locale, t, messages] = await Promise.all([getLocale(), getTranslations('blog'), getMessages()])
  const seoRoute = locale === 'es' ? '/blog' : `/${locale}/blog`

  // Fetch all categories in parallel
  const categoryResults = await Promise.all(
    CATEGORIES.map((cat) => fetchCategoryPosts(cat, locale)),
  )

  const blogCategories = (messages as Record<string, unknown>)['blog'] as Record<string, Record<string, Record<string, string>>>
  const catDescriptions = blogCategories['categories'] ?? {}

  const categoryData = CATEGORIES.map((cat, i) => ({
    key: cat,
    title: cat,
    description: catDescriptions[cat]?.['description'] ?? '',
    posts: categoryResults[i] ?? [],
  }))

  const allPostsLabels = {
    title: t('allPostsTitle'),
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
      <SEOHead route={seoRoute} fallback={{ title: 'Blog - Que Bárbaro' }} />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy px-8 py-24 md:px-12 md:py-36">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-navy/70 to-navy/30" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-4 font-neue font-light text-xs uppercase tracking-[0.25em] text-white/50">
            {t('eyebrow')}
          </p>
          <h1 className="font-primary max-w-3xl text-4xl uppercase tracking-wide text-white md:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 max-w-xl font-neue font-light text-sm leading-relaxed text-white/70">
            {t('heroDescription')}
          </p>
        </div>
      </div>

      {/* Category carousels */}
      {categoryData.map(({ key, title, description, posts }) => (
        <CategoryCarousel
          key={key}
          title={title}
          description={description}
          posts={posts}
        />
      ))}

      {/* All posts section — client component with filters + load more */}
      <AllPostsSection locale={locale} labels={allPostsLabels} />
    </>
  )
}
