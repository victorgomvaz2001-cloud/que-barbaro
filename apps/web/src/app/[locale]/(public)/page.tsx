export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import Hero from '@/components/home/Hero'
import ValueProposition from '@/components/home/ValueProposition'
import ExperienceSection from '@/components/home/ExperienceSection'
import FeaturedServices from '@/components/home/FeaturedServices'

export default async function HomePage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/' : `/${locale}`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Que Bárbaro' }} />
      <Hero />
      <ValueProposition />
      <ExperienceSection />
      <FeaturedServices />
    </>
  )
}
