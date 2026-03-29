export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function PoliticaPrivacidadPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/politica-privacidad' : `/${locale}/politica-privacidad`

  return (
    <div className="mx-auto max-w-3xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Política de Privacidad - Qué Bárbaro' }} />
      <h1
        className="font-primary text-5xl uppercase tracking-wide text-navy"
      >
        Política de Privacidad
      </h1>
    </div>
  )
}
