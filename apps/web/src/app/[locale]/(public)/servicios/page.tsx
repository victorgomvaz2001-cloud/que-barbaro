export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function ServiciosPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/servicios' : `/${locale}/servicios`

  return (
    <div className="mx-auto max-w-7xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Servicios - Que Bárbaro' }} />
      <h1
        className="font-primary text-5xl uppercase tracking-wide text-navy"
      >
        Servicios
      </h1>
    </div>
  )
}
