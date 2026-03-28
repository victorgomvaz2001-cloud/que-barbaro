export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import SalonHero from '@/components/salon/SalonHero'
import SalonHistoria from '@/components/salon/SalonHistoria'
import SalonExperiencia from '@/components/salon/SalonExperiencia'
import SalonEquipo from '@/components/salon/SalonEquipo'
import SalonMarcas from '@/components/salon/SalonMarcas'
import SalonOpiniones from '@/components/salon/SalonOpiniones'
import SalonCtaReserva from '@/components/salon/SalonCtaReserva'

export default async function ElSalonPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/el-salon' : `/${locale}/el-salon`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'El Salón - Que Bárbaro' }} />
      <SalonHero />
      <SalonHistoria />
      <SalonExperiencia />
      <SalonEquipo />
      <SalonMarcas />
      <SalonOpiniones />
      <SalonCtaReserva />
    </>
  )
}
