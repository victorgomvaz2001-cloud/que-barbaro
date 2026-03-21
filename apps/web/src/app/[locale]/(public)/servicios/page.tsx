export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import ServiciosSection from '@/components/servicios/ServiciosSection'

export default async function ServiciosPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/servicios' : `/${locale}/servicios`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Servicios - Que Bárbaro' }} />
      <ServiciosSection />
    </>
  )
}
