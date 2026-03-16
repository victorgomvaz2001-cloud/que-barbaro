export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import ElSalonSlider from '@/components/salon/ElSalonSlider'

export default async function ElSalonPage() {
  const locale = await getLocale()
  const seoRoute = locale === 'es' ? '/el-salon' : `/${locale}/el-salon`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'El Salón - Que Bárbaro' }} />
      <ElSalonSlider />
    </>
  )
}
