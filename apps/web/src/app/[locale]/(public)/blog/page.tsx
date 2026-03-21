import { getLocale, getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import FeaturedPosts from '@/components/blog/FeaturedPosts'
import CategoryFilter from '@/components/blog/CategoryFilter'
import BlogGrid from '@/components/blog/BlogGrid'
import Pagination from '@/components/blog/Pagination'
import type { IBlogPost, BlogPageResponse } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
const POSTS_PER_PAGE = 9
const FEATURED_COUNT = 3

async function fetchFeatured(locale: string): Promise<IBlogPost[]> {
  try {
    const res = await fetch(
      `${API_URL}/blog/page?offset=0&limit=${FEATURED_COUNT}&featured=true&locale=${locale}`,
      { next: { revalidate: 60 } },
    )
    if (!res.ok) return []
    const json: BlogPageResponse = await res.json()
    return json.data
  } catch {
    return []
  }
}

async function fetchPage(
  page: number,
  category: string | null,
  locale: string,
): Promise<BlogPageResponse> {
  const offset = (page - 1) * POSTS_PER_PAGE
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(POSTS_PER_PAGE),
    locale,
  })
  if (category) params.set('category', category)

  try {
    const res = await fetch(`${API_URL}/blog/page?${params.toString()}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return { data: [], total: 0, hasMore: false }
    const result: BlogPageResponse = await res.json()
    return result
  } catch {
    return { data: [], total: 0, hasMore: false }
  }
}

async function fetchCategories(locale: string): Promise<string[]> {
  try {
    const res = await fetch(`${API_URL}/blog/categories?locale=${locale}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return []
    const json: { data: string[] } = await res.json()
    return json.data
  } catch {
    return []
  }
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('blog')])
  const seoRoute = locale === 'es' ? '/blog' : `/${locale}/blog`

  const { category, page: pageParam } = await searchParams
  const activeCategory = category ?? null
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  const [featured, pageResult, categories] = await Promise.all([
    fetchFeatured(locale),
    fetchPage(page, activeCategory, locale),
    fetchCategories(locale),
  ])

  const totalPages = Math.ceil(pageResult.total / POSTS_PER_PAGE)

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Blog - Que Bárbaro' }} />

      {/* Hero */}
      <div className="border-b border-navy/10 px-8 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-navy/40">
            {t('eyebrow')}
          </p>
          <h1 className="font-primary text-6xl uppercase tracking-wide text-navy md:text-8xl">
            Blog
          </h1>
        </div>
      </div>

      {/* Featured editorial grid */}
      {!activeCategory && page === 1 && featured.length > 0 && (
        <div className="px-8 pt-16 md:px-12">
          <div className="mx-auto max-w-7xl">
            <FeaturedPosts posts={featured} />
          </div>
        </div>
      )}

      {/* Grid + filters */}
      <div className="px-8 py-16 md:px-12 md:py-24">
        <div className="mx-auto max-w-7xl">
          <CategoryFilter categories={categories} active={activeCategory} />
          <BlogGrid posts={pageResult.data} />
          <Pagination page={page} totalPages={totalPages} />
        </div>
      </div>
    </>
  )
}
