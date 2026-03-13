export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function MarcasPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/marcas' : `/${locale}/marcas`

  return (
    <div className="mx-auto max-w-7xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Marcas — Que Bárbaro' }} />
      <h1
        style={{ fontFamily: 'var(--font-primary)', color: 'var(--color-navy)' }}
        className="text-5xl uppercase tracking-wide"
      >
        Marcas
      </h1>
    </div>
  )
}
