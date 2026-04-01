export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function EquipoPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/equipo' : `/${locale}/equipo`

  return (
    <div className="mx-auto max-w-7xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Equipo - ¡Qué Bárbaro!' }} />
      <h1
        className="font-primary text-5xl uppercase tracking-wide text-navy"
      >
        Equipo
      </h1>
    </div>
  )
}
