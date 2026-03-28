export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import GaleriaHero from '@/components/galeria/GaleriaHero'
import GaleriaGrid from '@/components/galeria/GaleriaGrid'
import GaleriaAntesYDespues from '@/components/galeria/GaleriaAntesYDespues'
import GaleriaEspacio from '@/components/galeria/GaleriaEspacio'
import GaleriaEventos from '@/components/galeria/GaleriaEventos'
import GaleriaCta from '@/components/galeria/GaleriaCta'

export default async function GaleriaPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/galeria' : `/${locale}/galeria`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Galería — Qué Bárbaro' }} />
      <GaleriaHero />
      <GaleriaGrid />
      <GaleriaAntesYDespues />
      <GaleriaEspacio />
      <GaleriaEventos />
      <GaleriaCta />
    </>
  )
}
