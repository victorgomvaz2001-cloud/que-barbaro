export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function GaleriaPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/galeria' : `/${locale}/galeria`

  return (
    <div className="mx-auto max-w-7xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Galería — Que Bárbaro' }} />
      <h1
        className="font-primary text-5xl uppercase tracking-wide text-navy"
      >
        Galería
      </h1>
    </div>
  )
}
