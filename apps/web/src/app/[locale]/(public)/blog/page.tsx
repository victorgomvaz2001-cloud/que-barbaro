export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function BlogPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/blog' : `/${locale}/blog`

  return (
    <div className="mx-auto max-w-7xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Blog — Que Bárbaro' }} />
      <h1
        className="font-primary text-5xl uppercase tracking-wide text-navy"
      >
        Blog
      </h1>
    </div>
  )
}
