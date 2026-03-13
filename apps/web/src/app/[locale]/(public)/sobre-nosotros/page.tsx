export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function SobreNosotrosPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/sobre-nosotros' : `/${locale}/sobre-nosotros`

  return (
    <div className="mx-auto max-w-7xl px-8 py-24">
      <SEOHead route={seoRoute} fallback={{ title: 'Sobre Nosotros — Que Bárbaro' }} />
      <h1
        className="font-primary text-5xl uppercase tracking-wide text-navy"
      >
        Sobre Nosotros
      </h1>
    </div>
  )
}
