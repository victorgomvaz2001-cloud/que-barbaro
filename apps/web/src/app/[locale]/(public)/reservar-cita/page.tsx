export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function ReservarCitaPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/reservar-cita' : `/${locale}/reservar-cita`

  return (
    <div className="mx-auto max-w-7xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Reservar Cita — Que Bárbaro' }} />
      <h1
        className="font-primary text-5xl uppercase tracking-wide text-navy"
      >
        Reservar Cita
      </h1>
    </div>
  )
}
