export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import Hero from '@/components/home/Hero'
import ValueProposition from '@/components/home/ValueProposition'
import ExperienceSection from '@/components/home/ExperienceSection'
import FeaturedServices from '@/components/home/FeaturedServices'
import HomeBrands from '@/components/home/HomeBrands'
import PricingSection from '@/components/home/PricingSection'
import TestimonialsSection from '@/components/salon/TestimonialsSection'
import CtaSection from '@/components/salon/CtaSection'
import FaqSection from '@/components/home/FaqSection'
import MentionsSection from '@/components/home/MentionsSection'
import HomeContact from '@/components/home/HomeContact'

export default async function HomePage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/' : `/${locale}`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Qué Bárbaro' }} />
      <Hero />
      <ValueProposition />
      <ExperienceSection />
      <FeaturedServices />
      <HomeBrands />
      <PricingSection />
      <TestimonialsSection />
      <CtaSection />
      <FaqSection />
      <MentionsSection />
      <HomeContact />
    </>
  )
}
