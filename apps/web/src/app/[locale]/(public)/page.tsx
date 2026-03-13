export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function HomePage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/' : `/${locale}`

  return (
    <div className="mx-auto max-w-7xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Que Bárbaro' }} />
      <h1 className="font-primary text-5xl uppercase tracking-wide text-navy">
        Inicio
      </h1>
    </div>
  )
}
