export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function TratamientosPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/tratamientos' : `/${locale}/tratamientos`

  return (
    <div className="mx-auto max-w-7xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Tratamientos - ¡Qué Bárbaro!' }} />
      <h1
        className="font-primary text-5xl uppercase tracking-wide text-navy"
      >
        Tratamientos
      </h1>
    </div>
  )
}
