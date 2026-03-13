export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function PoliticaCookiesPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/politica-cookies' : `/${locale}/politica-cookies`

  return (
    <div className="mx-auto max-w-3xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Política de Cookies — Que Bárbaro' }} />
      <h1
        style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-navy)' }}
        className="text-5xl uppercase tracking-wide"
      >
        Política de Cookies
      </h1>
    </div>
  )
}
