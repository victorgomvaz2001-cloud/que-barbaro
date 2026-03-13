export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function AvisoLegalPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/aviso-legal' : `/${locale}/aviso-legal`

  return (
    <div className="mx-auto max-w-3xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Aviso Legal — Que Bárbaro' }} />
      <h1
        className="font-primary text-5xl uppercase tracking-wide text-navy"
      >
        Aviso Legal
      </h1>
    </div>
  )
}
