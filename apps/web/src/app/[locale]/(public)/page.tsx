export const dynamic = 'force-dynamic'

import { getTranslations, getLocale } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

export default async function HomePage() {
  const locale = await getLocale()
  const t = await getTranslations('home')
  const seoRoute = locale === 'es' ? '/' : `/${locale}`

  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <SEOHead route={seoRoute} fallback={{ title: t('title') }} />
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">{t('title')}</h1>
      <p className="mt-4 text-lg text-gray-600">{t('description')}</p>
    </div>
  )
}
