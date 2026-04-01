export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import ServiciosNav from '@/components/servicios/ServiciosNav'
import ServiciosHero from '@/components/servicios/ServiciosHero'
import ServiciosCortes from '@/components/servicios/ServiciosCortes'
import ServiciosColor from '@/components/servicios/ServiciosColor'
import ServiciosTratamientos from '@/components/servicios/ServiciosTratamientos'
import ServiciosMaquillaje from '@/components/servicios/ServiciosMaquillaje'
import ServiciosManicura from '@/components/servicios/ServiciosManicura'
import ServiciosReserva from '@/components/servicios/ServiciosReserva'
import { getSectionBackgrounds } from '@/lib/getSectionBackgrounds'

export default async function ServiciosPage() {
  const [locale, bg] = await Promise.all([
    getLocale(),
    getSectionBackgrounds('servicios'),
  ])
  const seoRoute = locale === 'es' ? '/servicios' : `/${locale}/servicios`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Servicios - ¡Qué Bárbaro!' }} />
      <ServiciosNav />
      <ServiciosHero backgroundImage={bg['hero']} />
      <ServiciosCortes />
      <ServiciosColor />
      <ServiciosTratamientos />
      <ServiciosMaquillaje />
      <ServiciosManicura />
      <ServiciosReserva />
    </>
  )
}
