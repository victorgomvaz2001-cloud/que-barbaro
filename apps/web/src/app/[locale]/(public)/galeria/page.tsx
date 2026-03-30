export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import GaleriaHero from '@/components/galeria/GaleriaHero'
import GaleriaServicios from '@/components/galeria/GaleriaServicios'
import GaleriaAntesYDespues from '@/components/galeria/GaleriaAntesYDespues'
import GaleriaCta from '@/components/galeria/GaleriaCta'

export default async function GaleriaPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/galeria' : `/${locale}/galeria`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Galería - Qué Bárbaro' }} />
      <GaleriaHero />
      <GaleriaServicios />
      <GaleriaAntesYDespues />
      <GaleriaCta />
    </>
  )
}
