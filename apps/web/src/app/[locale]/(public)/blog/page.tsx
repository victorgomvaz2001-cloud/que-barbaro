import { getLocale, getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import CategoryCarousel from '@/components/blog/CategoryCarousel'
import { getSectionBackgrounds } from '@/lib/getSectionBackgrounds'
import type { IBlogCategory, IBlogPost, BlogPageResponse } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

async function getCategories(): Promise<IBlogCategory[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json() as { data: IBlogCategory[] }
    return json.data ?? []
  } catch {
    return []
  }
}

async function getPostsByLocale(locale: string): Promise<IBlogPost[]> {
  try {
    const res = await fetch(`${API_URL}/blog/page?locale=${locale}&limit=200`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json() as BlogPageResponse
    return json.data ?? []
  } catch {
    return []
  }
}

export default async function BlogPage() {
  const [locale, t, bg] = await Promise.all([
    getLocale(),
    getTranslations('blog'),
    getSectionBackgrounds('blog'),
  ])
  const heroImage = bg['hero'] ?? null
  const seoRoute = locale === 'es' ? '/blog' : `/${locale}/blog`

  const [categories, posts] = await Promise.all([
    getCategories(),
    getPostsByLocale(locale),
  ])

  const postsByCategory = new Map<string, IBlogPost[]>()
  for (const post of posts) {
    const list = postsByCategory.get(post.category) ?? []
    list.push(post)
    postsByCategory.set(post.category, list)
  }

  const visibleCategories = categories.filter((cat) => (postsByCategory.get(cat.slug)?.length ?? 0) > 0)

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Blog - ¡Qué Bárbaro!' }} />

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-navy/10 bg-navy px-8 py-24 md:px-12 md:py-36">
        {heroImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/10" />
          </>
        )}
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="mb-4 font-neue text-xs uppercase tracking-[0.25em] text-white">
            {t('eyebrow')}
          </p>
          <h1 className="font-primary max-w-3xl text-4xl uppercase tracking-wide text-white md:text-6xl">
            {t('heroTitle')}
          </h1>
          <p className="mt-6 max-w-xl font-neue text-md leading-relaxed text-white">
            {t('heroDescription')}
          </p>
        </div>
      </div>

      {/* Category carousels */}
      {visibleCategories.length === 0 ? (
        <div className="px-8 py-24 text-center md:px-12">
          <p className="font-neue text-sm text-navy/40">{t('noResults')}</p>
        </div>
      ) : (
        visibleCategories.map((category) => (
          <CategoryCarousel
            key={category._id}
            title={locale === 'es' ? category.nameEs : category.nameEn}
            description={locale === 'es' ? category.descriptionEs : category.descriptionEn}
            posts={postsByCategory.get(category.slug) ?? []}
          />
        ))
      )}
    </>
  )
}
