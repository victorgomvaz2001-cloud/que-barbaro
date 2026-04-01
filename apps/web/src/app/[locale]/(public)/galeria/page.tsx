export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import GaleriaHero from '@/components/galeria/GaleriaHero'
import GaleriaServicios from '@/components/galeria/GaleriaServicios'
import GaleriaAntesYDespues from '@/components/galeria/GaleriaAntesYDespues'
import GaleriaCta from '@/components/galeria/GaleriaCta'
import { getSectionBackgrounds } from '@/lib/getSectionBackgrounds'

export default async function GaleriaPage() {
  const [locale, bg] = await Promise.all([
    getLocale(),
    getSectionBackgrounds('galeria'),
  ])
  const seoRoute = locale === 'es' ? '/galeria' : `/${locale}/galeria`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Galería - ¡Qué Bárbaro!' }} />
      <GaleriaHero backgroundImage={bg['hero']} />
      <GaleriaServicios />
      <GaleriaAntesYDespues />
      <GaleriaCta />
    </>
  )
}
